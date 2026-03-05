const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

// @desc    Access or create a one-on-one chat
// @route   POST /api/chats
const accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "UserId required" });

  try {
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] },
    })
      .populate("users", "-password")
      .populate("latestMessage");

    if (chat) {
      chat = await User.populate(chat, {
        path: "latestMessage.sender",
        select: "name profilePic email",
      });
      return res.json(chat);
    }

    const newChat = await Chat.create({
      chatName: "private",
      isGroupChat: false,
      users: [req.user._id, userId],
    });
    const fullChat = await Chat.findById(newChat._id).populate("users", "-password");
    res.status(201).json(fullChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all chats for a user
// @route   GET /api/chats
const fetchChats = async (req, res) => {
  try {
    let chats = await Chat.find({ users: { $in: [req.user._id] } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name profilePic email",
    });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a group chat
// @route   POST /api/chats/group
const createGroupChat = async (req, res) => {
  const { users, chatName } = req.body;
  if (!users || !chatName) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  let parsedUsers = typeof users === "string" ? JSON.parse(users) : users;
  if (parsedUsers.length < 2) {
    return res.status(400).json({ message: "At least 2 users required for group chat" });
  }
  parsedUsers.push(req.user._id);

  try {
    const groupChat = await Chat.create({
      chatName,
      isGroupChat: true,
      users: parsedUsers,
      groupAdmin: req.user._id,
    });
    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(201).json(fullGroupChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/chats/message
const sendMessage = async (req, res) => {
  const { content, chatId, fileUrl, fileType } = req.body;
  if (!chatId) return res.status(400).json({ message: "chatId required" });

  try {
    let message = await Message.create({
      sender: req.user._id,
      content: content || "",
      chat: chatId,
      fileUrl: fileUrl || "",
      fileType: fileType || "",
    });

    message = await message.populate("sender", "name profilePic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name profilePic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all messages for a chat
// @route   GET /api/chats/:chatId/messages
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name profilePic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { accessChat, fetchChats, createGroupChat, sendMessage, getMessages };
