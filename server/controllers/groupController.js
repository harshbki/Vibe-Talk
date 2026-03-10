const Group = require('../models/Group');
const User = require('../models/User');

// Create a new group
const createGroup = async (req, res, next) => {
  try {
    const { name, adminId, memberIds, isPrivate } = req.body;

    if (!name || !adminId) {
      return res.status(400).json({ message: 'Group name and adminId are required' });
    }

    const allMembers = Array.from(new Set([adminId, ...(memberIds || [])]));

    const group = await Group.create({
      name,
      admin: adminId,
      members: allMembers,
      isPrivate: !!isPrivate
    });

    const populated = await group.populate('members', 'nickname gender profilePicture');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// Get groups for a user
const getUserGroups = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const groups = await Group.find({ members: userId })
      .populate('admin', 'nickname')
      .populate('members', 'nickname gender profilePicture')
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (error) {
    next(error);
  }
};

// Get single group details
const getGroupById = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate('admin', 'nickname gender')
      .populate('members', 'nickname gender profilePicture')
      .populate('joinRequests', 'nickname gender');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    next(error);
  }
};

// Add member to group (admin only)
const addMember = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { userId, requesterId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.admin.toString() !== requesterId) {
      return res.status(403).json({ message: 'Only admin can add members' });
    }

    if (group.members.includes(userId)) {
      return res.status(400).json({ message: 'User already a member' });
    }

    group.members.push(userId);
    await group.save();

    const populated = await group.populate('members', 'nickname gender profilePicture');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// Remove member from group (admin only)
const removeMember = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { userId, requesterId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.admin.toString() !== requesterId) {
      return res.status(403).json({ message: 'Only admin can remove members' });
    }

    if (group.admin.toString() === userId) {
      return res.status(400).json({ message: 'Admin cannot be removed' });
    }

    group.members = group.members.filter(m => m.toString() !== userId);
    await group.save();

    const populated = await group.populate('members', 'nickname gender profilePicture');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// Delete group (admin only)
const deleteGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { requesterId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.admin.toString() !== requesterId) {
      return res.status(403).json({ message: 'Only admin can delete the group' });
    }

    await Group.findByIdAndDelete(groupId);
    res.json({ message: 'Group deleted' });
  } catch (error) {
    next(error);
  }
};

// Get all public groups (for discovery) + private groups (show as private)
const getAllPublicGroups = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const groups = await Group.find()
      .populate('admin', 'nickname')
      .populate('members', 'nickname gender')
      .populate('joinRequests', 'nickname gender')
      .sort({ createdAt: -1 });

    // Return all groups but mark membership status for the requesting user
    const result = groups.map(g => {
      const obj = g.toObject();
      obj.isMember = g.members.some(m => (m._id || m).toString() === userId);
      obj.hasRequested = g.joinRequests.some(r => (r._id || r).toString() === userId);
      return obj;
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Self-join a public group
const joinGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.isPrivate) {
      return res.status(403).json({ message: 'This group is private. Send a join request instead.' });
    }

    if (group.members.some(m => m.toString() === userId)) {
      return res.status(400).json({ message: 'Already a member' });
    }

    group.members.push(userId);
    await group.save();
    const populated = await group.populate('members', 'nickname gender profilePicture');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// Request to join a private group
const requestJoinGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.members.some(m => m.toString() === userId)) {
      return res.status(400).json({ message: 'Already a member' });
    }

    if (group.joinRequests.some(r => r.toString() === userId)) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    group.joinRequests.push(userId);
    await group.save();
    res.json({ message: 'Join request sent' });
  } catch (error) {
    next(error);
  }
};

// Approve a join request (admin only)
const approveJoinRequest = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { userId, requesterId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.admin.toString() !== requesterId) {
      return res.status(403).json({ message: 'Only admin can approve requests' });
    }

    group.joinRequests = group.joinRequests.filter(r => r.toString() !== userId);
    if (!group.members.some(m => m.toString() === userId)) {
      group.members.push(userId);
    }
    await group.save();

    const populated = await group.populate([
      { path: 'members', select: 'nickname gender profilePicture' },
      { path: 'joinRequests', select: 'nickname gender' }
    ]);
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// Reject a join request (admin only)
const rejectJoinRequest = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { userId, requesterId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.admin.toString() !== requesterId) {
      return res.status(403).json({ message: 'Only admin can reject requests' });
    }

    group.joinRequests = group.joinRequests.filter(r => r.toString() !== userId);
    await group.save();
    res.json({ message: 'Request rejected' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGroup,
  getUserGroups,
  getGroupById,
  addMember,
  removeMember,
  deleteGroup,
  getAllPublicGroups,
  joinGroup,
  requestJoinGroup,
  approveJoinRequest,
  rejectJoinRequest
};
