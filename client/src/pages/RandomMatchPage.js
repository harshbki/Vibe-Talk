import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { getSocket } from '../socket';
import { showPopunder } from '../utils/adUtils';
import VideoCall from '../components/VideoCall';
import AdBanner from '../components/AdBanner';

const RandomMatchPage = () => {
  const { user } = useAuth();
  const { setActiveMatchChat } = useChat();
  const [status, setStatus] = useState('idle');
  const [partner, setPartner] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

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
      setActiveMatchChat({
        partnerId: data.partner._id,
        nickname: data.partner.nickname,
        gender: data.partner.gender,
        lastMessage: 'Matched! Start chatting...'
      });
    });

    socket.on('match_message_received', (data) => {
      setMessages(prev => [...prev, {
        from: data.from,
        fromNickname: data.fromNickname,
        text: data.message,
        timestamp: data.timestamp,
        isMine: false
      }]);
      setActiveMatchChat(prev => prev ? { ...prev, lastMessage: data.message } : prev);
    });

    socket.on('match_partner_typing', () => setIsPartnerTyping(true));
    socket.on('match_partner_stop_typing', () => setIsPartnerTyping(false));

    socket.on('match_ended', (data) => {
      setStatus('idle');
      setPartner(null);
      setRoomId(null);
      setMessages([]);
      setActiveMatchChat(null);
      alert(data.message);
    });

    socket.on('search_cancelled', () => setStatus('idle'));

    return () => {
      socket.off('searching');
      socket.off('match_found');
      socket.off('match_message_received');
      socket.off('match_partner_typing');
      socket.off('match_partner_stop_typing');
      socket.off('match_ended');
      socket.off('search_cancelled');
    };
  }, []);

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
      socket.emit('end_match', { roomId, userId: user._id });
      setStatus('idle');
      setPartner(null);
      setRoomId(null);
      setMessages([]);
      setActiveMatchChat(null);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !roomId) return;
    const socket = getSocket();
    if (socket) {
      socket.emit('match_message', {
        roomId,
        message: inputMessage.trim(),
        from: user._id,
        fromNickname: user.nickname
      });
      setMessages(prev => [...prev, {
        from: user._id,
        fromNickname: user.nickname,
        text: inputMessage.trim(),
        timestamp: new Date(),
        isMine: true
      }]);
      setActiveMatchChat(prev => prev ? { ...prev, lastMessage: inputMessage.trim() } : prev);
      setInputMessage('');
      socket.emit('match_stop_typing', { roomId, from: user._id });
    }
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
              Please wait while we find you a {user?.gender === 'Male' ? 'female' : 'male'} partner
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
            className={`btn btn-sm ${showVideoCall ? 'btn-error' : 'btn-primary'} gap-1`}
            onClick={() => setShowVideoCall(!showVideoCall)}
          >
            📹 {showVideoCall ? 'Hide' : 'Video'}
          </button>
          <button className="btn btn-sm btn-error btn-outline" onClick={endMatch}>
            End Chat
          </button>
        </div>
      </div>

      {/* Video Call */}
      {showVideoCall && (
        <div className="border-b border-base-300">
          <VideoCall partner={partner} roomId={roomId} onEndCall={() => setShowVideoCall(false)} />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-base-200/30">
        <div className="alert alert-info text-sm justify-center mb-4">
          🎉 You've been matched with {partner?.nickname}!
        </div>
        {messages.map((msg, index) => (
          <div key={index} className={`chat ${msg.isMine ? 'chat-end' : 'chat-start'}`}>
            <div className={`chat-bubble ${msg.isMine ? 'chat-bubble-primary' : ''} text-sm`}>
              {msg.text}
            </div>
            <div className="chat-footer opacity-50 text-xs">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
      <form onSubmit={sendMessage} className="flex items-center gap-2 p-3 border-t border-base-300 bg-base-100">
        <input
          type="text"
          value={inputMessage}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="input input-bordered input-sm flex-1 focus:outline-none focus:input-primary"
        />
        <button type="submit" disabled={!inputMessage.trim()} className="btn btn-primary btn-sm">
          Send
        </button>
      </form>
    </div>
  );
};

export default RandomMatchPage;
