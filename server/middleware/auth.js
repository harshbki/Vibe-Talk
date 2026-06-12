const mongoose = require('mongoose');
const { verifyToken } = require('../utils/jwt');
const Chat = require('../models/Chat');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  try {
    const { userId } = verifyToken(header.slice(7));
    req.userId = String(userId);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/** Optional auth — sets req.userId when token present. */
const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      const { userId } = verifyToken(header.slice(7));
      req.userId = String(userId);
    } catch {
      /* ignore invalid optional token */
    }
  }
  next();
};

const requireSelfParam =
  (param = 'userId') =>
  (req, res, next) => {
    const target = req.params[param] || req.body?.userId;
    if (!target || String(target) !== req.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };

const requireSelfBody =
  (field = 'userId') =>
  (req, res, next) => {
    const target = req.body?.[field];
    if (!target || String(target) !== req.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };

const requireChatParticipant = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    if (!mongoose.isValidObjectId(chatId)) {
      return res.status(400).json({ message: 'Invalid chat ID' });
    }
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    const ok = chat.participants.some((p) => String(p) === req.userId);
    if (!ok) return res.status(403).json({ message: 'Forbidden' });
    req.chat = chat;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  authenticate,
  optionalAuth,
  requireSelfParam,
  requireSelfBody,
  requireChatParticipant,
};
