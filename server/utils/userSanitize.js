/** Fields safe to expose for any authenticated or public profile view. */
const toPublicUser = (user) => {
  if (!user) return null;
  const u = user.toObject ? user.toObject() : { ...user };
  return {
    _id: u._id,
    nickname: u.nickname,
    gender: u.gender,
    profilePicture: u.profilePicture || '',
    bio: u.bio || '',
    isFullAccount: Boolean(u.isFullAccount),
    isGuest: Boolean(u.isGuest),
    location: u.location || '',
    interests: u.interests || [],
    createdAt: u.createdAt,
    lastSeen: u.privacy?.lastSeenVisible === 'nobody' ? undefined : u.lastSeen,
  };
};

/** Full account data for the logged-in user only. */
const toSelfUser = (user) => {
  if (!user) return null;
  const u = user.toObject ? user.toObject() : { ...user };
  delete u.__v;
  return u;
};

const withAuthToken = (user, token) => ({
  ...toSelfUser(user),
  token,
});

module.exports = { toPublicUser, toSelfUser, withAuthToken };
