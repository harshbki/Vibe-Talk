const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
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

    // Fallback: if Cloudinary is not configured (ex: placeholder API key -> 401),
    // then save the file locally so the UI upload keeps working.
    const isCloudinaryAuthError =
      error?.http_code === 401 ||
      String(error?.message || '').toLowerCase().includes('unknown api key');

    if (isCloudinaryAuthError) {
      const uploadsDir = path.join(__dirname, '..', 'uploads');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const mime = req.file?.mimetype || '';
      const extRaw = mime.split('/')[1] || 'bin';
      const ext = String(extRaw).replace(/[^a-z0-9]+/gi, '').toLowerCase() || 'bin';

      const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, req.file.buffer);

      return res.json({
        success: true,
        url: `/uploads/${filename}`,
        public_id: filename,
        resource_type: mime.startsWith('video/') ? 'video' : 'image'
      });
    }

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
    // If local fallback was used, try deleting from disk.
    try {
      const uploadsDir = path.join(__dirname, '..', 'uploads');
      const filePath = path.join(uploadsDir, publicId);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.json({ success: true, message: 'Image deleted (local)' });
    } catch (e) {
      return res.status(500).json({ message: 'Delete failed', error: error.message });
    }
  }
});

module.exports = router;
