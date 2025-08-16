import Chat from "../models/chat.model.js";

// Get all chats
export const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate("user", "fullName profilePhoto profileType")
      .sort({ createdAt: 1 });

    return res.json({ success: true, data: chats });
  } catch (err) {
    return res.status(500).json({ success: false, meaaage: "Failed to fetch chats" });
  };
};

// Create chat
export const createChat = async (req, res) => {
  try {
    const { user, message, time } = req.body;

    const newChat = new Chat({
      user,
      message,
      time,
    });

    await newChat.save();

    return res.status(201).json({ success: true, data: newChat });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to send chat" });
  };
};
