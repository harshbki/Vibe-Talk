/** WebRTC ICE servers — STUN by default; optional TURN via env for strict NAT. */
export const getIceServers = () => {
  const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ];

  const turnUrl = process.env.REACT_APP_TURN_URL?.trim();
  const turnUser = process.env.REACT_APP_TURN_USERNAME?.trim();
  const turnCred = process.env.REACT_APP_TURN_CREDENTIAL?.trim();

  if (turnUrl && turnUser && turnCred) {
    iceServers.push({
      urls: turnUrl,
      username: turnUser,
      credential: turnCred,
    });
  }

  return { iceServers };
};
