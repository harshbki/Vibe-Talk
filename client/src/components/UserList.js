import React from 'react';
import { useChat } from '../context/ChatContext';

const UserList = ({ users }) => {
  const { selectedUser, setSelectedUser, messages } = useChat();

  const getUnreadCount = (userId) => {
    const userMessages = messages[userId] || [];
    return userMessages.filter(m => m.received && m.unread).length;
  };

  return (
    <ul className="menu p-2 gap-1">
      {users.length === 0 ? (
        <li className="text-center p-6 text-base-content/50 text-sm">No users online</li>
      ) : (
        users.map(user => {
          const unread = getUnreadCount(user._id);
          return (
            <li key={user._id}>
              <button
                className={`flex items-center gap-3 rounded-lg p-3 w-full ${
                  selectedUser?._id === user._id ? 'bg-primary/10 text-primary' : 'hover:bg-base-200'
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="avatar placeholder">
                  <div className={`w-10 rounded-full ${user.gender === 'Male' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                    <span className="text-sm font-bold">{user.nickname.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">{user.nickname}</div>
                  <div className="text-xs opacity-60">{user.gender === 'Male' ? '👨' : '👩'} {user.gender}</div>
                </div>
                {unread > 0 && (
                  <span className="badge badge-primary badge-sm">{unread}</span>
                )}
              </button>
            </li>
          );
        })
      )}
    </ul>
  );
};

export default UserList;
