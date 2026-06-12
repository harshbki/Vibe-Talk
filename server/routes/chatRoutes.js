const express = require('express');
const router = express.Router();
const {
  getOrCreateChat,
  getChatMessages,
  saveMessage,
  getUserChats,
  deleteMessage,
} = require('../controllers/chatController');
const { requireMongo } = require('../middleware');
const { authenticate, requireSelfParam, requireChatParticipant } = require('../middleware/auth');

router.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbOk = mongoose.connection.readyState === 1;
  res.json({
    status: dbOk ? 'ok' : 'degraded',
    mongo: dbOk ? 'connected' : 'disconnected',
    message: dbOk ? 'Chat service is running' : 'MongoDB is not connected',
  });
});

router.use(requireMongo);
router.use(authenticate);

router.post('/', getOrCreateChat);
router.get('/user/:userId', requireSelfParam('userId'), getUserChats);
router.get('/:chatId/messages', requireChatParticipant, getChatMessages);
router.post('/:chatId/messages', requireChatParticipant, saveMessage);
router.delete('/messages/:messageId', deleteMessage);

module.exports = router;
