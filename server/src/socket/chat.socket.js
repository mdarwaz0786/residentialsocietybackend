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
        io.emit("receiveMessage", newMessage);
      } catch (err) {
        socket.emit("errorMessage", { error: "Message not send." });
      };
    });

    socket.on("disconnect", () => { });
  });
};

export default chatSocketHandler;
