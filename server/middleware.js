const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

/** Block API calls that need DB when MongoDB is not connected (503 + clear message). */
const requireMongo = (req, res, next) => {
  if (mongoose.connection.readyState === 1) return next();
  return res.status(503).json({
    message:
      'Database is not connected. Start MongoDB on your PC (Windows: Win+R → services.msc → MongoDB → Start), then restart the server.',
  });
};

// Rate limiter for API requests
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests, please try again later.' }
});

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many login attempts, please try again later.' }
});

// Simple request logger
const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  const msg = String(err.message || '');
  if (
    err.name === 'MongoServerSelectionError' ||
    err.name === 'MongoNotConnectedError' ||
    msg.includes('buffering timed out') ||
    msg.includes('Client must be connected')
  ) {
    return res.status(503).json({
      message:
        'Database is not connected. Start MongoDB (port 27017), then restart the API server.',
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  if (err.code === 'LIMIT_FILE_SIZE' || msg.includes('File too large')) {
    const maxMb = Number(process.env.MAX_UPLOAD_MB) || 100;
    return res.status(400).json({ message: `File too large. Maximum size is ${maxMb}MB.` });
  }

  res.status(500).json({ message: 'Internal server error' });
};

module.exports = {
  apiLimiter,
  authLimiter,
  requestLogger,
  errorHandler,
  requireMongo,
};
