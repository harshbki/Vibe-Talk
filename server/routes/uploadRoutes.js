const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');
const {
  isCloudinaryConfigured,
  saveLocalFile,
  uploadToCloudinary,
  shouldUseLocalFallback,
  uploadsDir,
} = require('../utils/mediaStorage');

const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB) || 100;
const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

router.get('/', (req, res) => {
  res.json({
    message: 'Upload API is running',
    usage: 'POST /api/upload with multipart form data containing "file" field',
    maxSize: `${MAX_UPLOAD_MB}MB`,
    allowedTypes: `all file types (max ${MAX_UPLOAD_MB}MB)`,
    storage: isCloudinaryConfigured() ? 'cloudinary' : 'local',
  });
});

router.post('/', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          message: `File too large. Maximum allowed size is ${MAX_UPLOAD_MB}MB.`,
        });
      }
      return res.status(400).json({ message: err.message || 'Upload failed' });
    }
    return next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    if (!isCloudinaryConfigured()) {
      return res.json(saveLocalFile(req.file, req));
    }

    try {
      const result = await uploadToCloudinary(req.file);
      return res.json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        resource_type: result.resource_type,
      });
    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', cloudinaryError.message);
      if (shouldUseLocalFallback(cloudinaryError)) {
        return res.json(saveLocalFile(req.file, req));
      }
      throw cloudinaryError;
    }
  } catch (error) {
    console.error('Upload error:', error);
    if (req.file && shouldUseLocalFallback(error)) {
      try {
        return res.json(saveLocalFile(req.file, req));
      } catch (localErr) {
        console.error('Local upload fallback error:', localErr);
      }
    }
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

router.delete('/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    if (isCloudinaryConfigured()) {
      try {
        await cloudinary.uploader.destroy(`vibetalk/${publicId}`);
      } catch (e) {
        /* fall through to local delete */
      }
    }
    const filePath = path.join(uploadsDir, publicId);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return res.json({ success: true, message: 'File deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Delete failed', error: error.message });
  }
});

module.exports = router;
