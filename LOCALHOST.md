# Vibe Talk — Localhost (100% working)

## One-time setup

```bash
cd Vibe-Talk
npm run install-all
```

Copy env (if missing):

```bash
cp .env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env` — Mongo + Cloudinary.

## Every time you develop

**Terminal 1 — MongoDB**

```bash
npm run mongo
```

Windows: MongoDB service **Running**, or `npm run mongo:win`.

**Terminal 2 — API (required)**

```bash
cd server
npm start
```

Wait for: `Server running on http://0.0.0.0:8081`  
Test: http://localhost:8081/api/health → `"mongo":"connected"`

**Terminal 3 — React**

```bash
cd client
npm start
```

Open: http://localhost:8080

### Windows shortcut

```powershell
.\scripts\start-dev.ps1
```

### If client shows `core-js-pure` error

```powershell
.\scripts\fix-client-deps.ps1
```

### Check stack

```bash
npm run check-local
```

## Red banner on site

- **API offline** → Terminal 2 not running → `cd server && npm start`
- **Mongo not connected** → `npm run mongo` then restart server

## Ports

| Port | Service |
|------|---------|
| 8080 | React (browser) |
| 8081 | API + Socket.IO |
| 27017 | MongoDB |
