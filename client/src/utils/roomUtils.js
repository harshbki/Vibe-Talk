/** Stable private chat / video room id for two users. */
export const getPrivateRoomId = (userIdA, userIdB) => {
  if (!userIdA || !userIdB) return null;
  const ids = [String(userIdA), String(userIdB)].sort();
  return `private_${ids[0]}_${ids[1]}`;
};
