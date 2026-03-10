const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image or video files are allowed'), false);
    }
  }
});

// GET /api/upload - API info
router.get('/', (req, res) => {
  res.json({
    message: 'Upload API is running',
    usage: 'POST /api/upload with multipart form data containing "file" field',
    maxSize: '20MB',
    allowedTypes: 'image/*, video/*'
  });
});

// POST /api/upload - Upload image to Cloudinary
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary (auto-detect image/video)
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'vibetalk',
      resource_type: 'auto'
    });

    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// DELETE /api/upload/:publicId - Delete image from Cloudinary
router.delete('/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    await cloudinary.uploader.destroy(`vibetalk/${publicId}`);
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
});

module.exports = router;
