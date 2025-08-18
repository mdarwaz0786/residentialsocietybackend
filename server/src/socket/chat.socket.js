import Chat from "../models/chat.model.js";

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
          .populate("user", "fullName profilePhoto profileType");

        io.emit("receiveMessage", populatedMessage);

      } catch (err) {
        socket.emit("errorMessage", { error: "Message not sent." });
      };
    });

    socket.on("disconnect", () => { });
  });
};

export default chatSocketHandler;
