import { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../api';
import { getSocket } from '../socket';
import MessageInput from './MessageInput';
import VideoCall from './VideoCall';

const ChatWindow = () => {
  const { selectedUser, messages, typing, markAsRead, sendSeen, deleteMessage } = useChat();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [pendingVideoCall, setPendingVideoCall] = useState(null);
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
    if (location.state?.openVideoCall) {
      setShowVideoCall(true);
    }
    const videoCall = location.state?.videoCall;
    if (videoCall?.accept && selectedUser && roomId && videoCall.roomId === roomId) {
      setShowVideoCall(true);
      setPendingVideoCall(videoCall);
    }
    if (location.state?.openVideoCall || location.state?.videoCall) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, selectedUser, roomId, navigate, location.pathname]);

  useEffect(() => {
    if (selectedUser) {
      markAsRead(selectedUser._id);
      if (user) {
        sendSeen(selectedUser._id, user._id);
      }
      const socket = getSocket();
      if (socket && roomId) {
        socket.emit('join_private_room', { roomId });
      }
    }
  }, [selectedUser, markAsRead, sendSeen, user, roomId]);

  // Read receipts: mark partner messages seen when they arrive while chat is open
  useEffect(() => {
    if (!selectedUser || !user) return;
    const msgs = messages[selectedUser._id] || [];
    const hasUnread = msgs.some((m) => m.received && m.unread);
    if (!hasUnread) return;
    markAsRead(selectedUser._id);
    sendSeen(selectedUser._id, user._id);
  }, [messages, selectedUser, user, markAsRead, sendSeen]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !roomId) return;

    const handleIncomingCall = (data) => {
      if (data?.roomId === roomId) {
        setShowVideoCall(true);
      }
    };

    const handleCallEnded = (data) => {
      if (data?.roomId === roomId) {
        setShowVideoCall(false);
      }
    };

    const handleCallRejected = (data) => {
      if (data?.roomId === roomId) {
        setShowVideoCall(false);
      }
    };

    socket.on('call_incoming', handleIncomingCall);
    socket.on('video_call_ended', handleCallEnded);
    socket.on('call_rejected', handleCallRejected);

    return () => {
      socket.off('call_incoming', handleIncomingCall);
      socket.off('video_call_ended', handleCallEnded);
      socket.off('call_rejected', handleCallRejected);
    };
  }, [roomId]);

  if (user && !user.isFullAccount && !selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-base-200/50 to-base-200/30">
        <div className="text-center space-y-3 p-8 max-w-sm">
          <div className="text-5xl">💬</div>
          <h3 className="text-xl font-bold">Guest Chat</h3>
          <p className="text-sm text-base-content/60">
            Select a conversation from the sidebar to reply when a profile user messages you.
            Complete your profile to start new direct chats.
          </p>
          <a href="/profile" className="btn btn-primary btn-sm">Complete Profile</a>
        </div>
      </div>
    );
  }

  const renderMessageContent = (msg) => {
    if (msg.mediaUrl) {
      const mediaType = msg.mediaType || '';
      if (mediaType.startsWith('image/')) {
        return (
          <div className="max-w-xs">
            <img src={msg.mediaUrl} alt="Upload" className="rounded-lg max-w-full" />
          </div>
        );
      }
      if (mediaType.startsWith('video/')) {
        return (
          <div className="max-w-xs">
            <video controls src={msg.mediaUrl} className="rounded-lg max-w-full" />
          </div>
        );
      }
      return (
        <a
          href={msg.mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="link link-hover text-sm underline"
        >
          📎 Download file
        </a>
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

      {/* Keep mounted so incoming calls are never missed. */}
      <div className={`border-b border-base-300 ${showVideoCall ? 'block' : 'hidden'}`}>
        <VideoCall
          partner={selectedUser}
          roomId={roomId}
          onEndCall={() => setShowVideoCall(false)}
          pendingIncomingCall={pendingVideoCall}
          onPendingIncomingConsumed={() => setPendingVideoCall(null)}
        />
      </div>

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
              <div className="chat-footer opacity-50 text-xs flex items-center justify-end gap-1.5 min-h-[1rem]">
                <span className="shrink-0">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {isMine && <span className="shrink-0 leading-none">{renderStatusIcon(msg)}</span>}
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
