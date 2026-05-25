#!/usr/bin/env bash
# Start API (8081) and client (8080). Mongo must already be running.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== Vibe Talk dev ==="
if ! curl -sf http://127.0.0.1:27017 >/dev/null 2>&1; then
  if ! docker ps --format '{{.Names}}' 2>/dev/null | grep -q mongo; then
    echo "Start Mongo first: npm run mongo"
  fi
fi

(cd "$ROOT/server" && npm start) &
sleep 3
curl -sf http://127.0.0.1:8081/api/health && echo "" || echo "WARN: API not up on 8081"

echo "Starting client on :8080..."
(cd "$ROOT/client" && BROWSER=none npm start)
