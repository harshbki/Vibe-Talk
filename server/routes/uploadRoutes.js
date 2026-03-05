const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { uploadFile, upload } = require("../controllers/uploadController");
const { protect } = require("../middleware");

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { message: "Too many upload requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", uploadLimiter, protect, upload.single("file"), uploadFile);

module.exports = router;
