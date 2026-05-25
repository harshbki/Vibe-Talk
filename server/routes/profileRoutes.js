const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const User = require('../models/User');
const {
  isCloudinaryConfigured,
  saveLocalFile,
  uploadToCloudinary,
  shouldUseLocalFallback,
} = require('../utils/mediaStorage');

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// GET /api/profile/:userId - Get user profile
router.get('/:userId', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    const user = await User.findById(req.params.userId).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/profile/:userId - Update profile info
router.put('/:userId', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    const { fullName, bio, profilePicture, dateOfBirth, location, interests, gender } = req.body;
    
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (bio !== undefined) updateData.bio = bio;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (location !== undefined) updateData.location = location;
    if (interests !== undefined) updateData.interests = interests;

    // Allow gender editing for profile users.
    if (gender !== undefined) {
      if (!['Male', 'Female'].includes(gender)) {
        return res.status(400).json({ message: 'Gender must be Male or Female' });
      }
      updateData.gender = gender;
    }

    updateData.isFullAccount = true;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/profile/:userId/picture - Upload profile picture
router.post('/:userId/picture', upload.single('file'), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    let pictureUrl;

    if (!isCloudinaryConfigured()) {
      pictureUrl = saveLocalFile(req.file, req).url;
    } else {
      try {
        const result = await uploadToCloudinary(req.file, {
          folder: 'vibetalk/profiles',
          resource_type: 'image',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          ],
        });
        pictureUrl = result.secure_url;
      } catch (cloudinaryError) {
        if (!shouldUseLocalFallback(cloudinaryError)) throw cloudinaryError;
        pictureUrl = saveLocalFile(req.file, req).url;
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        profilePicture: pictureUrl,
        isFullAccount: true,
      },
      { new: true }
    ).select('-__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      url: pictureUrl,
      user,
    });
  } catch (error) {
    console.error('Upload picture error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// POST /api/profile/:userId/complete - First-time profile completion
router.post('/:userId/complete', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    const { fullName, bio, dateOfBirth, location, interests, gender } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ message: 'Full name is required' });
    }
    if (!dateOfBirth) {
      return res.status(400).json({ message: 'Date of birth is required' });
    }

    const updateData = {
      fullName: fullName.trim(),
      dateOfBirth: new Date(dateOfBirth),
      isFullAccount: true
    };
    if (gender !== undefined) {
      if (!['Male', 'Female'].includes(gender)) {
        return res.status(400).json({ message: 'Gender must be Male or Female' });
      }
      updateData.gender = gender;
    }
    if (bio !== undefined) updateData.bio = bio.trim();
    if (location) updateData.location = location.trim();
    if (interests) updateData.interests = interests;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
