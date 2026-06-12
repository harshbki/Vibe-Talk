const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');
const { requireMongo } = require('../middleware');
const { authenticate } = require('../middleware/auth');
const {
  isCloudinaryConfigured,
  saveLocalFile,
  uploadToCloudinary,
  shouldUseLocalFallback,
  uploadsDir,
} = require('../utils/mediaStorage');

const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB) || 100;
const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

const ALLOWED_MIME_PREFIXES = ['image/', 'video/', 'audio/'];
const ALLOWED_MIME_EXACT = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: (req, file, cb) => {
    const mime = file.mimetype || '';
    const ok =
      ALLOWED_MIME_PREFIXES.some((p) => mime.startsWith(p)) || ALLOWED_MIME_EXACT.has(mime);
    if (ok) cb(null, true);
    else cb(new Error('File type not allowed. Upload images, videos, audio, or PDF only.'));
  },
});

router.use(requireMongo);
router.use(authenticate);

router.get('/', (req, res) => {
  res.json({
    message: 'Upload API is running',
    usage: 'POST /api/upload with multipart form data containing "file" field',
    maxSize: `${MAX_UPLOAD_MB}MB`,
    allowedTypes: 'images, videos, audio, PDF',
    storage: isCloudinaryConfigured() ? 'cloudinary' : 'local',
  });
});

router.post('/', (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !isCloudinaryConfigured()) {
    return res.status(503).json({
      message: 'Cloudinary is required for uploads in production. Set CLOUDINARY_* env vars.',
    });
  }
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
      if (process.env.NODE_ENV === 'production') {
        throw cloudinaryError;
      }
      if (shouldUseLocalFallback(cloudinaryError)) {
        return res.json(saveLocalFile(req.file, req));
      }
      throw cloudinaryError;
    }
  } catch (error) {
    console.error('Upload error:', error);
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
