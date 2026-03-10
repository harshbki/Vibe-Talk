import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../api';
import MessageInput from './MessageInput';
import VideoCall from './VideoCall';

const ChatWindow = () => {
  const { selectedUser, messages, typing, markAsRead, sendSeen, deleteMessage } = useChat();
  const { user } = useAuth();
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [profile, setProfile] = useState(null);

  const chatMessages = selectedUser ? messages[selectedUser._id] || [] : [];
  const isTyping = selectedUser && typing[selectedUser._id];
  const messagesEndRef = useRef(null);

  const roomId = useMemo(() => {
    if (!selectedUser || !user) return null;
    const ids = [user._id, selectedUser._id].sort();
    return `private_${ids[0]}_${ids[1]}`;
  }, [selectedUser, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (!selectedUser) {
      setProfile(null);
      return;
    }
    const fetchProfile = async () => {
      try {
        const data = await getProfile(selectedUser._id);
        setProfile(data);
      } catch (err) {
        console.error('Fetch DM profile error:', err);
        setProfile(null);
      }
    };
    fetchProfile();
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      markAsRead(selectedUser._id);
      // Notify server that we've seen their messages
      if (user) {
        sendSeen(selectedUser._id, user._id);
      }
    }
  }, [selectedUser, chatMessages, markAsRead, sendSeen, user]);

  const renderMessageContent = (msg) => {
    if (msg.mediaUrl) {
      const isVideo = (msg.mediaType || '').startsWith('video/');
      return (
        <div className="max-w-xs">
          {isVideo ? (
            <video controls src={msg.mediaUrl} className="rounded-lg max-w-full" />
          ) : (
            <img src={msg.mediaUrl} alt="Upload" className="rounded-lg max-w-full" />
          )}
        </div>
      );
    }
    return <p>{msg.text}</p>;
  };

  const renderStatusIcon = (msg) => {
    if (msg.received) return null; // Only show for own messages
    const status = msg.status || 'sent';
    if (status === 'seen') return <span className="text-info ml-1" title="Seen">✓✓</span>;
    if (status === 'delivered') return <span className="opacity-60 ml-1" title="Delivered">✓✓</span>;
    return <span className="opacity-40 ml-1" title="Sent">✓</span>;
  };

  const handleDeleteMessage = (msg) => {
    if (!msg.msgId || !selectedUser) return;
    deleteMessage(msg.msgId, selectedUser._id, user._id);
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-base-200/50 to-base-200/30">
        <div className="text-center space-y-4 animate-fade-in-up p-8">
          <div className="text-7xl opacity-80">💬</div>
          <h3 className="text-xl font-bold">Start a conversation</h3>
          <p className="text-base-content/50 text-sm max-w-xs mx-auto">Pick someone from the online users list, or head to <a href="/users" className="text-primary font-medium">Users</a> to find people.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-base-100 h-full">
      {/* Header — WhatsApp-style profile */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-base-300 bg-base-100">
        <a href={`/user/${selectedUser._id}`} className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity">
          {/* Avatar */}
          {profile?.profilePicture ? (
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img src={profile.profilePicture} alt={selectedUser.nickname} />
              </div>
            </div>
          ) : (
            <div className="avatar placeholder">
              <div className={`w-10 rounded-full ${selectedUser.gender === 'Male' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                <span className="font-bold">{selectedUser.nickname.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm truncate">{selectedUser.nickname}</span>
              <span className={`badge badge-xs ${selectedUser.gender === 'Male' ? 'badge-primary' : 'badge-secondary'} badge-outline`}>
                {selectedUser.gender}
              </span>
            </div>
            {profile?.fullName && (
              <p className="text-xs text-base-content/50 truncate">{profile.fullName}</p>
            )}
            {profile?.bio && (
              <p className="text-xs text-base-content/40 truncate max-w-[200px]">{profile.bio}</p>
            )}
          </div>
        </a>
        <button
          className={`btn btn-sm ${showVideoCall ? 'btn-error' : 'btn-primary'} gap-1`}
          onClick={() => setShowVideoCall(!showVideoCall)}
        >
          📹 {showVideoCall ? 'Hide' : 'Video'}
        </button>
      </div>

      {/* Video Call */}
      {showVideoCall && (
        <div className="border-b border-base-300">
          <VideoCall
            partner={selectedUser}
            roomId={roomId}
            onEndCall={() => setShowVideoCall(false)}
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-base-200/30">
        {chatMessages.map((msg, index) => {
          const isMine = msg.from === user._id;
          return (
            <div key={index} className={`chat group ${isMine ? 'chat-end' : 'chat-start'}`}>
              <div className={`chat-bubble ${isMine ? 'chat-bubble-primary' : 'chat-bubble'} text-sm`}>
                {msg.isDeleted ? (
                  <span className="italic opacity-60">🚫 This message was deleted</span>
                ) : (
                  <div className="flex items-start gap-1">
                    {renderMessageContent(msg)}
                    {isMine && msg.msgId && (
                      <button
                        className="btn btn-ghost btn-xs opacity-60 group-hover:opacity-100 hover:text-error ml-1 -mr-1"
                        title="Delete message"
                        onClick={() => {
                          if (window.confirm('Delete this message?')) {
                            handleDeleteMessage(msg);
                          }
                        }}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="chat-footer opacity-50 text-xs flex items-center">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {renderStatusIcon(msg)}
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="chat chat-start">
            <div className="chat-bubble chat-bubble-ghost text-xs opacity-70">
              <span className="loading loading-dots loading-xs"></span> {selectedUser.nickname} is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatWindow;
