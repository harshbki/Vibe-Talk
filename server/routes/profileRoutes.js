const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User');

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
    const { fullName, bio, profilePicture, dateOfBirth, location, interests } = req.body;
    
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (bio !== undefined) updateData.bio = bio;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (location !== undefined) updateData.location = location;
    if (interests !== undefined) updateData.interests = interests;
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
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'vibetalk/profiles',
      resource_type: 'image',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' }
      ]
    });

    // Update user profile picture
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { 
        profilePicture: result.secure_url,
        isFullAccount: true
      },
      { new: true }
    ).select('-__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      url: result.secure_url,
      user
    });
  } catch (error) {
    console.error('Upload picture error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// POST /api/profile/:userId/complete - First-time profile completion
router.post('/:userId/complete', async (req, res, next) => {
  try {
    const { fullName, bio, dateOfBirth, location, interests } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ message: 'Full name is required' });
    }

    const updateData = {
      fullName: fullName.trim(),
      isFullAccount: true
    };
    if (bio !== undefined) updateData.bio = bio.trim();
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
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
