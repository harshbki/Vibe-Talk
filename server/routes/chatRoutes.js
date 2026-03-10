const express = require('express');
const router = express.Router();
const {
  getOrCreateChat,
  getChatMessages,
  saveMessage,
  getUserChats,
  deleteMessage
} = require('../controllers/chatController');

// GET /api/chat/health - Check if chat service is running
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chat service is running' });
});

// POST /api/chat - Get or create a chat between two users
router.post('/', getOrCreateChat);

// GET /api/chat/:chatId/messages - Get messages in a chat
router.get('/:chatId/messages', getChatMessages);

// POST /api/chat/:chatId/messages - Save a message
router.post('/:chatId/messages', saveMessage);

// GET /api/chat/user/:userId - Get all chats for a user
router.get('/user/:userId', getUserChats);

// DELETE /api/chat/messages/:messageId - Delete a message (soft delete)
router.delete('/messages/:messageId', deleteMessage);

module.exports = router;
