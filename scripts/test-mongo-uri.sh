#!/usr/bin/env bash
# Test MongoDB connection (local or Atlas). Usage:
#   MONGO_URI='mongodb+srv://...' ./scripts/test-mongo-uri.sh
# Or set MONGO_URI in server/.env and run from repo root.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
if [ -f "$ROOT/server/.env" ] && [ -z "$MONGO_URI" ]; then
  MONGO_URI="$(node -e "
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join('$ROOT', 'server', '.env');
    const text = fs.readFileSync(envPath, 'utf8');
    for (const line of text.split(/\\r?\\n/)) {
      const m = line.match(/^\\s*MONGO_URI\\s*=\\s*(.+?)\\s*$/);
      if (!m) continue;
      let v = m[1].trim();
      if ((v.startsWith('\"') && v.endsWith('\"')) || (v.startsWith(\"'\") && v.endsWith(\"'\"))) {
        v = v.slice(1, -1);
      }
      process.stdout.write(v);
      break;
    }
  ")"
  export MONGO_URI
fi
if [ -z "$MONGO_URI" ]; then
  echo "Set MONGO_URI (Atlas or local), e.g. in server/.env"
  exit 1
fi
echo "Testing: ${MONGO_URI%%@*}@***"
cd "$ROOT/server"
MONGO_URI="$MONGO_URI" node -e "
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;
mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 })
  .then(() => mongoose.connection.db.admin().command({ ping: 1 }))
  .then((r) => { console.log('OK — MongoDB ping:', JSON.stringify(r)); process.exit(0); })
  .catch((e) => { console.error('FAIL:', e.message); process.exit(1); });
" 2>&1
