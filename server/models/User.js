const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nickname: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  isGuest: { type: Boolean, default: true },
  freeCallsUsed: { type: Number, default: 0 },
  fullName: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 150 },
  profilePicture: { type: String, default: '' },
  dateOfBirth: { type: Date, default: null },
  location: { type: String, default: '' },
  interests: [{ type: String }],
  isFullAccount: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
  privacy: {
    lastSeenVisible: { type: String, enum: ['everyone', 'nobody'], default: 'everyone' },
    profileVisible: { type: String, enum: ['public', 'private'], default: 'public' }
  },
  notifications: {
    messages: { type: Boolean, default: true },
    matches: { type: Boolean, default: true },
    groups: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
