const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Store for online users (will be updated from socket)
let onlineUsersMap = new Map();

// Function to update online users from socket
const updateOnlineUsers = (users) => {
  onlineUsersMap = new Map(users.map(u => [u._id, true]));
};

// GET /api/users - Get users with optional gender filter
router.get('/', async (req, res) => {
  try {
    const { gender, excludeId } = req.query;
    
    let query = {};
    
    // Filter by gender if provided
    if (gender && ['Male', 'Female'].includes(gender)) {
      query.gender = gender;
    }
    
    // Exclude current user if provided
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const users = await User.find(query)
      .select('nickname gender profilePicture createdAt')
      .sort({ createdAt: -1 });
    
    // Add online status to each user
    const usersWithStatus = users.map(user => ({
      ...user.toObject(),
      isOnline: onlineUsersMap.has(user._id.toString())
    }));
    
    res.json(usersWithStatus);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/:id - Get single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('nickname gender fullName bio profilePicture dateOfBirth location interests createdAt freeCallsUsed privacy');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      ...user.toObject(),
      isOnline: onlineUsersMap.has(user._id.toString())
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/users/increment-call - Increment free calls used
router.post('/increment-call', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { freeCallsUsed: 1 } },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      freeCallsUsed: user.freeCallsUsed 
    });
  } catch (error) {
    console.error('Increment call error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/users/update - Update nickname/gender
router.put('/update', async (req, res, next) => {
  try {
    const { userId, nickname, gender } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const updates = {};
    if (nickname) {
      const existing = await User.findOne({ nickname, _id: { $ne: userId } });
      if (existing) {
        return res.status(409).json({ message: 'Nickname already taken' });
      }
      updates.nickname = nickname;
    }
    if (gender && ['Male', 'Female'].includes(gender)) {
      updates.gender = gender;
    }

    // Privacy & notification settings
    const { privacy, notifications: notifPrefs } = req.body;
    if (privacy) updates.privacy = privacy;
    if (notifPrefs) updates.notifications = notifPrefs;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/delete - Delete account
router.delete('/delete', async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const Chat = require('../models/Chat');
    const Message = require('../models/Message');
    const Group = require('../models/Group');

    // Remove messages where user is sender
    await Message.deleteMany({ sender: userId });
    // Remove chats where user is participant
    const userChats = await Chat.find({ participants: userId });
    for (const chat of userChats) {
      await Message.deleteMany({ chat: chat._id });
    }
    await Chat.deleteMany({ participants: userId });
    // Remove user from groups, delete groups they admin
    await Group.deleteMany({ admin: userId });
    await Group.updateMany({}, { $pull: { members: userId } });
    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
module.exports.updateOnlineUsers = updateOnlineUsers;
