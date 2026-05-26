# Vibe-Talk — DigitalOcean Deployment

Use this guide for **DigitalOcean App Platform** (recommended) or a **Droplet**.  
Render is **not** required; this project is set up for DO + MongoDB Atlas.

---

## Local errors: `ERR_EMPTY_RESPONSE` / `ERR_CONNECTION_RESET`

These mean the **API on port 8081 stopped or restarted** for a moment — not a React bug.

| Cause | Fix |
|--------|-----|
| Server not running | Terminal: `cd server && npm start` (or root `npm run dev:all`) |
| **Nodemon** restarted while you edited server files | Normal in dev; refresh page. Avoid saving `server/` during a call. |
| Port 8081 busy / two Node processes | Close extra terminals; only one server on 8081 |
| MongoDB stopped | `npm run mongo` (Docker) or start MongoDB service (Windows) |
| Mongo down during request | Open `http://localhost:8081/api/health` — `mongo` should be `connected` |

After errors you may see **`Socket connected`** again — the client reconnected; that matches a short server restart.

**Large video uploads** can take 30s–2min (Cloudinary/network). That is slow, not a disconnect, unless the server crashes (check server terminal).

---

## Deploy readiness (May 2026)

Latest `main` includes video call fixes, profile validation (name + DOB), message-sound toggle, and 100MB uploads.

Before deploy:

```bash
git pull origin main
cd client && npm ci && npm run build   # must pass (same as GitHub Actions)
npm run test-mongo                     # after Atlas MONGO_URI is in server/.env
npm run check-local                    # local: Mongo + server + client
```

