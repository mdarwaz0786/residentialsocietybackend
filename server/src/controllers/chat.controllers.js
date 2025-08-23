import Chat from "../models/chat.model.js";

// Get all chats
export const getAllChats = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    const chats = await Chat.find()
      .populate({
        path: "user",
        select: "fullName profilePhoto profileType",
        populate: {
          path: "profile",
          select: "flat",
          options: { strictPopulate: false },
          populate: {
            path: "flat",
            select: "flatNumber",
            options: { strictPopulate: false },
          },
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalChats = await Chat.countDocuments();

    return res.json({
      success: true,
      data: chats,
      pagination: {
        total: totalChats,
        page,
        limit,
        totalPages: Math.ceil(totalChats / limit),
        hasMore: page * limit < totalChats,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch chats" });
  };
};

// Create chat
export const createChat = async (req, res) => {
  try {
    const { user, message, time } = req.body;
    const newChat = new Chat({ user, message, time });
    await newChat.save();
    return res.status(201).json({ success: true, data: newChat });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to send chat." });
  };
};
