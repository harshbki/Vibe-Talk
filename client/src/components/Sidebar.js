import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { getUserChats, getUserGroups } from '../api';
import UserList from './UserList';
import AdBanner from './AdBanner';

const Sidebar = () => {
  const { onlineUsers, messages, selectedUser, setSelectedUser, activeMatchChat } = useChat();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chats');
  const [recentChats, setRecentChats] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const otherUsers = onlineUsers.filter(u => u._id !== user?._id);
  const isProfileUser = !!user?.isFullAccount;

  useEffect(() => {
    const loadChats = async () => {
      if (!user?._id) return;
      setLoadingChats(true);
      try {
        const [groups] = await Promise.all([
          getUserGroups(user._id),
          // Only load DM chats for profile users
          ...(isProfileUser ? [getUserChats(user._id).then(c => setRecentChats(c || []))] : [])
        ]);
        setUserGroups(groups || []);
        if (!isProfileUser) setRecentChats([]);
      } catch (error) {
        console.error('Load chats error:', error);
      } finally {
        setLoadingChats(false);
      }
    };

    loadChats();
  }, [user?._id, isProfileUser]);

  // DM chat items — only for profile users
  const chatItems = useMemo(() => {
    if (!user?._id || !isProfileUser) return [];

    return recentChats
      .map((chat) => {
        const peer = (chat.participants || []).find((p) => (p._id || p) !== user._id);
        if (!peer) return null;

        const peerId = peer._id || peer;
        const isOnline = onlineUsers.some((u) => u._id === peerId);
        const unread = (messages[peerId] || []).filter((m) => m.received && m.unread).length;

        return {
          _id: chat._id,
          type: 'dm',
          peerId,
          nickname: peer.nickname || 'User',
          gender: peer.gender || '',
          isOnline,
          unread,
          lastMessage: chat.lastMessage?.text || 'No messages yet',
          timestamp: chat.lastMessage?.timestamp || chat.createdAt
        };
      })
      .filter(Boolean);
  }, [recentChats, user?._id, isProfileUser, onlineUsers, messages]);

  const totalCount = chatItems.length + userGroups.length + (activeMatchChat ? 1 : 0);

  const formatTime = (value) => {
    if (!value) return '';
    const d = new Date(value);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-72 min-w-[280px] border-r border-base-300 bg-base-100 flex flex-col h-full">
      <div className="p-3 border-b border-base-300 space-y-2">
        <div className="join w-full">
          <button
            className={`join-item btn btn-xs flex-1 ${activeTab === 'chats' ? 'btn-primary' : 'btn-ghost border border-base-300'}`}
            onClick={() => setActiveTab('chats')}
          >
            Chats
          </button>
          <button
            className={`join-item btn btn-xs flex-1 ${activeTab === 'online' ? 'btn-primary' : 'btn-ghost border border-base-300'}`}
            onClick={() => setActiveTab('online')}
          >
            Online
          </button>
        </div>

        {activeTab === 'chats' ? (
          <h3 className="font-bold text-sm flex items-center gap-2">
            <span className="badge badge-primary badge-sm">{totalCount}</span>
            All Chats
          </h3>
        ) : (
          <h3 className="font-bold text-sm flex items-center gap-2">
            <span className="badge badge-primary badge-sm">{otherUsers.length}</span>
            Online Users
          </h3>
        )}
      </div>

      <div className="overflow-y-auto flex-1">
        {activeTab === 'online' ? (
          <UserList users={otherUsers} />
        ) : loadingChats ? (
          <div className="p-4 flex justify-center">
            <span className="loading loading-spinner loading-sm text-primary" />
          </div>
        ) : totalCount === 0 ? (
          <div className="p-4 text-sm text-base-content/50 text-center">No chats yet</div>
        ) : (
          <ul className="menu p-2 gap-1">
            {/* Active Random Match Chat — temporary, disappears on end */}
            {activeMatchChat && (
              <li>
                <button
                  className="flex items-start gap-2 rounded-lg p-2 w-full bg-accent/10 border border-accent/20"
                  onClick={() => navigate('/match')}
                >
                  <div className="avatar placeholder mt-0.5">
                    <div className={`w-9 rounded-full ${activeMatchChat.gender === 'Male' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                      <span className="text-xs font-bold">🎲</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs truncate">{activeMatchChat.nickname}</span>
                      <span className="badge badge-accent badge-xs">Live</span>
                    </div>
                    <p className="text-[11px] opacity-60 truncate mt-0.5">{activeMatchChat.lastMessage || 'Random match active...'}</p>
                  </div>
                </button>
              </li>
            )}

            {/* Group Chats — visible to ALL users */}
            {userGroups.map((g) => (
              <li key={g._id}>
                <button
                  className="flex items-start gap-2 rounded-lg p-2 w-full hover:bg-base-200"
                  onClick={() => navigate(`/group/${g._id}`)}
                >
                  <div className="avatar placeholder mt-0.5">
                    <div className="w-9 rounded-full bg-warning/20 text-warning">
                      <span className="text-xs font-bold">👥</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs truncate">{g.name}</span>
                      {g.isPrivate && <span className="text-[10px]">🔒</span>}
                    </div>
                    <span className="text-[10px] opacity-50">{g.members?.length || 0} members</span>
                  </div>
                </button>
              </li>
            ))}

            {/* DM Chats — only for profile users */}
            {chatItems.map((item) => (
              <li key={item._id}>
                <button
                  className={`flex items-start gap-2 rounded-lg p-2 w-full ${
                    selectedUser?._id === item.peerId ? 'bg-primary/10 text-primary' : 'hover:bg-base-200'
                  }`}
                  onClick={() => setSelectedUser({ _id: item.peerId, nickname: item.nickname, gender: item.gender })}
                >
                  <div className="avatar placeholder mt-0.5">
                    <div className={`w-9 rounded-full ${item.gender === 'Male' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                      <span className="text-xs font-bold">{item.nickname.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs truncate">{item.nickname}</span>
                      <span className="text-[10px] opacity-50">{formatTime(item.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`text-[10px] ${item.isOnline ? 'text-success' : 'opacity-40'}`}>
                        {item.isOnline ? '● Online' : '○ Offline'}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-60 truncate mt-0.5">{item.lastMessage}</p>
                  </div>

                  {item.unread > 0 && <span className="badge badge-primary badge-xs mt-0.5">{item.unread}</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat sidebar ad placement */}
      <div className="p-2 border-t border-base-300">
        <AdBanner slot="chat-sidebar" format="auto" className="rounded-lg" />
      </div>
    </div>
  );
};

export default Sidebar;