**GitHub Actions:** If a run fails with `account is suspended`, fix the account at [support.github.com](https://support.github.com), then **Actions → Client build → Run workflow** (manual trigger).

### Files that were removed from the repo over time

| Removed | Why | Replacement |
|---------|-----|----------------|
| `.github/workflows/webpack.yml` | Failed builds (empty root webpack) | `.github/workflows/ci.yml` |
| `render.yaml` | You deploy on DigitalOcean, not Render | This guide |
| (never on your fork) | — | `DEPLOYMENT.md` (DO steps) |

### Files that should **not** be on GitHub (but sometimes are)

- `.env` with real secrets  
- `node_modules/`  
- `data/db/` (Mongo binary data)  
- Empty junk: `webpack.config.js`, `react-scripts`, `## Chat Customization Diagnostics.md`

---

## Option A — DigitalOcean App Platform (one Web Service)

Simplest: one Node service builds the client and serves API + React + Socket.IO (see `server/server.js`).

### 1. Create app

1. [DigitalOcean → Apps](https://cloud.digitalocean.com/apps) → **Create App** → GitHub → `harshbki/Vibe-Talk` → branch **`main`**.
2. **Resource type:** Web Service  
3. **Source directory:** `/` (repo root)  
4. **Build command:**

   ```bash
   npm run install-all && npm run build
   ```

5. **Run command:**

   ```bash
   npm start
   ```

6. **HTTP port:** `8081` (or whatever you set in `PORT`)

### 2. Environment variables (App → Settings → App-Level or Component)

Set **before** the first deploy (CRA bakes `REACT_APP_*` at **build** time):

```env
NODE_ENV=production
PORT=8081
HOST=0.0.0.0

# Your live app URL (DO gives you something like https://vibe-talk-xxxxx.ondigitalocean.app)
CLIENT_URL=https://YOUR-APP-URL.ondigitalocean.app

MONGO_URI=mongodb+srv://USER:PASS@CLUSTER/vibetalk?retryWrites=true&w=majority
JWT_SECRET=<long-random-string>

CLOUDINARY_CLOUD_NAME=<your>
CLOUDINARY_API_KEY=<your>
CLOUDINARY_API_SECRET=<your>

# Client (build-time) — use same public URL as the app
REACT_APP_API_URL=https://YOUR-APP-URL.ondigitalocean.app/api
REACT_APP_SOCKET_URL=https://YOUR-APP-URL.ondigitalocean.app

# Ads (optional)
REACT_APP_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxx
REACT_APP_ADSENSE_SLOT_RANDOM_MATCH_INLINE=xxxxxxxx
REACT_APP_ADSENSE_SLOT_CHAT_SIDEBAR=xxxxxxxx
REACT_APP_ADSENSE_SLOT_USERS_LIST_BOTTOM=xxxxxxxx
REACT_APP_ADSENSE_SLOT_GROUP_CHAT_TOP=xxxxxxxx
REACT_APP_ADSENSE_SLOT_PROFILE_BOTTOM=xxxxxxxx
REACT_APP_MONETAG_ZONE_ID=your-zone-id
```

After changing any `REACT_APP_*` variable, trigger a **new deploy** (rebuild).

### 3. MongoDB Atlas + DigitalOcean (step by step)

1. [MongoDB Atlas](https://cloud.mongodb.com) → **Create cluster** (free M0 is fine).  
2. **Database Access** → Add user (username + password) → role **Read and write to any database**.  
3. **Network Access** → **Add IP Address** → `0.0.0.0/0` (allow from anywhere; tighten later).  
4. **Database** → Connect → **Drivers** → copy connection string, e.g.  
   `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/vibetalk?retryWrites=true&w=majority`  
   Replace `USER`, `PASS`, and set database name `vibetalk`.  
5. DigitalOcean App → **Settings** → **App-Level Environment Variables** → paste as **`MONGO_URI`**.  
6. **Redeploy** after changing `MONGO_URI` or any `REACT_APP_*`.  
7. Smoke test: `https://YOUR-APP.ondigitalocean.app/api/health` → `"mongo":"connected"`.

### 4. Smoke test

1. Open app URL → guest login.  
2. Open two browsers → **Random Match** → chat + upload.  
3. Start **video call** → allow camera/mic.  
4. Check Actions on GitHub: **Client build** should pass after push.

---

## Option B — Two components (frontend static + backend)

Use when you want a separate static frontend URL.

### Frontend (Static Site)

- **Source dir:** `client`  
- **Build:** `npm install && npm run build`  
- **Output:** `build`  
- **Env (build time):**

  ```env
  REACT_APP_API_URL=https://YOUR-BACKEND-URL/api
  REACT_APP_SOCKET_URL=https://YOUR-BACKEND-URL
  ```

### Backend (Web Service)

- **Source dir:** `server`  
- **Build:** `npm install`  
- **Run:** `npm start`  
- **Port:** `8081`  
- **Env:**

  ```env
  PORT=8081
  CLIENT_URL=https://YOUR-FRONTEND-URL
  MONGO_URI=...
  JWT_SECRET=...
  CLOUDINARY_*=...
  ```

CORS must include your frontend URL (`CLIENT_URL` + `server/server.js` allowed origins).

---

## Option C — Droplet (VPS)

```bash
# On Ubuntu droplet
git clone https://github.com/harshbki/Vibe-Talk.git
cd Vibe-Talk
cp .env.example server/.env   # edit: MONGO_URI, JWT, Cloudinary, CLIENT_URL
# Set REACT_APP_* in environment or client/.env before build
npm run install-all
npm run build
npm start
# Use nginx + SSL in front, proxy to :8081
```

Use **PM2** or **systemd** to keep `npm start` running.

---

## Local vs production env

| Variable | Local | Production (DO) |
|----------|--------|------------------|
| `MONGO_URI` | `mongodb://127.0.0.1:27017/vibetalk` | Atlas `mongodb+srv://...` |
| `CLIENT_URL` | `http://localhost:8080` | `https://your-app-url` |
| `REACT_APP_SOCKET_URL` | `http://localhost:8081` | `https://your-app-url` |
| `REACT_APP_API_URL` | `/api` (proxy) | `https://your-app-url/api` |

Examples: [.env.example](./.env.example), [client/.env.example](./client/.env.example)

---

## GitHub Actions

| Workflow | Trigger | What it does |
|----------|---------|----------------|
| **Client build** (`ci.yml`) | push/PR `main` | `npm ci` + `npm run build` in `client/` |
| **Node.js Package** | GitHub Release | Builds client; publish is placeholder |

Old **NodeJS with Webpack** failures on the fork parent are from a deleted workflow — ignore them. Use **Client build** on your repo.

---

## What you need from me / checklist

- [ ] DigitalOcean account  
- [ ] MongoDB Atlas `MONGO_URI`  
- [ ] `JWT_SECRET`  
- [ ] Cloudinary keys (or rely on local `/uploads` only)  
- [ ] Final public URL for `CLIENT_URL` + `REACT_APP_*`  
- [ ] Push latest code to `main` before deploy  
