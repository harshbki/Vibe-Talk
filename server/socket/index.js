// Active users maps: userId -> socketId and socketId -> userId
const activeUsers = new Map();
const socketToUser = new Map();

const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Register user as online
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      activeUsers.set(userData._id, socket.id);
      socketToUser.set(socket.id, userData._id);
      socket.emit("connected");
      io.emit("online-users", Array.from(activeUsers.keys()));
      console.log(`User ${userData._id} is online`);
    });

    // Join a chat room
    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat: ${chatId}`);
    });

    // Leave a chat room
    socket.on("leave-chat", (chatId) => {
      socket.leave(chatId);
      console.log(`Socket ${socket.id} left chat: ${chatId}`);
    });

    // New message received — broadcast to all users in the chat except sender
    socket.on("new-message", (message) => {
      const chat = message.chat;
      if (!chat || !chat.users) {
        console.log("chat.users not defined");
        return;
      }
      chat.users.forEach((user) => {
        if (user._id.toString() === message.sender._id.toString()) return;
        socket.to(user._id.toString()).emit("message-received", message);
      });
    });

    // Typing indicator
    socket.on("typing", (chatId) => {
      socket.to(chatId).emit("typing", chatId);
    });

    socket.on("stop-typing", (chatId) => {
      socket.to(chatId).emit("stop-typing", chatId);
    });

    // WebRTC signaling for video/audio calls
    socket.on("call-user", ({ userToCall, signal, from, name }) => {
      io.to(userToCall).emit("call-incoming", { signal, from, name });
    });

    socket.on("answer-call", ({ to, signal }) => {
      io.to(to).emit("call-accepted", signal);
    });

    socket.on("end-call", ({ to }) => {
      io.to(to).emit("call-ended");
    });

    // Disconnect
    socket.on("disconnect", () => {
      // O(1) lookup using reverse map
      const userId = socketToUser.get(socket.id);
      if (userId) {
        activeUsers.delete(userId);
        socketToUser.delete(socket.id);
        console.log(`User ${userId} went offline`);
      }
      io.emit("online-users", Array.from(activeUsers.keys()));
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = initSocket;
