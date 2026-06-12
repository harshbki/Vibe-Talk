const express = require('express');
const router = express.Router();
const { guestLogin, getUserById, profileLogin } = require('../controllers/authController');
const { requireMongo } = require('../middleware');
const { optionalAuth } = require('../middleware/auth');

router.use(requireMongo);

router.post('/guest', guestLogin);
router.post('/profile-login', profileLogin);
router.get('/user/:id', optionalAuth, getUserById);

module.exports = router;
