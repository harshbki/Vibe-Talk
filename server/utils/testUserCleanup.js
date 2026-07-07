const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Group = require('../models/Group');
const Notification = require('../models/Notification');

const parseKeepList = (raw = '') =>
  String(raw)
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

const isTestNickname = (nickname, keepNicknames = []) => {
  const n = String(nickname || '').trim();
  const lower = n.toLowerCase();
  if (!n) return true;
  if (keepNicknames.includes(lower)) return false;
  if (n.length <= 2) return true;
  if (/^(hi|hello|ho|hu|ki|kj|hj|hh|jj|test|guest|user|demo|abc|xyz|hicat|hjj)\d*$/i.test(n)) {
    return true;
  }
  if (/^[a-z]{1,5}\d{2,6}$/i.test(n)) return true;
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

const findTestUsers = async (keepNicknames = []) => {
  const keep = parseKeepList(keepNicknames.join ? keepNicknames.join(',') : keepNicknames);
  const guests = await User.find({ isGuest: true }).select('nickname _id isGuest isFullAccount');
  const profiles = await User.find({ isGuest: false }).select('nickname _id isGuest isFullAccount');
  const testProfiles = profiles.filter((u) => isTestNickname(u.nickname, keep));
  const combined = [...guests, ...testProfiles];
  const unique = new Map(combined.map((u) => [String(u._id), u]));
  return [...unique.values()];
};

const cleanupTestUsers = async ({ dryRun = false, keepNicknames = '' } = {}) => {
  const keep = parseKeepList(keepNicknames);
  const targets = await findTestUsers(keep);
  const removed = [];

  for (const u of targets) {
    removed.push({ id: String(u._id), nickname: u.nickname, isGuest: u.isGuest });
    if (!dryRun) await purgeUserData(u._id);
  }

  return { count: removed.length, removed, dryRun };
};

module.exports = {
  isTestNickname,
  cleanupTestUsers,
  findTestUsers,
};
