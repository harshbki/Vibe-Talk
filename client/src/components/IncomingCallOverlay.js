import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { getSocket } from '../socket';
import { getUser } from '../api';
import { useVideoCall } from '../context/VideoCallContext';
import { playRingingSound, stopRingingSound, vibrate } from '../utils/soundUtils';
import { showCallNotification } from '../utils/notificationUtils';
import { getPrivateRoomId } from '../utils/roomUtils';

/**
 * In-app incoming call UI when user is not already on that chat/call.
 */
const IncomingCallOverlay = () => {
  const { user } = useAuth();
  const { setSelectedUser, selectedUser } = useChat();
  const { openCall, callActive, isActiveForRoom } = useVideoCall();
  const location = useLocation();
  const navigate = useNavigate();
  const [incoming, setIncoming] = useState(null);
  const incomingRoomRef = useRef(null);

  const activePrivateRoomId = useMemo(
    () => getPrivateRoomId(user?._id, selectedUser?._id),
    [user?._id, selectedUser?._id]
  );

  const hideOverlay = useMemo(() => {
    if (!incoming?.roomId) return true;
    if (callActive && isActiveForRoom(incoming.roomId)) return true;
    if (location.pathname === '/chat' && activePrivateRoomId === incoming.roomId) return true;
    if (location.pathname === '/match' && String(incoming.roomId).startsWith('room_')) return true;
    return false;
  }, [incoming, callActive, isActiveForRoom, location.pathname, activePrivateRoomId]);

  const clearIncoming = useCallback(() => {
    stopRingingSound();
    incomingRoomRef.current = null;
    setIncoming(null);
  }, []);

  useEffect(() => {
    if (!user?._id) {
      clearIncoming();
      return undefined;
    }

    const socket = getSocket();
    if (!socket) return undefined;

    const handleIncoming = (data) => {
      if (!data?.roomId || data.from === user._id) return;
      incomingRoomRef.current = data.roomId;
      setIncoming(data);
      playRingingSound();
      vibrate([300, 100, 300, 100, 300]);
      showCallNotification(data.fromNickname || 'Someone');
    };

    const handleEnded = (data) => {
      const activeRoom = incomingRoomRef.current;
      if (activeRoom && data?.roomId && data.roomId !== activeRoom) return;
      clearIncoming();
    };

    const handleRejected = (data) => {
      const activeRoom = incomingRoomRef.current;
      if (activeRoom && data?.roomId && data.roomId !== activeRoom) return;
      clearIncoming();
    };

    socket.on('call_incoming', handleIncoming);
    socket.on('video_call_ended', handleEnded);
    socket.on('call_rejected', handleRejected);

    const handleMatchEnded = () => clearIncoming();
    window.addEventListener('vibetalk:match_ended', handleMatchEnded);

    return () => {
      socket.off('call_incoming', handleIncoming);
      socket.off('video_call_ended', handleEnded);
      socket.off('call_rejected', handleRejected);
      window.removeEventListener('vibetalk:match_ended', handleMatchEnded);
    };
  }, [user?._id, clearIncoming]);

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

    const partnerInfo = {
      _id: incoming.from,
      nickname: incoming.fromNickname || 'User',
      gender: 'Male',
    };

    if (isRandomMatch) {
      openCall(partnerInfo, incoming.roomId, {
        roomId: incoming.roomId,
        from: incoming.from,
        accept: true,
      });
      navigate('/match');
      return;
    }

    try {
      const sender = await getUser(incoming.from);
      partnerInfo._id = sender._id;
      partnerInfo.nickname = sender.nickname;
      partnerInfo.gender = sender.gender;
      setSelectedUser(partnerInfo);
    } catch {
      setSelectedUser(partnerInfo);
    }

    openCall(partnerInfo, incoming.roomId, {
      roomId: incoming.roomId,
      from: incoming.from,
      accept: true,
    });
    navigate('/chat');
  };

  if (!incoming || hideOverlay) return null;

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
