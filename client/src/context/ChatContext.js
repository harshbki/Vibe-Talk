import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { getSocket } from '../socket';
import { initNotifications, showMessageNotification } from '../utils/notificationUtils';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [typing, setTyping] = useState({});
  const [messageStatuses, setMessageStatuses] = useState({}); // { [userId]: 'sent'|'delivered'|'seen' }
  const [activeMatchChat, setActiveMatchChat] = useState(null); // { partnerId, nickname, gender, lastMessage }
  const selectedUserRef = useRef(null);
  const onlineUsersRef = useRef([]);

  // Keep ref in sync with state
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    onlineUsersRef.current = onlineUsers;
  }, [onlineUsers]);

  // Request notification permission on mount
  useEffect(() => {
    initNotifications();
  }, []);

  useEffect(() => {
    let interval;
    
    const setupListeners = () => {
      const socket = getSocket();
      if (!socket) return false;

      socket.on('online_users', (users) => {
        setOnlineUsers(users);
      });

      socket.on('receive_message', (data) => {
        const { from, message, msgId, timestamp } = data;
        const payload = typeof message === 'string' ? { text: message } : (message || {});

        setMessages(prev => ({
          ...prev,
          [from]: [
            ...(prev[from] || []),
            {
              from,
              msgId,
              text: payload.text || '',
              mediaUrl: payload.mediaUrl || null,
              mediaType: payload.mediaType || null,
              timestamp,
              received: true,
              unread: true,
              status: 'delivered'
            }
          ]
        }));

        // Show browser notification if not currently chatting with sender
        const currentlyViewing = selectedUserRef.current?._id;
        if (from !== currentlyViewing || document.hidden) {
          const senderData = onlineUsersRef.current.find(u => u._id === from);
          const senderName = senderData?.nickname || 'Someone';
          const preview = payload.text || (payload.mediaUrl ? '📎 Media' : 'New message');
          showMessageNotification(senderName, preview, `msg-${from}`);
        }
      });

      // Message status updates (sent → delivered)
      socket.on('message_status_update', ({ msgId, to, status }) => {
        setMessageStatuses(prev => ({ ...prev, [to]: status }));
        // Update individual message status and bind server msgId to pending outgoing message
        setMessages(prev => {
          const userMsgs = prev[to];
          if (!userMsgs) return prev;

          let pendingLinked = false;
          return {
            ...prev,
            [to]: userMsgs.map(m => {
              if (m.msgId === msgId) {
                return { ...m, status };
              }

              // First pending outgoing message gets this msgId to support later delete/update flows.
              if (!pendingLinked && !m.received && !m.msgId) {
                pendingLinked = true;
                return { ...m, msgId, status };
              }

              if (!m.received && m.status !== 'seen') {
                return { ...m, status };
              }

              return m;
            })
          };
        });
      });

      // Messages seen by the other user
      socket.on('messages_seen_update', ({ by }) => {
        setMessageStatuses(prev => ({ ...prev, [by]: 'seen' }));
        setMessages(prev => {
          const userMsgs = prev[by];
          if (!userMsgs) return prev;
          return {
            ...prev,
            [by]: userMsgs.map(m => !m.received ? { ...m, status: 'seen' } : m)
          };
        });
      });

      // Message deleted by sender
      socket.on('message_deleted', ({ msgId, from }) => {
        setMessages(prev => {
          const updated = {};
          for (const [userId, msgs] of Object.entries(prev)) {
            updated[userId] = msgs.map(m =>
              m.msgId === msgId ? { ...m, isDeleted: true, text: '', mediaUrl: null, mediaType: null } : m
            );
          }
          return updated;
        });
      });

      socket.on('user_typing', ({ from }) => {
        setTyping(prev => ({ ...prev, [from]: true }));
      });

      socket.on('user_stop_typing', ({ from }) => {
        setTyping(prev => ({ ...prev, [from]: false }));
      });

      return true;
    };

    // Try to setup immediately
    if (!setupListeners()) {
      // If socket not ready, poll every 500ms until it is
      interval = setInterval(() => {
        if (setupListeners()) {
          clearInterval(interval);
        }
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
      const socket = getSocket();
      if (socket) {
        socket.off('online_users');
        socket.off('receive_message');
        socket.off('message_status_update');
        socket.off('messages_seen_update');
        socket.off('message_deleted');
        socket.off('user_typing');
        socket.off('user_stop_typing');
      }
    };
  }, []);

  const sendMessage = (to, message, fromUserId) => {
    const socket = getSocket();
    if (socket) {
      const payload = typeof message === 'string' ? { text: message } : message;

      socket.emit('send_message', { to, message: payload, from: fromUserId });
      setMessages(prev => ({
        ...prev,
        [to]: [
          ...(prev[to] || []),
          {
            from: fromUserId,
            text: payload.text || '',
            mediaUrl: payload.mediaUrl || null,
            mediaType: payload.mediaType || null,
            timestamp: new Date(),
            received: false,
            status: 'sent'
          }
        ]
      }));
    }
  };

  const sendTyping = (to, from) => {
    const socket = getSocket();
    if (socket) {
      socket.emit('typing', { to, from });
    }
  };

  const sendStopTyping = (to, from) => {
    const socket = getSocket();
    if (socket) {
      socket.emit('stop_typing', { to, from });
    }
  };

  // Mark all messages from a user as read and notify sender
  const markAsRead = useCallback((userId) => {
    setMessages(prev => {
      const userMsgs = prev[userId];
      if (!userMsgs) return prev;
      return {
        ...prev,
        [userId]: userMsgs.map(m => m.unread ? { ...m, unread: false } : m)
      };
    });
  }, []);

  // Send seen event to server
  const sendSeen = useCallback((fromUserId, myUserId) => {
    const socket = getSocket();
    if (socket) {
      socket.emit('messages_seen', { by: myUserId, from: fromUserId });
    }
  }, []);

  // Delete a message via socket
  const deleteMessage = useCallback((msgId, chatUserId, myUserId) => {
    const socket = getSocket();
    if (socket) {
      socket.emit('delete_message', { msgId, chatUserId, from: myUserId });
    }
  }, []);

  return (
    <ChatContext.Provider value={{
      onlineUsers,
      selectedUser,
      setSelectedUser,
      messages,
      typing,
      messageStatuses,
      activeMatchChat,
      setActiveMatchChat,
      sendMessage,
      sendTyping,
      sendStopTyping,
      markAsRead,
      sendSeen,
      deleteMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
