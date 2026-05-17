# Vibe-Talk

Real-time MERN chat app: guest login, direct messages, groups, **random match**, media upload, **WebRTC video calls**, notifications, and ad slots (AdSense / Monetag).

**Repo:** [github.com/harshbki/Vibe-Talk](https://github.com/harshbki/Vibe-Talk)  
**Deploy (DigitalOcean):** see [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## Features

- Guest + profile login (JWT)
- Socket.IO messaging, typing, delivered/seen
- Random match queue (any gender)
- Image/video upload (Cloudinary or local `/uploads`)
- Video/audio calls (WebRTC + socket signaling)
- Groups, notifications, profile settings

---

## Tech stack

| Layer | Stack |
|--------|--------|
| Client | React 18, CRA, Tailwind, DaisyUI, Socket.IO client |
| Server | Node, Express, Socket.IO, Mongoose |
| DB | MongoDB (local Docker or Atlas) |
| Media | Cloudinary (optional) |

---

## Local development

**Prerequisites:** Node 18+, MongoDB on `27017` (or `npm run mongo` with Docker)

```bash
# 1. Install
npm run install-all

# 2. Env files (copy examples, fill secrets)
cp .env.example server/.env
cp client/.env.example client/.env

# 3. Start MongoDB (optional Docker)
npm run mongo

# 4. Terminal A — API + Socket (port 8081)
npm run dev

# 5. Terminal B — React (port 8080)
npm run client
```

Open `http://localhost:8080`

---

## Production build (single server)

Express serves the React build from `client/build` when it exists:

```bash
npm run install-all
npm run build
npm start
```

Default API: `http://localhost:8081` — set `CLIENT_URL`, `MONGO_URI`, Cloudinary, and client `REACT_APP_*` vars before building for production (see [DEPLOYMENT.md](./DEPLOYMENT.md)).

---

## Scripts (root `package.json`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Server with nodemon |
| `npm run client` | React dev server |
| `npm run build` | Production client build |
| `npm start` | Production server |
| `npm run mongo` | Docker MongoDB |

---

## CI

GitHub Actions workflow **Client build** (`.github/workflows/ci.yml`) runs `npm ci` + `npm run build` in `client/` on push/PR to `main`.

---

## License

ISC — see [LICENSE](./LICENSE).
