import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { getUsers } from '../api';
import { triggerAdOnInteraction } from '../utils/adUtils';
import AdBanner from '../components/AdBanner';
import ProfilePromptModal from '../components/ProfilePromptModal';

const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const { user } = useAuth();
  const { setSelectedUser, onlineUsers } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [filter, user]); // eslint-disable-line

  useEffect(() => {
    if (users.length > 0) {
      setUsers(prev => prev.map(u => ({
        ...u,
        isOnline: onlineUsers.some(ou => ou._id === u._id)
      })));
    }
  }, [onlineUsers]); // eslint-disable-line

  const fetchUsers = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUsers(filter, user._id);
      const usersWithOnlineStatus = data.map(u => ({
        ...u,
        isOnline: onlineUsers.some(ou => ou._id === u._id)
      }));
      setUsers(usersWithOnlineStatus);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChat = (chatTarget) => {
    if (!user?.isFullAccount) {
      setShowProfilePrompt(true);
      return;
    }
    triggerAdOnInteraction();
    setSelectedUser({
      _id: chatTarget._id,
      nickname: chatTarget.nickname,
      gender: chatTarget.gender
    });
    navigate('/chat');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200/50">
      <div className="max-w-5xl mx-auto space-y-5 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-extrabold">Find Users</h1>
          {user?.isFullAccount ? (
            <div className="join">
              <button
                className={`join-item btn btn-sm ${filter === null ? 'btn-primary' : 'btn-ghost border border-base-300'}`}
                onClick={() => setFilter(null)}
              >
                All
              </button>
              <button
                className={`join-item btn btn-sm ${filter === 'Male' ? 'btn-primary' : 'btn-ghost border border-base-300'}`}
                onClick={() => setFilter('Male')}
              >
                👨 Males
              </button>
              <button
                className={`join-item btn btn-sm ${filter === 'Female' ? 'btn-secondary' : 'btn-ghost border border-base-300'}`}
                onClick={() => setFilter('Female')}
              >
                👩 Females
              </button>
            </div>
          ) : (
            <div className="badge badge-warning badge-outline gap-1">🔒 Create profile to filter &amp; DM</div>
          )}
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-base-content/50">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-semibold">No users found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(u => (
              <div key={u._id} className="card bg-base-100 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                <div className="card-body flex-row items-center gap-4 p-4">
                  <Link to={`/user/${u._id}`} className="avatar placeholder cursor-pointer">
                    {u.profilePicture ? (
                      <div className="w-12 rounded-full">
                        <img src={u.profilePicture} alt={u.nickname} />
                      </div>
                    ) : (
                      <div className={`w-12 rounded-full ${u.gender === 'Male' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                        <span className="text-lg font-bold">{u.nickname?.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    {u.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-base-100" />
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/user/${u._id}`} className="font-bold text-sm truncate hover:text-primary transition-colors">{u.nickname}</Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`badge badge-sm ${u.gender === 'Male' ? 'badge-primary' : 'badge-secondary'} badge-outline whitespace-nowrap`}>
                        {u.gender === 'Male' ? '👨' : '👩'} {u.gender}
                      </span>
                      <span className={`text-xs font-medium ${u.isOnline ? 'text-success' : 'text-base-content/40'}`}>
                        {u.isOnline ? '● Online' : '○ Offline'}
                      </span>
                    </div>
                  </div>
                  {user?.isFullAccount && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleChat(u)}
                    >
                      💬 Chat
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ad Banner */}
        <AdBanner slot="users-list-bottom" format="horizontal" className="mt-2 rounded-xl" />
      </div>

      <ProfilePromptModal show={showProfilePrompt} onClose={() => setShowProfilePrompt(false)} />
    </div>
  );
};

export default UsersListPage;
