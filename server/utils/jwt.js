const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const getSecret = () => {
  const secret = process.env.JWT_SECRET?.trim();
  if (secret && !/your_|replace_with|change-this/i.test(secret)) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set to a strong random value in production');
  }
  return 'dev-only-jwt-secret-change-in-production';
};

const signToken = (userId) =>
  jwt.sign({ userId: String(userId) }, getSecret(), { expiresIn: '30d' });

const verifyToken = (token) => jwt.verify(token, getSecret());

module.exports = { signToken, verifyToken, getSecret };
