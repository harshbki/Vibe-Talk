# Vibe-Talk Deployment Guide

This guide gives you a production deployment path and the exact items I need from you.

## 1. What I Need From You

Provide these values/accounts first:

1. DigitalOcean account access (App Platform project access).
2. MongoDB Atlas access (project owner or database user credentials).
3. Cloudinary credentials:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
4. Final frontend domain URL (for CORS and `CLIENT_URL`).
5. JWT secret value (long random string).
6. Ad network values:
- `REACT_APP_ADSENSE_CLIENT_ID`
- All AdSense slot IDs
- Monetag zone ID

## 2. Recommended Production Setup

- Frontend: DigitalOcean App Platform (Static Site)
- Backend: DigitalOcean App Platform (Web Service, Node.js)
- Database: MongoDB Atlas (M0/M2/M5)

## 3. DigitalOcean App Platform Setup

Create two app components from the same repo:

1. `frontend` (Static Site)
- Source dir: `client`
- Build command: `npm install && npm run build`
- Output dir: `build`

2. `backend` (Web Service)
- Source dir: `server`
- Build command: `npm install`
- Run command: `npm start`
- HTTP port: `8081`

3. Add both component domains:
- Frontend domain: `https://your-frontend-domain`
- Backend domain: `https://your-backend-domain`

## 4. Server Environment Variables

Set these on backend host:

```env
PORT=8081
CLIENT_URL=https://your-frontend-domain.com
MONGO_URI=mongodb+srv://<db_user>:<db_password>@<cluster>/<db_name>?retryWrites=true&w=majority
JWT_SECRET=<strong-random-secret>
CLOUDINARY_CLOUD_NAME=<value>
CLOUDINARY_API_KEY=<value>
CLOUDINARY_API_SECRET=<value>
```

## 5. Client Environment Variables

Set these on frontend host:

```env
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
REACT_APP_ADSENSE_SLOT_CHAT_SIDEBAR=1234567890
REACT_APP_ADSENSE_SLOT_USERS_LIST_BOTTOM=1234567890
REACT_APP_ADSENSE_SLOT_GROUP_CHAT_TOP=1234567890
REACT_APP_ADSENSE_SLOT_PROFILE_BOTTOM=1234567890
REACT_APP_ADSENSE_SLOT_RANDOM_MATCH_INLINE=1234567890
REACT_APP_MONETAG_ZONE_ID=your_monetag_zone_id
```

## 6. MongoDB Atlas Access Setup

1. Create Atlas cluster.
2. Create database user with read/write on your app DB.
3. In Network Access, allow host IPs:
- For quick setup: `0.0.0.0/0`
- For stricter setup: only backend provider egress IP ranges.
4. Use the Atlas connection string in backend `MONGO_URI`.

Note for local development:
- Keep using local DB with `MONGO_URI=mongodb://localhost:27017/vibetalk`.
- Atlas is only for production deployment.

## 7. Build and Start Commands

If you prefer a single root-level build command in DigitalOcean, use:

```bash
cd client && npm install && npm run build && cd .. && cd server && npm install
```

Run command:

```bash
cd server && npm start
```

Backend service:

```bash
cd server
npm install
npm run start
```

Frontend static build:

```bash
cd client
npm install
npm run build
```

Publish `client/build` as static output.

## 8. Temporary Codespaces Hosting (Fast Demo)

Use port forwarding in this workspace:

1. Forward `3000` as Public (frontend)
2. Forward `8081` as Private/Public (backend)
3. Keep `27017` private

Run:

```bash
# terminal 1
cd server
PORT=8081 npm run dev

# terminal 2
cd client
npm start
```

## 9. Post-Deploy Smoke Tests

1. Open frontend URL.
2. Guest login with nickname + gender.
3. Send/receive message in two browser sessions.
4. Validate upload and group media.
5. Verify ad units render where configured.
6. Verify notifications and seen/delivered ticks.
