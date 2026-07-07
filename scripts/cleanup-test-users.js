#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });
const mongoose = require('mongoose');
const { cleanupTestUsers } = require('../server/utils/testUserCleanup');

const dryRun = process.argv.includes('--dry-run');

const run = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is required (set in server/.env or env var).');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log(dryRun ? '[DRY RUN] Connected to MongoDB' : 'Connected to MongoDB');

  const result = await cleanupTestUsers({
    dryRun,
    keepNicknames: process.env.KEEP_NICKNAMES || '',
  });

  console.log(`Found ${result.count} test/guest users to remove.`);
  for (const u of result.removed) {
    console.log(`  - ${u.nickname} (${u.id})${u.isGuest ? ' [guest]' : ''}`);
  }

  console.log(dryRun ? 'Dry run complete — no documents deleted.' : 'Cleanup complete.');
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
