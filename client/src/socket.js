import { io } from 'socket.io-client';

function getSocketUrl() {
  const { hostname } = window.location;
  // Codespace: connect through React proxy (same origin) since port 8081 isn't tunneled
  if (
    hostname.endsWith('.app.github.dev') ||
    hostname.endsWith('.codespaces.dev')
  ) {
    return window.location.origin;
  }
  // Use env var if provided (for custom setups)
  if (process.env.REACT_APP_SOCKET_URL) return process.env.REACT_APP_SOCKET_URL;
  return 'http://localhost:8081';
}

const SOCKET_URL = getSocketUrl();

let socket = null;

const SOCKET_OPTIONS = {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 8000,
  timeout: 20000,
  transports: ['polling', 'websocket'],
};

export const initSocket = (userId) => {
  if (!socket) {
    socket = io(SOCKET_URL, SOCKET_OPTIONS);

    socket.on('connect', () => {
      console.log('Socket connected');
      if (userId) socket.emit('user_online', userId);
    });

    socket.on('disconnect', (reason) => {
      console.warn('Socket disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.warn('Socket connect error (is API on 8081 running?):', err.message);
    });
  } else if (userId) {
    if (socket.connected) {
      socket.emit('user_online', userId);
    } else {
      socket.once('connect', () => socket.emit('user_online', userId));
    }
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
