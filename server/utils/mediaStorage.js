const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');

const uploadsDir = path.join(__dirname, '..', 'uploads');

const isCloudinaryConfigured = () => {
  const name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const key = process.env.CLOUDINARY_API_KEY?.trim();
  const secret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!name || !key || !secret) return false;
  if (/your_|replace|xxxxxxxx/i.test(`${name}${key}${secret}`)) return false;
  return true;
};

const getPublicBaseUrl = (req) => {
  const fromEnv = process.env.PUBLIC_SERVER_URL || process.env.SERVER_URL;
  if (fromEnv) return String(fromEnv).replace(/\/$/, '');
  const host = req.get('host') || `localhost:${process.env.PORT || 8081}`;
  return `${req.protocol}://${host}`;
};

const saveLocalFile = (file, req) => {
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const mime = file.mimetype || '';
  const extRaw = mime.split('/')[1] || 'bin';
  const ext = String(extRaw).replace(/[^a-z0-9]+/gi, '').toLowerCase() || 'bin';
  const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, file.buffer);

  const base = getPublicBaseUrl(req);
  return {
    success: true,
    url: `${base}/uploads/${filename}`,
    public_id: filename,
    resource_type: mime.startsWith('video/') ? 'video' : 'image',
  };
};

const uploadToCloudinary = async (file, options = {}) => {
  const b64 = Buffer.from(file.buffer).toString('base64');
  const dataURI = `data:${file.mimetype};base64,${b64}`;
  return cloudinary.uploader.upload(dataURI, {
    folder: 'vibetalk',
    resource_type: 'auto',
    ...options,
  });
};

const shouldUseLocalFallback = (error) => {
  if (!error) return true;
  const msg = String(error.message || '').toLowerCase();
  return (
    error.http_code === 401 ||
    msg.includes('unknown api key') ||
    msg.includes('must supply') ||
    msg.includes('invalid') ||
    msg.includes('cloudinary')
  );
};

module.exports = {
  isCloudinaryConfigured,
  saveLocalFile,
  uploadToCloudinary,
  shouldUseLocalFallback,
  uploadsDir,
};
