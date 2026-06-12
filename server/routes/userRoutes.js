const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const { requireMongo } = require('../middleware');
const { authenticate, requireSelfBody } = require('../middleware/auth');
const { toPublicUser } = require('../utils/userSanitize');

let onlineUsersMap = new Map();

const updateOnlineUsers = (users) => {
  onlineUsersMap = new Map(users.map((u) => [u._id, true]));
};

router.use(requireMongo);

router.get('/', async (req, res) => {
  try {
    const { gender, excludeId } = req.query;

    let query = {
      isFullAccount: true,
      fullName: { $exists: true, $nin: [null, ''] },
      dateOfBirth: { $exists: true, $ne: null },
    };

    if (gender && ['Male', 'Female'].includes(gender)) {
      query.gender = gender;
    }

    if (excludeId) {
      if (!mongoose.isValidObjectId(excludeId)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }
      query._id = { $ne: excludeId };
    }

    const users = await User.find(query)
      .select('nickname gender profilePicture createdAt')
      .sort({ createdAt: -1 });

    const usersWithStatus = users.map((user) => ({
      ...user.toObject(),
      isOnline: onlineUsersMap.has(user._id.toString()),
    }));

    res.json(usersWithStatus);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    const user = await User.findById(req.params.id).select(
      'nickname gender fullName bio profilePicture dateOfBirth location interests createdAt freeCallsUsed privacy'
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      ...toPublicUser(user),
      isOnline: onlineUsersMap.has(user._id.toString()),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.use(authenticate);

router.post('/increment-call', requireSelfBody('userId'), async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findByIdAndUpdate(userId, { $inc: { freeCallsUsed: 1 } }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, freeCallsUsed: user.freeCallsUsed });
  } catch (error) {
    console.error('Increment call error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/update', requireSelfBody('userId'), async (req, res, next) => {
  try {
    const { userId, nickname, gender } = req.body;
    const updates = {};
    if (nickname) {
      const existing = await User.findOne({ nickname, _id: { $ne: userId } });
      if (existing) return res.status(409).json({ message: 'Nickname already taken' });
      updates.nickname = nickname;
    }
    if (gender && ['Male', 'Female'].includes(gender)) updates.gender = gender;
    const { privacy, notifications: notifPrefs } = req.body;
    if (privacy) updates.privacy = privacy;
    if (notifPrefs) updates.notifications = notifPrefs;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.delete('/delete', requireSelfBody('userId'), async (req, res, next) => {
  try {
    const { userId } = req.body;
    const Chat = require('../models/Chat');
    const Message = require('../models/Message');
    const Group = require('../models/Group');

    await Message.deleteMany({ sender: userId });
    const userChats = await Chat.find({ participants: userId });
    for (const chat of userChats) {
      await Message.deleteMany({ chat: chat._id });
    }
    await Chat.deleteMany({ participants: userId });
    await Group.deleteMany({ admin: userId });
    await Group.updateMany({}, { $pull: { members: userId } });
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
module.exports.updateOnlineUsers = updateOnlineUsers;
