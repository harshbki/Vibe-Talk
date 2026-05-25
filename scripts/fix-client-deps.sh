#!/usr/bin/env bash
# Fix broken client/node_modules (core-js-pure ENOENT, etc.)
set -e
cd "$(dirname "$0")/../client"
echo "Removing node_modules and cache..."
chmod -R u+w node_modules 2>/dev/null || true
rm -rf node_modules .cache build
echo "npm ci..."
npm ci --no-audit --no-fund
test -f node_modules/core-js-pure/full/global-this.js || { echo "core-js-pure missing"; exit 1; }
echo "OK. Run: npm start"
