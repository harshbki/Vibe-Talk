import { io } from 'socket.io-client';

function getSocketUrl() {
  if (process.env.REACT_APP_SOCKET_URL) return process.env.REACT_APP_SOCKET_URL;
  const { protocol, hostname, port } = window.location;
  if (hostname.endsWith('.app.github.dev')) {
    const base = hostname.replace(/-\d+\.app\.github\.dev$/, '');
    return `https://${base}-8081.app.github.dev`;
  }
  return 'http://localhost:8081';
}

const SOCKET_URL = getSocketUrl();

let socket = null;

export const initSocket = (userId) => {
  if (!socket) {
    socket = io(SOCKET_URL);
    socket.on('connect', () => {
      console.log('Socket connected');
      socket.emit('user_online', userId);
    });
  } else if (userId) {
    socket.emit('user_online', userId);
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default socket;
