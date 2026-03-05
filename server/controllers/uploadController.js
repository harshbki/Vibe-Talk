const cloudinary = require("../config/cloudinary");
const multer = require("multer");

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: MAX_FILE_SIZE_BYTES } });

// @desc    Upload a file (image/video) to Cloudinary
// @route   POST /api/upload
const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const resourceType = req.file.mimetype.startsWith("video") ? "video" : "image";

    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: resourceType,
      folder: "vibe-talk",
    });

    res.json({ url: result.secure_url, fileType: resourceType });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadFile, upload };
