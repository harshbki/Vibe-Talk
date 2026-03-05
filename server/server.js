require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const initSocket = require("./socket");

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Build allowed origins list from CLIENT_URL env var.
// CLIENT_URL may be a comma-separated list for multi-origin support,
// e.g. "https://vibetalk.me,https://www.vibetalk.me,http://localhost:3000"
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/upload", uploadRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Vibe Talk API is running", socketIO: "active" });
});

// Initialize Socket.IO handlers
initSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO is active and listening`);
});
