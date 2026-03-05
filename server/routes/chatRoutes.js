const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  sendMessage,
  getMessages,
} = require("../controllers/chatController");
const { protect } = require("../middleware");

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", chatLimiter, protect, accessChat);
router.get("/", chatLimiter, protect, fetchChats);
router.post("/group", chatLimiter, protect, createGroupChat);
router.post("/message", chatLimiter, protect, sendMessage);
router.get("/:chatId/messages", chatLimiter, protect, getMessages);

module.exports = router;
