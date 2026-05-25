import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { getSocket } from '../socket';
import { getUser } from '../api';
import { playRingingSound, stopRingingSound, vibrate } from '../utils/soundUtils';
import { showCallNotification } from '../utils/notificationUtils';

/**
 * In-app incoming call UI on pages that do not mount VideoCall (/users, /profile, etc.).
 */
const IncomingCallOverlay = () => {
  const { user } = useAuth();
  const { setSelectedUser } = useChat();
  const location = useLocation();
  const navigate = useNavigate();
  const [incoming, setIncoming] = useState(null);

  const onCallPages = location.pathname === '/chat' || location.pathname === '/match';

  const clearIncoming = useCallback(() => {
    stopRingingSound();
    setIncoming(null);
  }, []);

  useEffect(() => {
    if (!user?._id || onCallPages) {
      clearIncoming();
      return undefined;
    }

    const socket = getSocket();
    if (!socket) return undefined;

    const handleIncoming = (data) => {
      if (!data?.roomId || data.from === user._id) return;
      setIncoming(data);
      playRingingSound();
      vibrate([300, 100, 300, 100, 300]);
      showCallNotification(data.fromNickname || 'Someone');
    };

    const handleEnded = (data) => {
      if (incoming?.roomId && data?.roomId && data.roomId !== incoming.roomId) return;
      clearIncoming();
    };

    const handleRejected = (data) => {
      if (incoming?.roomId && data?.roomId && data.roomId !== incoming.roomId) return;
      clearIncoming();
    };

    socket.on('call_incoming', handleIncoming);
    socket.on('video_call_ended', handleEnded);
    socket.on('call_rejected', handleRejected);

    return () => {
      socket.off('call_incoming', handleIncoming);
      socket.off('video_call_ended', handleEnded);
      socket.off('call_rejected', handleRejected);
    };
  }, [user?._id, onCallPages, incoming?.roomId, clearIncoming]);

  const handleReject = () => {
    const socket = getSocket();
    if (socket && incoming) {
      socket.emit('call_reject', {
        roomId: incoming.roomId,
        from: user._id,
        to: incoming.from
      });
    }
    clearIncoming();
  };

  const handleAccept = async () => {
    if (!incoming) return;
    clearIncoming();

    const isRandomMatch = String(incoming.roomId).startsWith('room_');

    if (isRandomMatch) {
      navigate('/match', {
        state: {
          videoCall: {
            roomId: incoming.roomId,
            from: incoming.from,
            accept: true
          }
        }
      });
      return;
    }

    try {
      const sender = await getUser(incoming.from);
      setSelectedUser({
        _id: sender._id,
        nickname: sender.nickname,
        gender: sender.gender
      });
    } catch {
      setSelectedUser({
        _id: incoming.from,
        nickname: incoming.fromNickname || 'User',
        gender: 'Male'
      });
    }

    navigate('/chat', {
      state: {
        openVideoCall: true,
        videoCall: {
          roomId: incoming.roomId,
          from: incoming.from,
          accept: true
        }
      }
    });
  };

  if (!incoming || onCallPages) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="card bg-base-100 shadow-2xl w-full max-w-sm p-6 space-y-4 animate-scale-in">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <span>📹</span> Incoming Call
        </h3>
        <p className="text-sm text-base-content/70">
          {incoming.fromNickname || 'Someone'} is calling you
        </p>
        <div className="flex gap-3">
          <button type="button" className="btn btn-success flex-1" onClick={handleAccept}>
            Accept
          </button>
          <button type="button" className="btn btn-error flex-1" onClick={handleReject}>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallOverlay;
