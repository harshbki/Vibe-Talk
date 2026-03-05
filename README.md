# Vibe Talk 💬

A full-stack real-time chat application built with the **MERN stack**.  
Supports user authentication, private & group chats, image/video sharing, typing indicators, online presence, and live WebRTC video/audio calls.

🌐 **Production domain:** [vibetalk.me](https://vibetalk.me)

---

## Table of Contents

- [Features](#features)
- [Tech Stack & Tools](#tech-stack--tools)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Local Development Setup](#local-development-setup)
- [Production Deployment (vibetalk.me)](#production-deployment-vibetalkme)
- [API Reference](#api-reference)
- [Socket.IO Events](#socketio-events)

---

## Features

- ✅ User Signup, Login & Profile Management (JWT authentication)
- ✅ Real-time Messaging powered by **Socket.IO**
- ✅ Private (one-on-one) and Group Chats
- ✅ Typing indicators & online/offline presence
- ✅ Image & Video sharing via **Cloudinary**
- ✅ Live video/audio calls via **WebRTC**
- ✅ Unread message notifications
- ✅ Responsive UI with **Tailwind CSS**
- ✅ Rate-limited REST API to prevent abuse

---

## Tech Stack & Tools

### Backend

| Tool / Service | Version | Purpose |
|---|---|---|
| **Node.js** | ≥ 18 | JavaScript runtime |
| **Express.js** | ^4.18 | HTTP server & REST API framework |
| **Socket.IO** | ^4.7 | Real-time bidirectional messaging |
| **MongoDB** | Cloud / Local | Primary database |
| **Mongoose** | ^8.3 | MongoDB ODM — schemas, models, queries |
| **Cloudinary** | ^2.7 | Cloud storage for images & videos (CDN-delivered) |
| **Multer** | ^2.1 | Multipart file upload middleware |
| **bcryptjs** | ^2.4 | Password hashing |
| **jsonwebtoken** | ^9.0 | JWT creation & verification |
| **cors** | ^2.8 | Cross-Origin Resource Sharing headers |
| **dotenv** | ^16.4 | Load environment variables from `.env` |
| **express-rate-limit** | ^8.2 | Per-route request rate limiting (DoS protection) |
| **nodemon** *(dev)* | ^3.1 | Auto-restart server on file changes |

### Frontend

| Tool / Library | Version | Purpose |
|---|---|---|
| **React** | ^18.2 | UI component framework |
| **React Router DOM** | ^6.22 | Client-side routing |
| **Context API** | built-in | Global state (auth + chat) |
| **Axios** | ^1.6 | HTTP client for REST API calls |
| **Socket.IO Client** | ^4.7 | Real-time connection to Socket.IO server |
| **Tailwind CSS** | via CDN/build | Utility-first CSS framework |

### Third-Party Services

| Service | Usage | Sign-up |
|---|---|---|
| **MongoDB Atlas** | Managed cloud database | [mongodb.com/atlas](https://www.mongodb.com/atlas) |
| **Cloudinary** | Image & video hosting, CDN delivery | [cloudinary.com](https://cloudinary.com) — free tier available |

---

## Project Structure

```
Vibe-Talk/
├── .env.example              # Root (copy reference — see server/ and client/)
├── .gitignore
├── client/                   # React frontend
│   ├── .env.example          # Client env vars (REACT_APP_*)
│   ├── package.json
│   └── src/
│       ├── api.js            # Axios instance with JWT interceptor
│       ├── socket.js         # Socket.IO client
│       ├── App.js            # Router + protected routes
│       ├── index.js          # React entry point
│       ├── context/
│       │   ├── AuthContext.js  # Login/logout, socket setup/teardown
│       │   └── ChatContext.js  # Chat state + Socket.IO listeners
│       ├── components/
│       │   ├── ChatWindow.js   # Message list
│       │   ├── MessageInput.js # Text/file input + typing emit
│       │   ├── Sidebar.js      # Chat list
│       │   └── UserList.js     # User search
│       └── pages/
│           ├── LoginPage.js
│           ├── RegisterPage.js
│           ├── ChatPage.js
│           └── ProfilePage.js
└── server/                   # Node.js backend
    ├── .env.example          # Server env vars (copy from root .env.example)
    ├── package.json
    ├── server.js             # Entry point — Express + Socket.IO init
    ├── middleware.js         # JWT auth middleware (protect)
    ├── config/
    │   ├── db.js             # Mongoose connection
    │   └── cloudinary.js     # Cloudinary SDK config
    ├── models/
    │   ├── User.js
    │   ├── Chat.js
    │   └── Message.js
    ├── routes/
    │   ├── authRoutes.js     # /api/auth/*
    │   ├── chatRoutes.js     # /api/chats/*
    │   └── uploadRoutes.js   # /api/upload
    ├── controllers/
    │   ├── authController.js
    │   ├── chatController.js
    │   └── uploadController.js
    └── socket/
        └── index.js          # All Socket.IO event handlers
```

---

## Environment Variables

### Server (`server/.env`)

Copy `.env.example` to `.env` inside the `server/` folder:

```bash
cd server && cp ../.env.example .env
```

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server listens on | `5000` |
| `CLIENT_URL` | Allowed CORS origins, comma-separated | `https://vibetalk.me,https://www.vibetalk.me` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/vibetalk` |
| `JWT_SECRET` | Secret for signing JWTs (min 32 chars) | *(random hex string)* |
| `JWT_EXPIRY` | JWT validity duration | `30d` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | `my-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `xxxxxxxxxxxxxxxxxxxx` |

### Client (`client/.env`)

Copy `client/.env.example` to `client/.env`:

```bash
cd client && cp .env.example .env
```

| Variable | Description | Example |
|---|---|---|
| `REACT_APP_API_URL` | Backend REST API base URL | `https://vibetalk.me/api` |
| `REACT_APP_SOCKET_URL` | Socket.IO server URL | `https://vibetalk.me` |

---

## Local Development Setup

### Prerequisites

- Node.js ≥ 18 and npm
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (free M0 tier works)
- A [Cloudinary](https://cloudinary.com) account (free tier works)

### 1 — Clone & configure

```bash
git clone https://github.com/harshbki/Vibe-Talk.git
cd Vibe-Talk

# Server env
cp .env.example server/.env
# Edit server/.env and fill in MONGO_URI, JWT_SECRET, and Cloudinary values

# Client env
cp client/.env.example client/.env
# Default values (localhost) work out of the box for local development
```

### 2 — Install dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 3 — Run

Open **two terminals**:

```bash
# Terminal 1 — backend (http://localhost:5000)
cd server && npm run dev

# Terminal 2 — frontend (http://localhost:3000)
cd client && npm start
```

The React app proxies `/api` requests to `localhost:5000` automatically (configured via `"proxy"` in `client/package.json`).

---

## Production Deployment (vibetalk.me)

### Option A — Single VPS / DigitalOcean Droplet

1. **Build the React app:**
   ```bash
   cd client
   REACT_APP_API_URL=https://vibetalk.me/api \
   REACT_APP_SOCKET_URL=https://vibetalk.me \
   npm run build
   ```

2. **Serve `client/build/` as static files from Express** (add to `server/server.js`):
   ```js
   const path = require("path");
   app.use(express.static(path.join(__dirname, "../client/build")));
   app.get("*", (req, res) =>
     res.sendFile(path.join(__dirname, "../client/build/index.html"))
   );
   ```

3. **Set server `.env` for production:**
   ```
   PORT=5000
   CLIENT_URL=https://vibetalk.me,https://www.vibetalk.me
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=<your-strong-secret>
   JWT_EXPIRY=30d
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```

4. **Nginx reverse proxy** (maps `vibetalk.me` → `localhost:5000`):
   ```nginx
   server {
       listen 80;
       server_name vibetalk.me www.vibetalk.me;
       return 301 https://$host$request_uri;
   }

   server {
       listen 443 ssl;
       server_name vibetalk.me www.vibetalk.me;

       # SSL certs (e.g. from Let's Encrypt / Certbot)
       ssl_certificate     /etc/letsencrypt/live/vibetalk.me/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/vibetalk.me/privkey.pem;

       location / {
           proxy_pass         http://localhost:5000;
           proxy_http_version 1.1;
           # Required for Socket.IO WebSocket upgrade
           proxy_set_header   Upgrade $http_upgrade;
           proxy_set_header   Connection "upgrade";
           proxy_set_header   Host $host;
           proxy_set_header   X-Real-IP $remote_addr;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Keep server running with PM2:**
   ```bash
   npm install -g pm2
   cd server && pm2 start server.js --name vibe-talk
   pm2 save && pm2 startup
   ```

### Option B — Separate frontend & backend hosts

| Part | Where to host |
|---|---|
| **Backend** (Node + Socket.IO) | Railway / Render / Fly.io / DigitalOcean App Platform |
| **Frontend** (React build) | Vercel / Netlify / Cloudflare Pages |
| **Domain** | Point `vibetalk.me` → frontend host; use `api.vibetalk.me` → backend host |

Set client env vars:
```
REACT_APP_API_URL=https://api.vibetalk.me/api
REACT_APP_SOCKET_URL=https://api.vibetalk.me
```

Set server env vars:
```
CLIENT_URL=https://vibetalk.me,https://www.vibetalk.me
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register a new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/users?search=` | ✅ | Search users by name/email |
| PUT | `/api/auth/profile` | ✅ | Update name, bio, profile picture |
| POST | `/api/chats` | ✅ | Access or create a private chat |
| GET | `/api/chats` | ✅ | List all chats for current user |
| POST | `/api/chats/group` | ✅ | Create a group chat |
| POST | `/api/chats/message` | ✅ | Send a message |
| GET | `/api/chats/:chatId/messages` | ✅ | Fetch messages for a chat |
| POST | `/api/upload` | ✅ | Upload image/video to Cloudinary |
| GET | `/` | — | Health check (`{ socketIO: "active" }`) |

---

## Socket.IO Events

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `setup` | `user` object | Register user as online, join personal room |
| `join-chat` | `chatId` | Join a chat room to receive messages |
| `leave-chat` | `chatId` | Leave a chat room |
| `new-message` | `message` object | Broadcast message to chat participants |
| `typing` | `chatId` | Notify others that user is typing |
| `stop-typing` | `chatId` | Notify others that user stopped typing |
| `call-user` | `{ userToCall, signal, from, name }` | Initiate a WebRTC call |
| `answer-call` | `{ to, signal }` | Accept an incoming call |
| `end-call` | `{ to }` | Hang up a call |

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `connected` | — | Confirms socket registration |
| `online-users` | `[userId, ...]` | Current list of online user IDs |
| `message-received` | `message` object | New message in a chat the user is in |
| `typing` | `chatId` | Another user is typing |
| `stop-typing` | `chatId` | Another user stopped typing |
| `call-incoming` | `{ signal, from, name }` | Incoming call notification |
| `call-accepted` | `signal` | Remote peer accepted the call |
| `call-ended` | — | Remote peer ended the call |

---

## Developed by

**M.Hasnain Muawia** — [hasainalvi@gmail.com](mailto:hasainalvi@gmail.com) · [github.com/alvi597](https://github.com/alvi597)

