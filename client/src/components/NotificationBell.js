import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteAllNotifications,
  getUser
} from '../api';
import { getSocket } from '../socket';
import { showMessageNotification, showCallNotification } from '../utils/notificationUtils';

const NotificationBell = () => {
  const { user } = useAuth();
  const { setSelectedUser } = useChat();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getNotifications(user._id);
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (err) {
      console.error('Fetch notifications error:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Poll so "new" notifications appear even if server doesn't emit
  // a real-time `new_notification` socket event for every action.
  useEffect(() => {
    if (!user?._id) return;
    const id = setInterval(() => {
      fetchNotifications();
    }, 30000);
    return () => clearInterval(id);
  }, [fetchNotifications, user?._id]);

  // Listen for real-time notifications
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewNotification = (notif) => {
      setNotifications(prev => [notif, ...prev].slice(0, 50));
      setUnreadCount(prev => prev + 1);
      if (notif.type === 'call') {
        showCallNotification(notif.body?.replace(' is calling you', '') || 'Someone');
      } else if (notif.type === 'message') {
        showMessageNotification(notif.title || 'New message', notif.body || '', `notif-${notif._id}`);
      } else if (notif.type === 'match') {
        showMessageNotification(notif.title || 'Match', notif.body || '', 'match-notif');
      }
    };

    socket.on('new_notification', handleNewNotification);
    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    try {
      await markAllNotificationsRead(user._id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Mark all read error:', err);
    }
  };

  const handleDeleteOne = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => {
        const toDelete = prev.find(n => n._id === id);
        if (toDelete && !toDelete.read) {
          setUnreadCount(count => Math.max(0, count - 1));
        }
        return prev.filter(n => n._id !== id);
      });
    } catch (err) {
      console.error('Delete notification error:', err);
    }
  };

  const handleDeleteAll = async () => {
    if (!user) return;
    try {
      await deleteAllNotifications(user._id);
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Delete all notifications error:', err);
    }
  };

  const resolveSenderForChat = async (userId, notif) => {
    try {
      const sender = await getUser(userId);
      return {
        _id: userId,
        nickname: sender.nickname,
        gender: sender.gender
      };
    } catch {
      const fallbackName = notif.body?.split(':')[0]?.trim()
        || notif.body?.replace(' is calling you', '')?.trim()
        || 'User';
      return { _id: userId, nickname: fallbackName, gender: 'Male' };
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      await handleMarkRead(notif._id);
    }
    setOpen(false);

    const data = notif.data || {};

    if (notif.type === 'message' && data.from) {
      const sender = await resolveSenderForChat(data.from, notif);
      setSelectedUser(sender);
      navigate('/chat');
      return;
    }

    if (notif.type === 'call' && data.roomId) {
      if (String(data.roomId).startsWith('room_')) {
        navigate('/match', {
          state: {
            videoCall: {
              roomId: data.roomId,
              from: data.from,
              accept: true
            }
          }
        });
        return;
      }
      if (data.from) {
        const sender = await resolveSenderForChat(data.from, notif);
        setSelectedUser(sender);
        navigate('/chat', {
          state: {
            openVideoCall: true,
            videoCall: {
              roomId: data.roomId,
              from: data.from,
              accept: true
            }
          }
        });
      }
      return;
    }

    if (notif.type === 'match') {
      navigate('/match');
    }
  };

  const getActionHint = (type) => {
    switch (type) {
      case 'message': return 'Open chat';
      case 'call': return 'Answer call';
      case 'match': return 'Go to match';
      default: return null;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'message': return '💬';
      case 'match': return '🎉';
      case 'group_join': return '👥';
      case 'group_leave': return '🚪';
      case 'call': return '📹';
      default: return '🔔';
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="btn btn-ghost btn-sm btn-square relative"
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="badge badge-primary badge-xs absolute -top-1 -right-1 text-[10px] min-w-[18px] h-[18px]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-base-100 border border-base-300 rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-base-200">
            <h3 className="font-bold text-sm">Notifications</h3>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-xs text-primary hover:underline">
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={handleDeleteAll} className="text-xs text-error hover:underline">
                  Delete all
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-base-content/50 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 20).map(notif => {
                const actionHint = getActionHint(notif.type);
                const isActionable = ['message', 'call', 'match'].includes(notif.type);
                return (
                <div
                  key={notif._id}
                  role={isActionable ? 'button' : undefined}
                  tabIndex={isActionable ? 0 : undefined}
                  onClick={() => isActionable ? handleNotificationClick(notif) : handleMarkRead(notif._id)}
                  onKeyDown={(e) => {
                    if (isActionable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleNotificationClick(notif);
                    }
                  }}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-base-200/50 transition-colors border-b border-base-200/50 ${
                    isActionable ? 'cursor-pointer' : 'cursor-default'
                  } ${!notif.read ? 'bg-primary/5' : ''}`}
                >
                  <span className="text-lg mt-0.5">{getIcon(notif.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${!notif.read ? 'font-semibold' : ''}`}>{notif.title}</p>
                    <p className="text-xs text-base-content/50 truncate">{notif.body}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-base-content/40">{formatTime(notif.createdAt)}</p>
                      {actionHint && (
                        <span className="text-xs text-primary font-medium">{actionHint} →</span>
                      )}
                    </div>
                  </div>
                  <button
                    className="btn btn-ghost btn-xs text-error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteOne(notif._id);
                    }}
                    title="Delete notification"
                  >
                    ✕
                  </button>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  )}
                </div>
              );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
