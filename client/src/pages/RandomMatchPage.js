import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { getSocket } from '../socket';
import { showPopunder } from '../utils/adUtils';
import { isChatSoundEnabled, playNotificationSound } from '../utils/soundUtils';
import { showMatchNotification } from '../utils/notificationUtils';
import { useVideoCall } from '../context/VideoCallContext';
import AdBanner from '../components/AdBanner';
import { uploadMedia } from '../api';

const RandomMatchPage = () => {
  const { user } = useAuth();
  const { setActiveMatchChat } = useChat();
  const location = useLocation();
  const navigate = useNavigate();
  const { openCall, closeCall, startCall, isActiveForRoom } = useVideoCall();
  const [status, setStatus] = useState('idle');
  const [partner, setPartner] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);
  const fileInputRef = useRef(null);
  const roomIdRef = useRef(null);

  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  useEffect(() => {
    const videoCall = location.state?.videoCall;
    if (!videoCall?.roomId || status !== 'matched' || roomId !== videoCall.roomId || !partner) return;
    openCall(partner, roomId, videoCall.accept ? videoCall : null);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.state, status, roomId, partner, navigate, location.pathname, openCall]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('searching', (data) => {
      setStatus('searching');
      console.log(data.message);
    });

    socket.on('match_found', (data) => {
      setStatus('matched');
      setPartner(data.partner);
      setRoomId(data.roomId);
      setMessages([]);
      setInputMessage('');
      setShowEmojiPicker(false);
      closeCall();
      setActiveMatchChat({
        partnerId: data.partner._id,
        nickname: data.partner.nickname,
        gender: data.partner.gender,
        lastMessage: 'Matched! Start chatting...'
      });
      if (isChatSoundEnabled()) playNotificationSound();
      showMatchNotification(data.partner.nickname);
    });

    socket.on('match_message_received', (data) => {
      const payload = typeof data.message === 'string' ? { text: data.message } : (data.message || {});
      
      if (isChatSoundEnabled()) playNotificationSound();
      
      const newMessage = {
        msgId: data.msgId,
        from: data.from,
        fromNickname: data.fromNickname,
        text: payload.text || '',
        mediaUrl: payload.mediaUrl || null,
        mediaType: payload.mediaType || null,
        timestamp: data.timestamp,
        isMine: false,
        status: 'delivered'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setActiveMatchChat(prev => prev ? {
        ...prev,
        lastMessage: payload.text || (payload.mediaUrl ? '📎 Media' : 'New message')
      } : prev);

      // Tell partner their message was read (read receipt for sender)
      const activeRoom = data.roomId || roomIdRef.current;
      if (activeRoom && data.msgId) {
        setTimeout(() => {
          socket.emit('match_messages_seen', {
            roomId: activeRoom,
            msgId: data.msgId,
            by: user?._id
          });
        }, 200);
      }
    });

    socket.on('match_message_status', ({ tempId, msgId, status }) => {
      setMessages(prev => prev.map(msg => {
        // Update by tempId first (for own messages that were sent)
        if (tempId && msg.tempId === tempId && !msg.msgId) {
          return { ...msg, msgId, status, tempId: undefined };
        }
        // Update by msgId if available
        if (msgId && msg.msgId === msgId) {
          // Ensure status only increases: sent -> delivered -> seen
          const statuses = ['sent', 'delivered', 'seen'];
          const currentIndex = statuses.indexOf(msg.status);
          const newIndex = statuses.indexOf(status);
          if (newIndex >= currentIndex) {
            return { ...msg, status };
          }
        }
        return msg;
      }));
    });

    socket.on('match_messages_seen_update', ({ msgId }) => {
      // Update only outgoing messages (isMine) to 'seen' status
      setMessages(prev => prev.map(msg => {
        if (msg.isMine && msg.msgId === msgId) {
          return { ...msg, status: 'seen' };
        }
        return msg;
      }));
    });

    socket.on('call_incoming', (data) => {
      if (data?.roomId && roomIdRef.current && data.roomId !== roomIdRef.current) return;
      if (partner) openCall(partner, roomIdRef.current);
    });

    socket.on('match_partner_typing', () => setIsPartnerTyping(true));
    socket.on('match_partner_stop_typing', () => setIsPartnerTyping(false));

    socket.on('match_ended', (data) => {
      setStatus('idle');
      setPartner(null);
      setRoomId(null);
      setMessages([]);
      setInputMessage('');
      setShowEmojiPicker(false);
      closeCall();
      setActiveMatchChat(null);
      alert(data.message);
    });

    socket.on('search_cancelled', () => setStatus('idle'));

    return () => {
      socket.off('searching');
      socket.off('match_found');
      socket.off('match_message_received');
      socket.off('match_message_status');
      socket.off('match_messages_seen_update');
      socket.off('call_incoming');
      socket.off('match_partner_typing');
      socket.off('match_partner_stop_typing');
      socket.off('match_ended');
      socket.off('search_cancelled');
    };
  }, [roomId, setActiveMatchChat, user?._id, partner, openCall, closeCall]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const findMatch = () => {
    const socket = getSocket();
    if (socket && user) {
      showPopunder();
      socket.emit('find_match', {
        userId: user._id,
        gender: user.gender,
        nickname: user.nickname
      });
      setStatus('searching');
    }
  };

  const cancelSearch = () => {
    const socket = getSocket();
    if (socket && user) {
      socket.emit('cancel_search', user._id);
      setStatus('idle');
    }
  };

  const endMatch = () => {
    const socket = getSocket();
    if (socket && roomId) {
      if (isActiveForRoom(roomId)) {
        closeCall();
      }
      socket.emit('end_match', { roomId, userId: user._id });
      setStatus('idle');
      setPartner(null);
      setRoomId(null);
      setMessages([]);
      setInputMessage('');
      setShowEmojiPicker(false);
      setActiveMatchChat(null);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !roomId || !user) return;
    const socket = getSocket();
    if (socket) {
      const tempId = `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const text = inputMessage.trim();
      
      const messageObj = {
        tempId,
        from: user._id,
        fromNickname: user.nickname,
        text,
        mediaUrl: null,
        mediaType: null,
        timestamp: new Date(),
        isMine: true,
        status: 'sent'
      };
      
      socket.emit('match_message', {
        roomId,
        tempId,
        message: { text },
        from: user._id,
        fromNickname: user.nickname
      });
      
      setMessages(prev => [...prev, messageObj]);
      setActiveMatchChat(prev => prev ? { ...prev, lastMessage: text } : prev);
      setInputMessage('');
      setShowEmojiPicker(false);
      socket.emit('match_stop_typing', { roomId, from: user._id });
    }
  };

  const handleEmojiClick = (emojiData) => {
    setInputMessage(prev => prev + emojiData.emoji);
    const socket = getSocket();
    if (socket && roomId && user) {
      socket.emit('match_typing', { roomId, from: user._id });
    }
  };

  const handlePickFile = () => {
    if (isUploading || !roomId) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !roomId || !user) return;

    const socket = getSocket();
    if (!socket) return;

    setIsUploading(true);
    try {
      const response = await uploadMedia(file);
      const tempId = `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const payload = {
        text: '',
        mediaUrl: response.url,
        mediaType: file.type
      };

      socket.emit('match_message', {
        roomId,
        tempId,
        message: payload,
        from: user._id,
        fromNickname: user.nickname
      });

      const messageObj = {
        tempId,
        from: user._id,
        fromNickname: user.nickname,
        text: '',
        mediaUrl: response.url,
        mediaType: file.type,
        timestamp: new Date(),
        isMine: true,
        status: 'sent'
      };

      setMessages(prev => [...prev, messageObj]);
      setActiveMatchChat(prev => prev ? { ...prev, lastMessage: '📎 Media' } : prev);
      socket.emit('match_stop_typing', { roomId, from: user._id });
    } catch (error) {
      console.error('Random match upload error:', error);
      alert(`Upload failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsUploading(false);
      // Safely reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const renderMessageContent = (msg) => {
    if (msg.mediaUrl) {
      const mediaType = msg.mediaType || '';
      if (mediaType.startsWith('image/')) {
        return (
          <div className="max-w-xs">
            <img src={msg.mediaUrl} alt="Shared media" className="rounded-lg max-w-full" />
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

    return msg.text;
  };

  const handleTyping = (e) => {
    setInputMessage(e.target.value);
    const socket = getSocket();
    if (socket && roomId) {
      socket.emit('match_typing', { roomId, from: user._id });
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        socket.emit('match_stop_typing', { roomId, from: user._id });
      }, 1000);
    }
  };

  // Idle state
  if (status === 'idle') {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-base-200/50">
        <div className="flex items-center justify-center p-4 min-h-[calc(100vh-64px)]">
          <div className="card w-full max-w-md bg-base-100 shadow-xl animate-scale-in">
            <div className="card-body items-center text-center gap-5">
              <h1 className="text-3xl font-extrabold">🎲 Random Match</h1>
              <p className="text-base-content/60">
                Get paired with a random user for a chat!
              </p>
              <div className="flex items-center gap-3 bg-base-200 rounded-xl p-3 w-full justify-center">
                <div className="avatar placeholder">
                  <div className={`w-12 rounded-full ${user?.gender === 'Male' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                    <span className="text-lg font-bold">{user?.nickname?.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
                <span className="font-semibold">{user?.nickname}</span>
                <span className={`badge ${user?.gender === 'Male' ? 'badge-primary' : 'badge-secondary'} badge-outline badge-sm`}>
                  {user?.gender === 'Male' ? '👨' : '👩'} {user?.gender}
                </span>
              </div>
              <button className="btn btn-primary btn-lg w-full gap-2" onClick={findMatch}>
                🔍 Find Match
              </button>
              <AdBanner slot="random-match-inline" format="auto" className="mt-2 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Searching state
  if (status === 'searching') {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-base-200/50 p-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body items-center text-center gap-6">
            <div className="relative">
              <span className="loading loading-ring loading-lg text-primary w-24 h-24"></span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="avatar placeholder">
                  <div className={`w-12 rounded-full ${user?.gender === 'Male' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                    <span className="font-bold">{user?.nickname?.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-xl font-bold">Looking for a match...</h2>
            <p className="text-base-content/60">
              Please wait while we find you a random partner
            </p>
            <button className="btn btn-ghost btn-sm" onClick={cancelSearch}>
              ✕ Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Matched state
  return (
  
  
  <div className="flex flex-col h-[calc(100vh-64px)] bg-base-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-base-300 bg-base-100">
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className={`w-10 rounded-full ${partner?.gender === 'Male' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
              <span className="font-bold">{partner?.nickname?.charAt(0).toUpperCase()}</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm">{partner?.nickname}</h3>
            <span className={`badge badge-xs ${partner?.gender === 'Male' ? 'badge-primary' : 'badge-secondary'} badge-outline`}>
              {partner?.gender === 'Male' ? '👨' : '👩'} {partner?.gender}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className={`btn btn-sm ${isActiveForRoom(roomId) ? 'btn-error' : 'btn-primary'} gap-1`}
            onClick={() => {
              if (!partner || !roomId) return;
              if (isActiveForRoom(roomId)) closeCall();
              else startCall(partner, roomId);
            }}
          >
            📹 {isActiveForRoom(roomId) ? 'End video' : 'Video'}
          </button>
          <button className="btn btn-sm btn-error btn-outline" onClick={endMatch}>
            End Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-base-200/30">
        <div className="alert alert-info text-sm justify-center mb-4">
          🎉 You've been matched with {partner?.nickname}!
        </div>
        {messages.map((msg, index) => (
          <div key={msg.msgId || msg.tempId || `msg-${index}`} className={`chat ${msg.isMine ? 'chat-end' : 'chat-start'}`}>
            <div className={`chat-bubble ${msg.isMine ? 'chat-bubble-primary' : ''} text-sm`}>
              {renderMessageContent(msg)}
            </div>
            <div className="chat-footer opacity-50 text-xs flex items-center justify-end gap-1.5 mt-0.5 min-h-[1rem]">
              <span className="shrink-0">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {msg.isMine && msg.status && (
                <span className="shrink-0 leading-none" title={msg.status}>
                  {msg.status === 'seen' ? (
                    <span className="text-info font-bold">✓✓</span>
                  ) : msg.status === 'delivered' ? (
                    <span className="text-base-content/60">✓✓</span>
                  ) : (
                    <span className="text-base-content/40">✓</span>
                  )}
                </span>
              )}
            </div>
          </div>
        ))}
        {isPartnerTyping && (
          <div className="chat chat-start">
            <div className="chat-bubble chat-bubble-ghost text-xs opacity-70">
              <span className="loading loading-dots loading-xs"></span> {partner?.nickname} is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="relative">
        {showEmojiPicker && (
          <div className="absolute bottom-full left-0 z-50 mb-2">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      <form onSubmit={sendMessage} className="flex items-center gap-2 p-3 border-t border-base-300 bg-base-100">
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-circle text-lg"
          onClick={() => setShowEmojiPicker(prev => !prev)}
          title="Add emoji"
          disabled={isUploading}
        >
          😊
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-circle text-lg"
          onClick={handlePickFile}
          title="Upload image or video"
          disabled={isUploading}
        >
          📎
        </button>
        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          accept="*/*"
          onChange={handleFileChange}
        />
        <input
          type="text"
          value={inputMessage}
          onChange={handleTyping}
          placeholder={isUploading ? 'Uploading...' : 'Type a message...'}
          disabled={isUploading}
          className="input input-bordered input-sm flex-1 focus:outline-none focus:input-primary"
        />
        <button type="submit" disabled={!inputMessage.trim() || isUploading} className="btn btn-primary btn-sm">
          {isUploading ? <span className="loading loading-spinner loading-xs" /> : 'Send'}
        </button>
      </form>
      </div>
    </div>
  );
};

export default RandomMatchPage;
