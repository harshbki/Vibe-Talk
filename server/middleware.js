const rateLimit = require('express-rate-limit');

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
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  
  res.status(500).json({ message: 'Internal server error' });
};

module.exports = {
  apiLimiter,
  authLimiter,
  requestLogger,
  errorHandler
};
