const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const groupRoutes = require('./routes/groupRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const setupSocket = require('./socket');
const { authLimiter, requestLogger, errorHandler } = require('./middleware');

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:8080'
].filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (origin.endsWith('.app.github.dev')) return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  return false;
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) callback(null, true);
      else callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST']
  }
});

// Connect to MongoDB
connectDB();

// Trust proxy (required for rate-limiter behind Codespaces/reverse proxy)
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json());
app.use(requestLogger);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Vibe Talk API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth/guest (POST)',
      users: '/api/users (GET)',
      chat: '/api/chat (GET/POST)',
      upload: '/api/upload (POST)',
      profile: '/api/profile/:userId (GET/PUT), /api/profile/:userId/picture (POST)',
      health: '/api/chat/health (GET)'
    }
  });
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/notifications', notificationRoutes);

// Serve React build in production
const clientBuild = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(clientBuild));
app.get('*', (req, res, next) => {
  // Only serve index.html for non-API routes
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientBuild, 'index.html'));
});

// Error handler (must be last)
app.use(errorHandler);

// Socket.io setup
setupSocket(io);

const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
