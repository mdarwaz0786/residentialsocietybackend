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

        const populatedMessage = await Chat
          .findById(newMessage?._id)
          .populate("user", "fullName profilePhoto profileType")

        io.emit("receiveMessage", populatedMessage);

        const payload = {
          notification: {
            title: populatedMessage?.user?.fullName,
            body: populatedMessage?.message,
          },
          data: {
            link: "residentialsociety://Chat",
          },
        };

        const users = await User.find({ fcmToken: { $exists: true } }).select("fcmToken");
        const tokens = users.map((u) => u?.fcmToken)?.filter(Boolean);

        if (tokens?.length > 0) {
          await firebase.messaging().sendEachForMulticast({
            tokens,
            ...payload,
          });
        };

      } catch (err) {
        socket.emit("errorMessage", { error: "Message not sent." });
      };
    });

    socket.on("disconnect", () => { });
  });
};

export default chatSocketHandler;
