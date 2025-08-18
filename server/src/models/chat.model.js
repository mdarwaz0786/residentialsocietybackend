import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now
  },
  time: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
