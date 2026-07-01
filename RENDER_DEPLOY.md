# Vibe-Talk — Render FULL setup (no credit card)

> **Pehle deploy karo → URL milega → phir saari env vars paste → redeploy.**  
> Secrets `server/.env` se Render dashboard mein daalo — GitHub par mat commit karo.

---

## STEP 1 — MongoDB Atlas (5 min)

1. https://cloud.mongodb.com → login
2. **Network Access** → Add IP → **Allow Access from Anywhere** (`0.0.0.0/0`)
3. Connection string ready (database name: `vibetalk`)

---

## STEP 2 — Render login

1. https://render.com → **Get Started**
2. **Continue with GitHub** → account `harshbki`
3. Repo access: **Vibe-Talk** only
4. **Card mat daalo** — Hobby free ke liye zaroori nahi

---

## STEP 3 — Create Web Service (exact fields)

**New + → Web Service** (sirf 1 service, 2nd project mat banao)

| Field | Value |
|-------|-------|
| Name | `vibetalk` |
| Language / Runtime | **Node** |
| Region | **Singapore** |
| Branch | `main` |
| Root Directory | *(blank)* |
| Build Command | `npm run install-all && npm run build` |
| Start Command | `npm start` |
| Instance Type | **Free** |
| Auto-Deploy | Yes |
| Health Check Path | `/api/health` |

Click **Create Web Service** → wait → copy URL e.g. `https://vibetalk-xxxx.onrender.com`

---

## STEP 4 — Environment variables (Render → Environment)

Replace `YOUR-URL` with your real Render URL (no trailing `/`).

### Copy-paste list (Key = Value)

```
NODE_ENV=production
HOST=0.0.0.0
MAX_UPLOAD_MB=100
CLIENT_URL=YOUR-URL
MONGO_URI=(paste from server/.env — no outer quotes)
JWT_SECRET=(paste from server/.env)
CLOUDINARY_CLOUD_NAME=(paste from server/.env)
CLOUDINARY_API_KEY=(paste from server/.env)
CLOUDINARY_API_SECRET=(paste from server/.env)
REACT_APP_API_URL=YOUR-URL/api
REACT_APP_SOCKET_URL=YOUR-URL
REACT_APP_ADSENSE_CLIENT_ID=ca-pub-5149550826483446
REACT_APP_ADSENSE_SLOT_CHAT_SIDEBAR=3906615674
REACT_APP_ADSENSE_SLOT_RANDOM_MATCH_INLINE=3628542402
REACT_APP_ADSENSE_SLOT_GROUP_CHAT_TOP=6888002231
REACT_APP_ADSENSE_SLOT_USERS_LIST_BOTTOM=6352156478
REACT_APP_ADSENSE_SLOT_PROFILE_BOTTOM=8184534352
```

**PORT mat set karo** — Render auto set karta hai.

Save → **Manual Deploy** → **Clear build cache & deploy**

---

## STEP 5 — UptimeRobot (sleep fix, free)

1. https://uptimerobot.com → free signup
2. Monitor → HTTP(s) → `YOUR-URL/api/health` → interval **5 min**

---

## STEP 6 — GitHub (optional keep-alive)

Repo → Settings → Secrets → Actions → `RENDER_APP_URL` = `YOUR-URL`

---

## STEP 7 — Test

1. Open `YOUR-URL/api/health` → `"mongo":"connected"`
2. Browser: delete `vibeUser` + `vibeToken`
3. Guest login → match → video call

---

## Domain (baad mein)

Custom domain add karo → update `CLIENT_URL`, `REACT_APP_API_URL`, `REACT_APP_SOCKET_URL` → redeploy with cache clear.

---

## Mat karna

- Render Postgres ❌
- 2nd Web Service ❌
- `REACT_APP_SOCKET_URL` mein port ❌
- `.env` files GitHub push ❌
