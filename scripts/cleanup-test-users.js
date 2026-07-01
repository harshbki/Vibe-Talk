#!/usr/bin/env node
/**
 * Remove guest/test accounts from MongoDB.
 * Usage:
 *   MONGO_URI="mongodb+srv://..." node scripts/cleanup-test-users.js
 *   MONGO_URI="..." node scripts/cleanup-test-users.js --dry-run
 *
 * Keeps users listed in KEEP_NICKNAMES (comma-separated env, optional).
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });
const mongoose = require('mongoose');

const User = require('../server/models/User');
const Chat = require('../server/models/Chat');
const Message = require('../server/models/Message');
const Group = require('../server/models/Group');
const Notification = require('../server/models/Notification');

const dryRun = process.argv.includes('--dry-run');
const keepNicknames = (process.env.KEEP_NICKNAMES || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const isTestNickname = (nickname) => {
  const n = String(nickname || '').trim();
  const lower = n.toLowerCase();
  if (!n) return true;
  if (keepNicknames.includes(lower)) return false;
  if (n.length <= 2) return true;
  if (/^(hi|hello|ho|ki|hj|hh|test|guest|user|demo|abc|xyz)\d*$/i.test(n)) return true;
  if (/^[a-z]{1,4}\d{3,5}$/i.test(n)) return true;
  if (/^jknk\d*$/i.test(n)) return true;
  return false;
};

const purgeUserData = async (userId) => {
  await Message.deleteMany({ sender: userId });
  const chats = await Chat.find({ participants: userId });
  for (const chat of chats) {
    await Message.deleteMany({ chat: chat._id });
  }
  await Chat.deleteMany({ participants: userId });
  await Group.deleteMany({ admin: userId });
  await Group.updateMany({}, { $pull: { members: userId } });
  await Notification.deleteMany({ user: userId });
  await User.findByIdAndDelete(userId);
};

const run = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is required (set in server/.env or env var).');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log(dryRun ? '[DRY RUN] Connected to MongoDB' : 'Connected to MongoDB');

  const guests = await User.find({ isGuest: true }).select('nickname _id');
  const testFull = await User.find({ isGuest: false }).select('nickname _id isFullAccount');
  const testProfiles = testFull.filter((u) => isTestNickname(u.nickname));

  const toDelete = [...guests, ...testProfiles];
  const unique = new Map(toDelete.map((u) => [String(u._id), u]));

  console.log(`Found ${unique.size} test/guest users to remove.`);
  for (const u of unique.values()) {
    console.log(`  - ${u.nickname} (${u._id})`);
    if (!dryRun) await purgeUserData(u._id);
  }

  if (dryRun) {
    console.log('Dry run complete — no documents deleted.');
  } else {
    console.log('Cleanup complete.');
  }

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
