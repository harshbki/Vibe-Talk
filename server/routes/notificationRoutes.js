const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// GET /api/notifications/:userId - Get user notifications
router.get('/:userId', async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

// GET /api/notifications/:userId/unread-count - Get unread count
router.get('/:userId/unread-count', async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      user: req.params.userId,
      read: false
    });
    res.json({ count });
  } catch (error) {
    next(error);
  }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    next(error);
  }
});

// PUT /api/notifications/:userId/read-all - Mark all notifications as read
router.put('/:userId/read-all', async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.params.userId, read: false },
      { read: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
