# ─────────────────────────────────────────────────────────────────────────────
# Vibe Talk — Multi-stage Dockerfile
# Produces a single container: React build + Express/Socket.IO server.
#
# Usage:
#   docker build -t vibe-talk .
#   docker run -p 5000:5000 --env-file server/.env vibe-talk
#
# Deploy to any Docker-based host:
#   Railway  → connect repo, Railway auto-detects this file
#   Fly.io   → fly launch  (auto-detects Dockerfile)
#   DigitalOcean App Platform → connect repo, choose "Dockerfile"
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Build React client ───────────────────────────────────────────────
FROM node:20-alpine AS client-build

WORKDIR /app/client

# Install dependencies first (leverages Docker layer cache)
COPY client/package*.json ./
RUN npm install --legacy-peer-deps

# Copy source and build
COPY client/ ./
RUN CI=false npm run build

# ── Stage 2: Production server image ─────────────────────────────────────────
FROM node:20-alpine AS production

# dumb-init gives us proper signal handling (SIGTERM → graceful shutdown)
RUN apk add --no-cache dumb-init

WORKDIR /app

# Install server dependencies (production only)
COPY server/package*.json ./
RUN npm install --omit=dev

# Copy server source
COPY server/ ./

# Copy the compiled React app from Stage 1
COPY --from=client-build /app/client/build ./client/build

# Render / Railway / Fly.io inject PORT at runtime.
# Default to 5000 for local docker run.
ENV PORT=5000
ENV NODE_ENV=production

EXPOSE 5000

# Use dumb-init as PID 1 so Node receives OS signals correctly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
