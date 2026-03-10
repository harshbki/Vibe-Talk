const express = require('express');
const router = express.Router();
const { guestLogin, getUserById, profileLogin } = require('../controllers/authController');

// POST /api/auth/guest - Guest login
router.post('/guest', guestLogin);

// POST /api/auth/profile-login - Profile login (for returning users with full profiles)
router.post('/profile-login', profileLogin);

// GET /api/auth/user/:id - Get user by ID
router.get('/user/:id', getUserById);

module.exports = router;
