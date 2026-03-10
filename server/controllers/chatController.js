const Chat = require('../models/Chat');
const Message = require('../models/Message');

// Get or create a chat between two users
const getOrCreateChat = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;

    if (!userId1 || !userId2) {
      return res.status(400).json({ message: 'Both user IDs are required' });
    }

    // Find existing chat
    let chat = await Chat.findOne({
      participants: { $all: [userId1, userId2] }
    }).populate('participants', 'nickname gender');

    if (!chat) {
      chat = await Chat.create({
        participants: [userId1, userId2]
      });
      chat = await chat.populate('participants', 'nickname gender');
    }

    res.json(chat);
  } catch (error) {
    console.error('Get/create chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get chat messages
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({ chat: chatId })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('sender', 'nickname gender');

    res.json(messages.reverse());
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Save a message
const saveMessage = async (req, res) => {
  try {
    const { chatId, senderId, text, image } = req.body;

    if (!chatId || !senderId || !text) {
      return res.status(400).json({ message: 'chatId, senderId, and text are required' });
    }

    const message = await Message.create({
      chat: chatId,
      sender: senderId,
      text,
      image: image || null
    });

    // Update last message in chat
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: {
        text,
        sender: senderId,
        timestamp: new Date()
      }
    });

    const populated = await message.populate('sender', 'nickname gender');
    res.status(201).json(populated);
  } catch (error) {
    console.error('Save message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's chats
const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({
      participants: userId
    })
      .populate('participants', 'nickname gender')
      .sort({ 'lastMessage.timestamp': -1 });

    res.json(chats);
  } catch (error) {
    console.error('Get user chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a message (soft delete, sender only)
const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own messages' });
    }

    message.isDeleted = true;
    message.text = '';
    message.image = null;
    await message.save();

    res.json({ message: 'Message deleted', messageId });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrCreateChat,
  getChatMessages,
  saveMessage,
  getUserChats,
  deleteMessage
};
