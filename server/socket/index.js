const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Group = require('../models/Group');
const Notification = require('../models/Notification');
const { updateOnlineUsers } = require('../routes/userRoutes');

const onlineUsers = new Map();

// Random match queues
const waitingMales = [];
const waitingFemales = [];
const activeMatches = new Map(); // roomId -> { aId, bId }

const broadcastOnlineUsers = (io) => {
  const usersList = Array.from(onlineUsers.entries()).map(([id, data]) => ({
    _id: id,
    ...data
  }));
  io.emit('online_users', usersList);
  updateOnlineUsers(usersList);
};

const generateRoomId = () => {
  return 'room_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const removeFromQueues = (userId) => {
  const maleIndex = waitingMales.findIndex(u => u.userId === userId);
  if (maleIndex !== -1) waitingMales.splice(maleIndex, 1);
  
  const femaleIndex = waitingFemales.findIndex(u => u.userId === userId);
  if (femaleIndex !== -1) waitingFemales.splice(femaleIndex, 1);
};

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins with their userId
    socket.on('user_online', async (userId) => {
      try {
        const user = await User.findById(userId);
        if (!user) return;

        // Always attach socket.userId so we can clean up queues/lastSeen on disconnect.
        socket.userId = userId;

        // But only broadcast "online users" list for users who have completed their profile.
        if (user.isFullAccount) {
          onlineUsers.set(userId, {
            socketId: socket.id,
            nickname: user.nickname,
            gender: user.gender,
          });
          broadcastOnlineUsers(io);
        }
      } catch (error) {
        console.error('Error setting user online:', error);
      }
    });

    // Random match finding
    socket.on('find_match', async (data) => {
      const { userId, gender, nickname } = data;
      
      // Remove from queues if already waiting
      removeFromQueues(userId);
      
      const userInfo = { userId, nickname, socketId: socket.id, gender };
      
      // Pick any available partner (supports any gender pairing, including same-gender matches).
      let partner = null;
      if (gender === 'Male') {
        if (waitingFemales.length > 0) partner = waitingFemales.shift();
        else if (waitingMales.length > 0) partner = waitingMales.shift();
      } else if (gender === 'Female') {
        if (waitingMales.length > 0) partner = waitingMales.shift();
        else if (waitingFemales.length > 0) partner = waitingFemales.shift();
      } else {
        // Unknown/invalid gender -> fall back to any queue.
        if (waitingFemales.length > 0) partner = waitingFemales.shift();
        else if (waitingMales.length > 0) partner = waitingMales.shift();
      }

      if (partner) {
        const roomId = generateRoomId();

        socket.join(roomId);
        const partnerSocket = io.sockets.sockets.get(partner.socketId);
        if (partnerSocket) partnerSocket.join(roomId);

        // Store active match (two participant ids)
        activeMatches.set(roomId, { aId: userId, bId: partner.userId });

        // Emit match found to initiator
        socket.emit('match_found', {
          roomId,
          partner: {
            _id: partner.userId,
            nickname: partner.nickname,
            gender: partner.gender,
          },
        });

        // Emit match found to partner
        io.to(partner.socketId).emit('match_found', {
          roomId,
          partner: {
            _id: userId,
            nickname: nickname,
            gender: gender,
          },
        });

        console.log(
          `Match created: ${nickname} (${gender}) <-> ${partner.nickname} (${partner.gender}) in ${roomId}`
        );

        // Create match notifications
        try {
          const n1 = await Notification.create({
            user: userId,
            type: 'match',
            title: 'It\'s a Match!',
            body: `You matched with ${partner.nickname}`,
            data: { roomId },
          });
          socket.emit('new_notification', n1);

          const n2 = await Notification.create({
            user: partner.userId,
            type: 'match',
            title: 'It\'s a Match!',
            body: `You matched with ${nickname}`,
            data: { roomId },
          });
          io.to(partner.socketId).emit('new_notification', n2);
        } catch (err) {
          console.error('Match notification error:', err);
        }
      } else {
        // No match available, add to queue
        if (gender === 'Male') waitingMales.push(userInfo);
        else waitingFemales.push(userInfo);

        socket.emit('searching', {
          message: 'Looking for a match...',
          queuePosition: gender === 'Male' ? waitingMales.length : waitingFemales.length,
        });

        console.log(
          `${nickname} (${gender}) added to queue. Males: ${waitingMales.length}, Females: ${waitingFemales.length}`
        );
      }
    });

    // Cancel search
    socket.on('cancel_search', (userId) => {
      removeFromQueues(userId);
      socket.emit('search_cancelled');
      console.log(`User ${userId} cancelled search`);
    });

    // Send message in match room (temporary — not saved to DB)
    socket.on('match_message', (data) => {
      const { roomId, message, from, fromNickname } = data;
      socket.to(roomId).emit('match_message_received', {
        from,
        fromNickname,
        message,
        timestamp: new Date()
      });
    });

    // End match
    socket.on('end_match', (data) => {
      const { roomId, userId } = data;
      const match = activeMatches.get(roomId);
      if (match) {
        const partnerId = match.aId === userId ? match.bId : match.aId;
        const partnerData = onlineUsers.get(partnerId);
        if (partnerData) {
          io.to(partnerData.socketId).emit('match_ended', {
            message: 'Your partner has left the chat'
          });
        }
        activeMatches.delete(roomId);
        socket.leave(roomId);
      }
    });

    // Handle messages (persist to DB)
    socket.on('send_message', async (data) => {
      const { to, message, from } = data;
      const payload = typeof message === 'string' ? { text: message } : (message || {});

      let savedMsg = null;
      try {
        // Get or create chat
        let chat = await Chat.findOne({
          participants: { $all: [from, to] }
        });
        if (!chat) {
          chat = await Chat.create({ participants: [from, to] });
        }

        // Save message to DB with status
        const recipient = onlineUsers.get(to);
        savedMsg = await Message.create({
          chat: chat._id,
          sender: from,
          text: payload.text || '',
          image: payload.mediaUrl || null,
          status: recipient ? 'delivered' : 'sent'
        });

        // Update last message on chat
        await Chat.findByIdAndUpdate(chat._id, {
          lastMessage: {
            text: payload.text || (payload.mediaUrl ? '[media]' : ''),
            sender: from,
            timestamp: new Date()
          }
        });
      } catch (error) {
        console.error('Error persisting message:', error);
      }

      const recipient = onlineUsers.get(to);
      const msgId = savedMsg ? savedMsg._id.toString() : null;

      if (recipient) {
        io.to(recipient.socketId).emit('receive_message', {
          from,
          message: payload,
          msgId,
          timestamp: new Date()
        });
        // Tell sender the message was delivered
        socket.emit('message_status_update', {
          msgId,
          to,
          status: 'delivered'
        });

        // Create notification for recipient
        try {
          const senderUser = onlineUsers.get(from);
          const notif = await Notification.create({
            user: to,
            type: 'message',
            title: 'New message',
            body: `${senderUser?.nickname || 'Someone'}: ${payload.text || '[media]'}`,
            data: { from, msgId }
          });
          io.to(recipient.socketId).emit('new_notification', notif);
        } catch (err) {
          console.error('Notification create error:', err);
        }
      } else {
        // Recipient offline – status stays 'sent'
        socket.emit('message_status_update', {
          msgId,
          to,
          status: 'sent'
        });
      }
    });

    // Delete a message
    socket.on('delete_message', async (data) => {
      const { msgId, chatUserId, from } = data;
      try {
        const msg = await Message.findById(msgId);
        if (msg && msg.sender.toString() === from) {
          msg.isDeleted = true;
          msg.text = '';
          msg.image = null;
          await msg.save();

          // Notify the other user in the chat
          const recipient = onlineUsers.get(chatUserId);
          if (recipient) {
            io.to(recipient.socketId).emit('message_deleted', { msgId, from });
          }
          // Confirm to sender
          socket.emit('message_deleted', { msgId, from });
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    });

    // Mark messages as seen
    socket.on('messages_seen', async (data) => {
      const { by, from } = data; // 'by' read the messages, 'from' sent them
      try {
        const chat = await Chat.findOne({
          participants: { $all: [by, from] }
        });
        if (chat) {
          await Message.updateMany(
            { chat: chat._id, sender: from, status: { $ne: 'seen' } },
            { status: 'seen' }
          );
        }
      } catch (error) {
        console.error('Error marking messages seen:', error);
      }
      // Notify sender their messages were seen
      const sender = onlineUsers.get(from);
      if (sender) {
        io.to(sender.socketId).emit('messages_seen_update', { by, from });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const { to, from } = data;
      const recipient = onlineUsers.get(to);
      if (recipient) {
        io.to(recipient.socketId).emit('user_typing', { from });
      }
    });

    socket.on('stop_typing', (data) => {
      const { to, from } = data;
      const recipient = onlineUsers.get(to);
      if (recipient) {
        io.to(recipient.socketId).emit('user_stop_typing', { from });
      }
    });

    // Match typing indicator
    socket.on('match_typing', (data) => {
      const { roomId, from } = data;
      socket.to(roomId).emit('match_partner_typing', { from });
    });

    socket.on('match_stop_typing', (data) => {
      const { roomId, from } = data;
      socket.to(roomId).emit('match_partner_stop_typing', { from });
    });

    // ============ WebRTC Video Call Signaling ============
    
    // Start video call request
    socket.on('call_request', (data) => {
      const { roomId, from, fromNickname } = data;
      socket.to(roomId).emit('call_incoming', { from, fromNickname });
      console.log(`Video call request from ${fromNickname} in room ${roomId}`);
    });

    // Accept video call
    socket.on('call_accept', (data) => {
      const { roomId, from } = data;
      socket.to(roomId).emit('call_accepted', { from });
      console.log(`Call accepted in room ${roomId}`);
    });

    // Reject video call
    socket.on('call_reject', (data) => {
      const { roomId, from } = data;
      socket.to(roomId).emit('call_rejected', { from });
      console.log(`Call rejected in room ${roomId}`);
    });

    // WebRTC offer
    socket.on('video_offer', (data) => {
      const { roomId, offer, from } = data;
      socket.to(roomId).emit('video_offer', { offer, from });
    });

    // WebRTC answer
    socket.on('video_answer', (data) => {
      const { roomId, answer, from } = data;
      socket.to(roomId).emit('video_answer', { answer, from });
    });

    // ICE candidate
    socket.on('ice_candidate', (data) => {
      const { roomId, candidate, from } = data;
      socket.to(roomId).emit('ice_candidate', { candidate, from });
    });

    // End video call
    socket.on('video_call_end', (data) => {
      const { roomId, from } = data;
      socket.to(roomId).emit('video_call_ended', { from });
      console.log(`Video call ended in room ${roomId}`);
    });

    // ============ Group Chat ============

    // Join group rooms
    socket.on('join_group', (groupId) => {
      socket.join(`group_${groupId}`);
    });

    socket.on('leave_group', (groupId) => {
      socket.leave(`group_${groupId}`);
    });

    // Group message
    socket.on('group_message', async (data) => {
      const { groupId, message, from, fromNickname } = data;
      const payload = typeof message === 'string' ? { text: message } : (message || {});
      const timestamp = new Date();

      try {
        await Message.create({
          chat: groupId,
          sender: from,
          text: payload.text || '',
          image: payload.mediaUrl || null
        });
      } catch (error) {
        console.error('Error persisting group message:', error);
      }

      socket.to(`group_${groupId}`).emit('group_message_received', {
        groupId,
        from,
        fromNickname,
        message: payload,
        timestamp
      });
    });

    // Group typing
    socket.on('group_typing', (data) => {
      const { groupId, from, fromNickname } = data;
      socket.to(`group_${groupId}`).emit('group_user_typing', { from, fromNickname });
    });

    socket.on('group_stop_typing', (data) => {
      const { groupId, from } = data;
      socket.to(`group_${groupId}`).emit('group_user_stop_typing', { from });
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      if (socket.userId) {
        // Update lastSeen
        try {
          await User.findByIdAndUpdate(socket.userId, { lastSeen: new Date() });
        } catch (err) {
          console.error('Error updating lastSeen:', err);
        }

        // Remove from waiting queues
        removeFromQueues(socket.userId);
        
        // End any active matches
        for (const [roomId, match] of activeMatches.entries()) {
          if (match.aId === socket.userId || match.bId === socket.userId) {
            const partnerId = match.aId === socket.userId ? match.bId : match.aId;
            const partnerData = onlineUsers.get(partnerId);
            if (partnerData) {
              io.to(partnerData.socketId).emit('match_ended', {
                message: 'Your partner has disconnected'
              });
            }
            activeMatches.delete(roomId);
          }
        }
        
        onlineUsers.delete(socket.userId);
        broadcastOnlineUsers(io);
      }
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = setupSocket;
