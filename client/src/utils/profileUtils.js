/** Profile login requires full name + date of birth. */
export function isProfileComplete(user) {
  if (!user) return false;
  const name = user.fullName && String(user.fullName).trim();
  return !!(name && user.dateOfBirth);
}
