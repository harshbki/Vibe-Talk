#!/usr/bin/env bash
# Quick local stack check (run from repo root)
set -e
echo "=== Vibe Talk local check ==="
if curl -sf http://localhost:8081/api/health >/dev/null 2>&1; then
  echo "API 8081: OK"
  curl -s http://localhost:8081/api/health
  echo ""
else
  echo "API 8081: DOWN — run: cd server && npm start"
fi
if curl -sf http://localhost:8080 >/dev/null 2>&1; then
  echo "Client 8080: OK"
else
  echo "Client 8080: DOWN — run: cd client && npm start"
fi
if command -v docker >/dev/null && docker ps --format '{{.Names}}' 2>/dev/null | grep -q mongo; then
  echo "Mongo Docker: running"
else
  echo "Mongo: check port 27017 / npm run mongo"
fi
