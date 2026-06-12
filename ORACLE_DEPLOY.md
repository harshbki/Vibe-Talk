# Vibe-Talk — Oracle Cloud Free VM Deploy (24/7, $0)

> **Best free hosting for this app:** Socket.IO + WebRTC need an always-on Node server.  
> Render free sleeps; Oracle Always Free VM does not.

## Architecture (single server — recommended)

```
Browser (React build) ──HTTPS──► Oracle VM (Nginx :443)
                                      │
                                      ├─ proxy → Node :8081 (API + Socket.IO + static React)
                                      ├─ MongoDB Atlas (cloud, free M0)
                                      └─ Cloudinary (uploads)
```

**Frontend + backend same server** — no separate frontend host needed.  
`npm run build` creates `client/build`; `server/server.js` serves it.

---

## Part 1 — GitHub

```bash
git add <source files only — never .env or node_modules>
git commit -m "feat: production hardening + video call fixes"
git push origin main
```

GitHub Actions **CI** must be green before deploy.

---

## Part 2 — MongoDB Atlas (already have)

1. [cloud.mongodb.com](https://cloud.mongodb.com) → cluster running
2. **Network Access** → `0.0.0.0/0` (Oracle VM IP changes; tighten later)
3. Copy `MONGO_URI` with database `vibetalk`

---

## Part 3 — Oracle Cloud Free VM

### 3.1 Create account & VM

1. [cloud.oracle.com](https://cloud.oracle.com) → Sign up (card verify, Always Free = $0)
2. **Compute → Instances → Create**
3. **Image:** Ubuntu 22.04
4. **Shape:** Ampere A1 (Always Free eligible) — 1 OCPU, 6 GB RAM minimum
5. **Networking:** assign **public IP**
6. Download SSH private key

### 3.2 Open firewall ports

**Oracle Console → VCN → Security List → Ingress:**

| Port | Protocol | Source |
|------|----------|--------|
| 22 | TCP | Your IP (SSH) |
| 80 | TCP | 0.0.0.0/0 |
| 443 | TCP | 0.0.0.0/0 |

### 3.3 SSH into VM & install

```bash
ssh -i your-key.pem ubuntu@YOUR_VM_PUBLIC_IP

sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git certbot python3-certbot-nginx
sudo npm install -g pm2
```

### 3.4 Clone & build app

```bash
git clone https://github.com/harshbki/Vibe-Talk.git
cd Vibe-Talk
npm run install-all
```

Create `server/.env` (never commit this file):

```env
NODE_ENV=production
PORT=8081
HOST=0.0.0.0
CLIENT_URL=https://YOUR-DOMAIN.com
MONGO_URI=mongodb+srv://...
JWT_SECRET=long-random-32plus-chars
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
MAX_UPLOAD_MB=100
```

Build React with production URLs:

```bash
export REACT_APP_API_URL=https://YOUR-DOMAIN.com/api
export REACT_APP_SOCKET_URL=https://YOUR-DOMAIN.com
export REACT_APP_ADSENSE_CLIENT_ID=ca-pub-...
export REACT_APP_ADSENSE_SLOT_CHAT_SIDEBAR=3628542402
export REACT_APP_ADSENSE_SLOT_RANDOM_MATCH_INLINE=3628542402
export REACT_APP_ADSENSE_SLOT_GROUP_CHAT_TOP=3628542402
export REACT_APP_MONETAG_ZONE_ID=your-zone-id
npm run build
```

Start with PM2:

```bash
pm2 start npm --name vibetalk -- start
pm2 save
pm2 startup
```

### 3.5 Nginx reverse proxy (WebSocket support)

```bash
sudo nano /etc/nginx/sites-available/vibetalk
```

```nginx
server {
    listen 80;
    server_name YOUR-DOMAIN.com www.YOUR-DOMAIN.com;

    location / {
        proxy_pass http://127.0.0.1:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/vibetalk /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d YOUR-DOMAIN.com -d www.YOUR-DOMAIN.com
```

---

## Part 4 — Custom domain

At your domain registrar (Namecheap, GoDaddy, etc.):

| Type | Name | Value |
|------|------|--------|
| A | `@` | Oracle VM **public IP** |
| A | `www` | Same IP (or CNAME to `@`) |

Wait 15–60 min → open `https://YOUR-DOMAIN.com/api/health` → `"mongo":"connected"`

Update `CLIENT_URL` + rebuild if domain changed.

---

## Part 5 — Smoke test

- [ ] Guest login (JWT token issued)
- [ ] Random match — two browsers
- [ ] Video call — receiver sees **Incoming Call** (not Start Video Call)
- [ ] Mic/camera allow → audio works
- [ ] Upload → Cloudinary URL
- [ ] End chat → both sides end

---

## Oracle vs DigitalOcean

| | Oracle Free VM | DigitalOcean App |
|--|----------------|------------------|
| Cost | **$0** | ~$5–12/mo |
| Setup | Manual (SSH, Nginx, PM2) | Click deploy |
| 24/7 | Yes | Yes |
| WebSocket | Yes (Nginx upgrade) | Yes |
| Best for | Budget / learning | Fastest deploy |

Repo also has `.do/app.yaml` if you prefer DigitalOcean later.
