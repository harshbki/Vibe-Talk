const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const { requireMongo } = require('../middleware');
const { authenticate, requireSelfParam } = require('../middleware/auth');

router.use(requireMongo);
router.use(authenticate);

router.get('/:userId', requireSelfParam('userId'), async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

router.get('/:userId/unread-count', requireSelfParam('userId'), async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      user: req.params.userId,
      read: false,
    });
    res.json({ count });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/read', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid notification ID format' });
    }
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (String(notification.user) !== req.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    next(error);
  }
});

router.put('/:userId/read-all', requireSelfParam('userId'), async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.params.userId, read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (String(notification.user) !== req.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await notification.deleteOne();
    res.json({ message: 'Notification deleted', id: req.params.id });
  } catch (error) {
    next(error);
  }
});

router.delete('/user/:userId/all', requireSelfParam('userId'), async (req, res, next) => {
  try {
    const result = await Notification.deleteMany({ user: req.params.userId });
    res.json({ message: 'All notifications deleted', deletedCount: result.deletedCount });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
