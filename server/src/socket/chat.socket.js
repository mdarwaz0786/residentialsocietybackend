import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";
import firebase from "../firebase/index.js";

const chatSocketHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("sendMessage", async (messageData) => {
      try {
        const newMessage = new Chat({
          user: messageData.user,
          message: messageData.message,
          time: messageData.time,
        });

        await newMessage.save();

        const populatedMessage = await Chat.findById(newMessage?._id)
          .populate({
            path: "user",
            select: "fullName profilePhoto profileType profile",
            populate: {
              path: "profile",
              select: "flat",
              populate: {
                path: "flat",
                select: "flatNumber",
              },
            },
          });

        io.emit("receiveMessage", populatedMessage);
        setImmediate(() => sendPushNotification(populatedMessage));
      } catch (err) {
        socket.emit("errorMessage", { error: "Message not sent." });
      };
    });

    socket.on("disconnect", () => { });
  });
};

const sendPushNotification = async (populatedMessage) => {
  try {
    const payload = {
      notification: {
        title: populatedMessage?.user?.fullName,
        body: populatedMessage?.message,
      },
      data: {
        link: "residentialsociety://Chat",
      },
    };

    const users = await User.find({
      _id: { $ne: populatedMessage?.user?._id },
      fcmToken: { $exists: true }
    }).select("fcmToken");

    const tokens = users.map((u) => u?.fcmToken)?.filter(Boolean);

    if (tokens?.length > 0) {
      firebase.messaging().sendEachForMulticast({
        tokens,
        ...payload,
      });
    };
  } catch (err) {
    console.error("Push notification error:", err.message);
  };
};

export default chatSocketHandler;
