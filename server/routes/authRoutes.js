const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { registerUser, loginUser, getUsers, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.get("/users", apiLimiter, protect, getUsers);
router.put("/profile", apiLimiter, protect, updateProfile);

module.exports = router;
