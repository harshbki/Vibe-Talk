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
const adminRoutes = require('./routes/adminRoutes');
const articleRoutes = require('./routes/articleRoutes');
const setupSocket = require('./socket');
const { authLimiter, apiLimiter, requestLogger, errorHandler } = require('./middleware');
const helmet = require('helmet');

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:8080',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:3000',
].filter(Boolean);

const isRenderHost = (hostname) =>
  hostname.endsWith('.onrender.com') || hostname.endsWith('.render.com');

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
  if (!origin) return process.env.NODE_ENV !== 'production';
  if (allowedOrigins.includes(origin)) return true;
  if (origin.endsWith('.app.github.dev')) return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  try {
    if (isRenderHost(new URL(origin).hostname)) return true;
  } catch {
    /* ignore malformed origin */
  }
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
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: corsCallback }));
app.use(express.json());
app.use(requestLogger);

// Lightweight health (no DB required) — before /api rate limiter (Render pings this)
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const mongoState = mongoose.connection.readyState;
  const mongoLabels = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: mongoState === 1 ? 'ok' : 'degraded',
    mongo: mongoLabels[mongoState] || 'unknown',
    uptime: process.uptime(),
  });
});

app.use('/api', apiLimiter);

const clientBuild = path.join(__dirname, '..', 'client', 'build');
const clientIndex = path.join(clientBuild, 'index.html');
const hasClientBuild = fs.existsSync(clientIndex);
const clientIndexHtml = hasClientBuild ? fs.readFileSync(clientIndex, 'utf8') : null;
const PUBLIC_PAGE_METADATA = {
  '/': {
    title: 'Vibe Talk — Free Random Chat, Video Call & Meet Strangers Online',
    description:
      'Vibe Talk is a free browser-based platform for random chat, text chat, video calls, groups, and meeting new people online.',
  },
  '/about': {
    title: 'About Vibe Talk — Free Random Chat & Groups',
    description:
      'Learn how Vibe Talk helps people meet new friends through guest chat, random matching, video calls, direct messages, and interest-based groups.',
  },
  '/how-it-works': {
    title: 'How Vibe Talk Works — Random Chat & Video Calls',
    description:
      'Learn how to start guest chat, find conversations, use Random Match, join groups, and stay safe on Vibe Talk.',
  },
  '/privacy': {
    title: 'Privacy Policy — Vibe Talk',
    description: 'Read how Vibe Talk handles account, chat, media, and website information.',
  },
  '/legal': {
    title: 'Terms & Conditions — Vibe Talk',
    description: 'Read the terms for using Vibe Talk chat, groups, profiles, and video features.',
  },
  '/safety': {
    title: 'Safety Center — Vibe Talk',
    description: 'Practical safety guidance for chatting with strangers and using video chat on Vibe Talk.',
  },
  '/community-guidelines': {
    title: 'Community Guidelines — Vibe Talk',
    description: 'Review Vibe Talk guidelines for respectful, friendly, and safe conversations.',
  },
  '/cookies': {
    title: 'Cookies Policy — Vibe Talk',
    description: 'Learn how Vibe Talk uses cookies and similar technologies.',
  },
  '/contact': {
    title: 'Contact Vibe Talk',
    description: 'Find contact details for Vibe Talk support and safety questions.',
  },
  '/articles': {
    title: 'Articles & Chat Tips — Vibe Talk',
    description: 'Read practical guides about online conversation, meeting people, and safer chat.',
  },
  '/articles/safe-random-chat-online-guide': {
    title: 'How to Chat Safely With New People Online — Vibe Talk',
    description:
      'Practical guidance for safer random chat, privacy, boundaries, reporting, and respectful online conversations.',
  },
  '/articles/how-to-make-friends-online-through-chat': {
    title: 'How to Make Better Conversations and Friends Online — Vibe Talk',
    description:
      'Simple conversation ideas for meeting people online, finding shared interests, and building respectful connections.',
  },
  '/articles/video-chat-tips-for-a-better-online-call': {
    title: 'Video Chat Tips for a Clearer, More Comfortable Call — Vibe Talk',
    description:
      'Prepare your camera, microphone, lighting, and privacy for comfortable video calls on phones, tablets, and computers.',
  },
  '/articles/random-chat-with-strangers-online': {
    title: 'Random Chat With Strangers: How to Start a Good Conversation — Vibe Talk',
    description:
      'Learn how instant random chat works, what to say first, and how to meet new people online safely and respectfully.',
  },
  '/articles/online-group-chat-for-shared-interests': {
    title: 'Online Group Chat: Find People Who Share Your Interests — Vibe Talk',
    description:
      'A practical guide to joining online group chat, finding shared interests, and participating in welcoming conversations.',
  },
  '/articles/safe-omegle-alternative-and-video-chat': {
    title: 'Choosing a Safer Omegle Alternative for Random Video Chat — Vibe Talk',
    description:
      'What to look for in an Omegle alternative, including privacy controls, reporting, text chat, video chat, and groups.',
  },
  '/articles/respectful-chat-with-women-online': {
    title: 'How to Chat Respectfully With Women Online — Vibe Talk',
    description:
      'Practical advice for friendly online conversations with women, including consent, privacy, boundaries, and respectful chat.',
  },
  '/start': {
    title: 'Join Chat — Vibe Talk',
    description: 'Pick a nickname and start chatting on Vibe Talk without creating an account.',
  },
  '/login': {
    title: 'Join Chat — Vibe Talk',
    description: 'Start a Vibe Talk guest chat with a nickname.',
  },
  '/admin/articles': {
    title: 'Article Administration — Vibe Talk',
    description: 'Manage Vibe Talk articles.',
  },
  '/chat': {
    title: 'Chat — Vibe Talk',
    description: 'Private Vibe Talk chat.',
  },
  '/users': {
    title: 'Find Users — Vibe Talk',
    description: 'Find users on Vibe Talk.',
  },
  '/match': {
    title: 'Random Match — Vibe Talk',
    description: 'Find a random chat partner on Vibe Talk.',
  },
  '/profile': {
    title: 'Profile — Vibe Talk',
    description: 'Manage your Vibe Talk profile.',
  },
  '/settings': {
    title: 'Settings — Vibe Talk',
    description: 'Manage your Vibe Talk settings.',
  },
  '/groups': {
    title: 'Groups — Vibe Talk',
    description: 'Explore Vibe Talk groups.',
  },
};

