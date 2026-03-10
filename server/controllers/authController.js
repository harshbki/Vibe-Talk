const crypto = require('crypto');
const User = require('../models/User');

// Generate unique nickname suggestions
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

// Guest login
const guestLogin = async (req, res, next) => {
  try {
    let { nickname, gender } = req.body;

    if (!nickname || !gender) {
      return res.status(400).json({ message: 'Nickname and gender are required' });
    }

    if (!['Male', 'Female'].includes(gender)) {
      return res.status(400).json({ message: 'Gender must be Male or Female' });
    }

    // Check if nickname already exists
    const existingUser = await User.findOne({ nickname });
    if (existingUser) {
      const suggestions = await generateSuggestions(nickname);
      return res.status(409).json({
        message: `"${nickname}" is already taken. Try one of these:`,
        suggestions
      });
    }

    const user = await User.create({
      nickname,
      gender,
      isGuest: true
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Guest login error:', error);
    next(error);
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Profile login — for users who completed their profile (isFullAccount)
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

    if (!user.isFullAccount) {
      return res.status(400).json({ message: 'This account has no profile. Use guest login instead.' });
    }

    // Verify fullName (case-insensitive)
    if (user.fullName.toLowerCase().trim() !== fullName.toLowerCase().trim()) {
      return res.status(401).json({ message: 'Name does not match this account' });
    }

    // Verify dateOfBirth
    const inputDob = new Date(dateOfBirth).toISOString().split('T')[0];
    const storedDob = new Date(user.dateOfBirth).toISOString().split('T')[0];
    if (inputDob !== storedDob) {
      return res.status(401).json({ message: 'Date of birth does not match this account' });
    }

    user.lastSeen = new Date();
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error('Profile login error:', error);
    next(error);
  }
};

module.exports = { guestLogin, getUserById, profileLogin };
