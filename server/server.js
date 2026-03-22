const express = require('express');
const fs = require('fs');
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
  'http://localhost:8080',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:3000',
].filter(Boolean);

/** Same Wi‑Fi / LAN (React HOST=0.0.0.0 → open via http://192.168.x.x:8080) */
const isPrivateLanOrigin = (origin) => {
  try {
    const { hostname } = new URL(origin);
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    const p = hostname.split('.').map(Number);
    if (p.length !== 4 || p.some((n) => Number.isNaN(n))) return false;
    const [a, b] = p;
    if (a === 10) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    return false;
  } catch {
    return false;
  }
};

const allowLanDev =
  process.env.NODE_ENV !== 'production' && process.env.CORS_STRICT_LAN !== '1';

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (origin.endsWith('.app.github.dev')) return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  if (allowLanDev && isPrivateLanOrigin(origin)) return true;
  return false;
};

const corsCallback = (origin, callback) => {
  if (isAllowedOrigin(origin)) callback(null, true);
  else callback(null, false);
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsCallback,
    methods: ['GET', 'POST'],
  },
});

// Trust proxy (required for rate-limiter behind Codespaces/reverse proxy)
app.set('trust proxy', 1);

// Middleware
app.use(cors({ origin: corsCallback }));
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

// Serve React build when present (run `npm run build` in client first)
const clientBuild = path.join(__dirname, '..', 'client', 'build');
const clientIndex = path.join(clientBuild, 'index.html');
if (fs.existsSync(clientIndex)) {
  app.use(express.static(clientBuild));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(clientIndex);
  });
}

// Error handler (must be last)
app.use(errorHandler);

// Socket.io setup
setupSocket(io);

const PORT = process.env.PORT || 8081;
const HOST = process.env.HOST ?? '0.0.0.0';

const start = async () => {
  server
    .listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(
          `Port ${PORT} is already in use. Close the other Node process or change PORT in server/.env.`
        );
      } else {
        console.error(err);
      }
      process.exit(1);
    });

  try {
    await connectDB();
  } catch (err) {
    console.error(err.message || err);
    console.error(
      '[MongoDB] Chat/login APIs tab tak kaam nahi karenge jab tak MongoDB chalu na ho (Windows: Services → MongoDB → Start, ya port 27017).'
    );
  }
};

start().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