const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const renderClientPage = (req, res, metadata, robots = 'index, follow') => {
  const canonicalPath = req.path === '/' ? '/' : req.path;
  const canonicalUrl = `https://vibetalk.me${canonicalPath}`;
  let html = clientIndexHtml
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(metadata.title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/>/,
      `<meta name="description" content="${escapeHtml(metadata.description)}" />`
    )
    .replace(/<meta name="robots" content="[^"]*"\s*\/>/, `<meta name="robots" content="${robots}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonicalUrl}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonicalUrl}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escapeHtml(metadata.description)}" />`);

  if (robots !== 'index, follow') {
    res.set('X-Robots-Tag', robots);
  }
  return res.type('html').send(html);
};

// API summary when React build is missing (local dev without `npm run build`)
if (!hasClientBuild) {
  app.get('/', (req, res) => {
    res.json({
      name: 'Vibe Talk API',
      version: '1.0.0',
      status: 'running',
      hint: 'Run npm run build in client/ (or npm run build from repo root) to serve the React app here.',
      endpoints: {
        auth: '/api/auth/guest (POST)',
        users: '/api/users (GET)',
        chat: '/api/chat (GET/POST)',
        upload: '/api/upload (POST)',
        profile: '/api/profile/:userId (GET/PUT), /api/profile/:userId/picture (POST)',
        health: '/api/health (GET)',
      },
    });
  });
}

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/articles', articleRoutes);

// Serve uploaded files in development only (production uses Cloudinary).
const uploadsDir = path.join(__dirname, 'uploads');
if (process.env.NODE_ENV !== 'production') {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));
}

// Serve React build when present (Render: npm run install-all && npm run build)
if (hasClientBuild) {
  app.use(express.static(clientBuild));
  app.get('*', async (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    const publicClientRoutes = [
      '/',
      '/start',
      '/login',
      '/about',
      '/how-it-works',
      '/privacy',
      '/legal',
      '/safety',
      '/community-guidelines',
      '/cookies',
      '/contact',
      '/articles',
      '/admin/articles',
    ];
    const isPublicRoute = publicClientRoutes.includes(req.path);
    const isArticleRoute = req.path.startsWith('/articles/') && !path.extname(req.path);
    const isPrivateRoute = [
      '/chat',
      '/users',
      '/match',
      '/profile',
      '/settings',
      '/groups',
      '/group/',
      '/user/',
    ].some((route) => req.path === route || req.path.startsWith(route));
    const isNonIndexableRoute =
      isPrivateRoute ||
      ['/start', '/login', '/admin/articles'].includes(req.path);

    if (isPublicRoute || isArticleRoute || isPrivateRoute) {
      if (isNonIndexableRoute) {
        res.set('X-Robots-Tag', 'noindex, nofollow');
      }
      const metadata = PUBLIC_PAGE_METADATA[req.path] ||
        (isArticleRoute
          ? await (async () => {
              try {
                const mongoose = require('mongoose');
                if (mongoose.connection.readyState === 1) {
                  const Article = require('./models/Article');
                  const slug = req.path.replace('/articles/', '');
                  const article = await Article.findOne({ slug, published: true }).select('title excerpt').lean();
                  if (article) {
                    return {
                      title: article.title + ' — Vibe Talk',
                      description: article.excerpt || ('Read ' + article.title + ' on Vibe Talk.'),
                    };
                  }
                }
              } catch (e) { /* fall through to default */ }
              return {
                title: 'Article — Vibe Talk',
                description: 'Read practical guides about online conversation, meeting people, and safer chat.',
              };
            })()
          : {
              title: 'Vibe Talk',
              description: 'Vibe Talk chat and community app.',
            });
      return renderClientPage(
        req,
        res,
        metadata,
        isNonIndexableRoute ? 'noindex, nofollow' : 'index, follow'
      );
    }

    if (path.extname(req.path)) {
      return res.status(404).type('text').send('Not found');
    }

    return res.status(404).send('Not found');
  });
  console.log(`Serving React app from ${clientBuild}`);
} else {
  console.warn(
    '[client/build] not found — only API routes are active. Run `npm run build` before deploy.'
  );
}

// Error handler (must be last)
app.use(errorHandler);

// Socket.io setup
setupSocket(io);

const PORT = process.env.PORT || 8081;
const HOST = process.env.HOST ?? '0.0.0.0';

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

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
