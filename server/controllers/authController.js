const crypto = require('crypto');
const User = require('../models/User');
const { isProfileComplete, syncProfileCompleteFlag } = require('../utils/profileUtils');
const { signToken } = require('../utils/jwt');
const { toPublicUser, withAuthToken } = require('../utils/userSanitize');

const generateSuggestions = async (base, count = 5) => {
  const suggestions = [];
  const maxAttempts = count * 5;
  let attempts = 0;
  while (suggestions.length < count && attempts < maxAttempts) {
    attempts++;
    const suffix = crypto.randomInt(100, 9999);
    const candidate = `${base}${suffix}`;
    if (candidate.length > 20) continue;
    const exists = await User.findOne({ nickname: candidate });
    if (!exists && !suggestions.includes(candidate)) {
      suggestions.push(candidate);
    }
  }
  return suggestions;
};

const guestLogin = async (req, res, next) => {
  try {
    let { nickname, gender } = req.body;

    if (!nickname || !gender) {
      return res.status(400).json({ message: 'Nickname and gender are required' });
    }

    if (!['Male', 'Female'].includes(gender)) {
      return res.status(400).json({ message: 'Gender must be Male or Female' });
    }

    const existingUser = await User.findOne({ nickname });
    if (existingUser) {
      const suggestions = await generateSuggestions(nickname);
      return res.status(409).json({
        message: `"${nickname}" is already taken. Try one of these:`,
        suggestions,
      });
    }

    const user = await User.create({
      nickname,
      gender,
      isGuest: true,
    });

    res.status(201).json(withAuthToken(user, signToken(user._id)));
  } catch (error) {
    console.error('Guest login error:', error);
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (req.userId && String(req.userId) === String(user._id)) {
      return res.json(withAuthToken(user, signToken(user._id)));
    }
    res.json(toPublicUser(user));
  } catch (error) {
    next(error);
  }
};

const profileLogin = async (req, res, next) => {
  try {
    const { nickname, fullName, dateOfBirth } = req.body;

    if (!nickname || !fullName || !dateOfBirth) {
      return res.status(400).json({ message: 'Nickname, full name, and date of birth are required' });
    }

    const user = await User.findOne({ nickname });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this nickname' });
    }

    syncProfileCompleteFlag(user);
    if (user.isModified()) await user.save();

    if (!isProfileComplete(user)) {
      return res.status(400).json({
        message: 'Profile is incomplete. Finish name and date of birth on the profile page first.',
      });
    }

    if (user.fullName.toLowerCase().trim() !== fullName.toLowerCase().trim()) {
      return res.status(401).json({ message: 'Name does not match this account' });
    }

    const inputDob = new Date(dateOfBirth).toISOString().split('T')[0];
    const storedDob = new Date(user.dateOfBirth).toISOString().split('T')[0];
    if (inputDob !== storedDob) {
      return res.status(401).json({ message: 'Date of birth does not match this account' });
    }

    user.lastSeen = new Date();
    await user.save();
    res.status(200).json(withAuthToken(user, signToken(user._id)));
  } catch (error) {
    console.error('Profile login error:', error);
    next(error);
  }
};

module.exports = { guestLogin, getUserById, profileLogin };
