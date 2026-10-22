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
const publicArticles = require('../client/src/data/publicArticles.json');
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
  '/articles/free-random-chat-online': {
    title: 'Free Random Chat Online: What to Expect — Vibe Talk',
    description:
      'A practical guide to free random chat online, privacy choices, random matching, and respectful conversations.',
  },
  '/articles/video-chat-with-strangers-safely': {
    title: 'Video Chat With Strangers: A Safer Beginner Guide — Vibe Talk',
    description:
      'Learn how to prepare for video chat with strangers, protect your privacy, and leave a call comfortably.',
  },
  '/articles/online-chat-rooms-and-interest-groups': {
    title: 'Online Chat Rooms and Interest Groups — Vibe Talk',
    description:
      'Learn how online chat rooms and interest groups work and how to join conversations safely and respectfully.',
  },
  '/articles/what-is-vibetalk': {
    title: 'What Is Vibe Talk? Random Chat, Video Calls, and Groups',
    description:
      'Learn what Vibe Talk is, how random chat, video calls, direct messages, and interest-based groups work, and how to use the platform safely.',
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

const HOMEPAGE_SEO_CONTENT = `
  <main class="seo-content" style="max-width:960px;margin:0 auto;padding:24px 16px;font-family:system-ui,-apple-system,sans-serif;line-height:1.6;color:#1f2937;">
    <header style="margin-bottom:32px;">
      <h1 style="font-size:2rem;font-weight:800;color:#111827;line-height:1.2;margin-bottom:12px;">Free Random Chat, Video Call &amp; Meet Strangers Online</h1>
      <p style="font-size:1.125rem;color:#4b5563;">Vibe Talk is a secure, browser-based communication platform designed for instant 1-on-1 random text chat, live WebRTC video calls, and interest-based communities. Connect with friendly people across the world without compulsory phone verification or software downloads.</p>
      <nav aria-label="Main Navigation" style="display:flex;flex-wrap:wrap;gap:12px;margin-top:16px;">
        <a href="/start" style="display:inline-block;background:#4f46e5;color:#fff;padding:8px 16px;border-radius:6px;text-decoration:none;font-weight:600;">Start Chatting Now</a>
        <a href="/how-it-works" style="color:#4f46e5;text-decoration:underline;padding:8px 0;">How It Works</a>
        <a href="/articles" style="color:#4f46e5;text-decoration:underline;padding:8px 0;">Articles &amp; Safety Guides</a>
        <a href="/safety" style="color:#4f46e5;text-decoration:underline;padding:8px 0;">Community Safety</a>
        <a href="/about" style="color:#4f46e5;text-decoration:underline;padding:8px 0;">About Vibe Talk</a>
      </nav>
    </header>

    <section style="margin-bottom:32px;">
      <h2 style="font-size:1.5rem;font-weight:700;color:#111827;margin-bottom:12px;">Modern Anonymous Chat Built for Genuine Connections</h2>
      <p>Finding a respectful, bot-free space to meet new people online should be straightforward. Vibe Talk reimagines the traditional stranger chat experience by prioritizing user safety, clear consent, and instantaneous browser performance. Whether you want to practice speaking a second language, share your favorite music, discuss anime, or have an impromptu video conversation, our platform connects you with active peers in seconds.</p>
    </section>

    <section style="margin-bottom:32px;">
      <h2 style="font-size:1.5rem;font-weight:700;color:#111827;margin-bottom:12px;">Key Features of Vibe Talk</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin-top:16px;">
        <div style="background:#f9fafb;border:1px solid #e5e7eb;padding:16px;border-radius:8px;">
          <h3 style="font-size:1.125rem;font-weight:600;color:#1f2937;margin-bottom:8px;">Instant Guest Access</h3>
          <p style="font-size:0.95rem;color:#4b5563;">Jump straight into conversations with only a chosen nickname. No credit card, phone number, or social media link is ever required to get started.</p>
        </div>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;padding:16px;border-radius:8px;">
          <h3 style="font-size:1.125rem;font-weight:600;color:#1f2937;margin-bottom:8px;">Peer-to-Peer WebRTC Video Calls</h3>
          <p style="font-size:0.95rem;color:#4b5563;">Enjoy crisp, low-latency video and audio calls directly inside your browser. Video feeds connect peer-to-peer with strict user acceptance controls to prevent unwanted exposure.</p>
        </div>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;padding:16px;border-radius:8px;">
          <h3 style="font-size:1.125rem;font-weight:600;color:#1f2937;margin-bottom:8px;">Interest-Based Groups</h3>
          <p style="font-size:0.95rem;color:#4b5563;">Join curated topic groups focused on Travel, Gaming, Movies, Music, Food, and Technology instead of outdated, spam-filled public chatrooms.</p>
        </div>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;padding:16px;border-radius:8px;">
          <h3 style="font-size:1.125rem;font-weight:600;color:#1f2937;margin-bottom:8px;">Active Moderation &amp; Safety Tools</h3>
          <p style="font-size:0.95rem;color:#4b5563;">Built-in one-tap user reporting and immediate blocking allow you to disconnect and blacklist anyone who violates community standards.</p>
        </div>
      </div>
    </section>

    <section style="margin-bottom:32px;">
      <h2 style="font-size:1.5rem;font-weight:700;color:#111827;margin-bottom:12px;">How Vibe Talk Works: Step-by-Step</h2>
      <ol style="padding-left:20px;color:#374151;font-size:1rem;margin-top:12px;">
        <li style="margin-bottom:10px;"><strong>Choose Your Nickname:</strong> Visit <a href="/start" style="color:#4f46e5;text-decoration:underline;">Start Chat</a> and enter any nickname. You can choose to specify your gender or chat completely neutrally.</li>
        <li style="margin-bottom:10px;"><strong>Select Your Chat Mode:</strong> Hit <em>Random Match</em> to be paired with someone waiting in the global queue, browse online profiles in the <em>Users List</em>, or jump into a public <em>Group</em>.</li>
        <li style="margin-bottom:10px;"><strong>Engage Safely:</strong> Start with text chat. If both participants agree, initiate a two-way video or audio call with full camera control.</li>
        <li style="margin-bottom:10px;"><strong>End or Skip Anytime:</strong> If a match is unresponsive or unpleasant, click Next to leave immediately. No personal history is exposed to strangers.</li>
      </ol>
    </section>

    <section style="margin-bottom:32px;">
      <h2 style="font-size:1.5rem;font-weight:700;color:#111827;margin-bottom:12px;">Safety &amp; Privacy Rules Every User Must Follow</h2>
      <p style="color:#4b5563;">Your digital wellbeing is our top priority. When conversing with strangers on Vibe Talk:</p>
      <ul style="padding-left:20px;color:#374151;font-size:0.95rem;margin-top:8px;">
        <li>Never share your real full name, home address, school, phone number, or social media handles.</li>
        <li>Never send money, gifts, cryptocurrency, or click suspicious external links.</li>
        <li>Be mindful of your background environment before switching on your webcam.</li>
        <li>Harassment, non-consensual sexual content, hate speech, and spam result in permanent account bans.</li>
      </ul>
      <p style="margin-top:10px;"><a href="/safety" style="color:#4f46e5;font-weight:600;text-decoration:underline;">Read our Complete Online Chat Safety Handbook &rarr;</a></p>
    </section>

    <section style="margin-bottom:32px;background:#f3f4f6;padding:24px;border-radius:8px;">
      <h2 style="font-size:1.5rem;font-weight:700;color:#111827;margin-bottom:16px;">Frequently Asked Questions (FAQ)</h2>
      
      <div style="margin-bottom:16px;">
        <h3 style="font-size:1.05rem;font-weight:600;color:#111827;margin-bottom:4px;">Is Vibe Talk 100% free to use?</h3>
        <p style="font-size:0.95rem;color:#4b5563;">Yes. All basic chat, random stranger matching, WebRTC video calling, and group features are completely free. We keep servers running through non-intrusive banner advertising.</p>
      </div>

      <div style="margin-bottom:16px;">
        <h3 style="font-size:1.05rem;font-weight:600;color:#111827;margin-bottom:4px;">Do I need to download an application to use Vibe Talk?</h3>
        <p style="font-size:0.95rem;color:#4b5563;">No. Vibe Talk runs entirely within modern web browsers (Chrome, Safari, Firefox, Edge) on Android, iPhone, iPad, Windows, macOS, and Linux without installing APKs or desktop software.</p>
      </div>

      <div style="margin-bottom:16px;">
        <h3 style="font-size:1.05rem;font-weight:600;color:#111827;margin-bottom:4px;">How does Random Match pair users?</h3>
        <p style="font-size:0.95rem;color:#4b5563;">Our backend Socket.IO matchmaking engine pairs users based on real-time availability in a first-in, first-out queue. Connections are ephemeral and private between the two participants.</p>
      </div>

      <div style="margin-bottom:16px;">
        <h3 style="font-size:1.05rem;font-weight:600;color:#111827;margin-bottom:4px;">Is Vibe Talk an Omegle alternative?</h3>
        <p style="font-size:0.95rem;color:#4b5563;">Yes. Vibe Talk provides a safe, modern alternative to Omegle and ChatHub, featuring verified guest sessions, WebRTC audio/video calls, and dedicated community groups with proactive anti-abuse reporting.</p>
      </div>

      <div>
        <h3 style="font-size:1.05rem;font-weight:600;color:#111827;margin-bottom:4px;">Where can I read more guides on meeting people online?</h3>
        <p style="font-size:0.95rem;color:#4b5563;">Browse our collection of comprehensive editorial articles on <a href="/articles" style="color:#4f46e5;text-decoration:underline;">Chat Tips &amp; Online Etiquette</a>.</p>
      </div>
    </section>

    <footer style="border-top:1px solid #e5e7eb;padding-top:20px;font-size:0.875rem;color:#6b7280;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;">
      <div>&copy; 2026 Vibe Talk. All rights reserved.</div>
      <div>
        <a href="/privacy" style="color:#4b5563;margin-right:12px;text-decoration:underline;">Privacy Policy</a>
        <a href="/legal" style="color:#4b5563;margin-right:12px;text-decoration:underline;">Terms of Service</a>
        <a href="/community-guidelines" style="color:#4b5563;margin-right:12px;text-decoration:underline;">Community Guidelines</a>
        <a href="/contact" style="color:#4b5563;text-decoration:underline;">Contact Support</a>
      </div>
    </footer>
  </main>`;

const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const renderPublicArticlesSeoContent = (article) => {
  if (article) {
    return `
      <article>
        <a href="/articles">All articles</a>
        <h1>${escapeHtml(article.title)}</h1>
        ${article.excerpt ? `<p>${escapeHtml(article.excerpt)}</p>` : ''}
        <div>${escapeHtml(article.body)}</div>
      </article>`;
  }

  return `
    <main>
      <h1>Articles &amp; Tips</h1>
      <p>Guides on safe chatting, making friends online, and using Vibe Talk.</p>
      <ul>
        ${publicArticles
          .map(
            (publicArticle) => `
              <li>
                <a href="/articles/${escapeHtml(publicArticle.slug)}">${escapeHtml(publicArticle.title)}</a>
                ${publicArticle.excerpt ? `<p>${escapeHtml(publicArticle.excerpt)}</p>` : ''}
              </li>`
          )
          .join('')}
      </ul>
    </main>`;
};

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

  if (req.path === '/') {
    html = html.replace('<div id="root"></div>', `<div id="root">${HOMEPAGE_SEO_CONTENT}</div>`);
  } else if (req.path === '/articles') {
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${renderPublicArticlesSeoContent()}</div>`
    );
  } else if (req.path.startsWith('/articles/')) {
    const slug = req.path.slice('/articles/'.length);
    const article = publicArticles.find((publicArticle) => publicArticle.slug === slug);
    if (article) {
      html = html.replace(
        '<div id="root"></div>',
        `<div id="root">${renderPublicArticlesSeoContent(article)}</div>`
      );
    }
  }

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
  app.use(express.static(clientBuild, { index: false }));
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
