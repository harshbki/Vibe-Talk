/** Profile is complete only when name + date of birth are set (required for profile login). */
function isProfileComplete(user) {
  if (!user) return false;
  const name = user.fullName && String(user.fullName).trim();
  const dob = user.dateOfBirth;
  return !!(name && dob);
}

/** Keep isFullAccount in sync with actual profile data. */
function syncProfileCompleteFlag(user) {
  if (!user) return user;
  const complete = isProfileComplete(user);
  if (user.isFullAccount !== complete) {
    user.isFullAccount = complete;
  }
  return user;
}

module.exports = { isProfileComplete, syncProfileCompleteFlag };
