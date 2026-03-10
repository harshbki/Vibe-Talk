import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../api';
import { getSocket } from '../socket';

const NotificationBell = () => {
  const { user } = useAuth();
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

  // Listen for real-time notifications
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewNotification = (notif) => {
      setNotifications(prev => [notif, ...prev].slice(0, 50));
      setUnreadCount(prev => prev + 1);
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
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs text-primary hover:underline">
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-base-content/50 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 20).map(notif => (
                <button
                  key={notif._id}
                  onClick={() => handleMarkRead(notif._id)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-base-200/50 transition-colors border-b border-base-200/50 ${
                    !notif.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <span className="text-lg mt-0.5">{getIcon(notif.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${!notif.read ? 'font-semibold' : ''}`}>{notif.title}</p>
                    <p className="text-xs text-base-content/50 truncate">{notif.body}</p>
                    <p className="text-xs text-base-content/40 mt-0.5">{formatTime(notif.createdAt)}</p>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
