import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { getSocket } from '../socket';
import VideoCall from '../components/VideoCall';

const VideoCallContext = createContext(null);

export const useVideoCall = () => {
  const ctx = useContext(VideoCallContext);
  if (!ctx) throw new Error('useVideoCall must be used within VideoCallProvider');
  return ctx;
};

export const VideoCallProvider = ({ children }) => {
  const { user } = useAuth();
  const [activeCall, setActiveCall] = useState(null);
  const prevUserIdRef = useRef(null);

  const endCallOnServer = useCallback((call) => {
    if (!call?.roomId || !user?._id) return;
    const socket = getSocket();
    if (!socket) return;
    socket.emit('video_call_end', {
      roomId: call.roomId,
      from: user._id,
      to: call.partner?._id,
    });
  }, [user?._id]);

  const closeCall = useCallback(() => {
    setActiveCall((current) => {
      if (current) endCallOnServer(current);
      return null;
    });
  }, [endCallOnServer]);

  const openCall = useCallback((partner, roomId, pendingIncoming = null) => {
    if (!partner || !roomId) return;
    setActiveCall({ partner, roomId, pendingIncoming });
  }, []);

  const startCall = useCallback((partner, roomId) => {
    openCall(partner, roomId, null);
  }, [openCall]);

  const isActiveForRoom = useCallback(
    (roomId) => Boolean(activeCall?.roomId && activeCall.roomId === roomId),
    [activeCall?.roomId]
  );

  // End call when user logs out or switches account
  useEffect(() => {
    const prev = prevUserIdRef.current;
    if (prev && prev !== user?._id) {
      setActiveCall((current) => {
        if (current) endCallOnServer(current);
        return null;
      });
    }
    prevUserIdRef.current = user?._id ?? null;
  }, [user?._id, endCallOnServer]);

  const handleEndFromComponent = useCallback(() => {
    setActiveCall(null);
  }, []);

  const callActive = Boolean(activeCall && user);

  return (
    <VideoCallContext.Provider
      value={{
        activeCall,
        callActive,
        openCall,
        startCall,
        closeCall,
        isActiveForRoom,
      }}
    >
      {children}
      {callActive && (
        <div
          className="fixed top-16 left-0 right-0 z-[200] bg-base-100 border-b border-base-300 shadow-lg"
          style={{ maxHeight: 'min(42vh, 360px)' }}
        >
          <div className="flex items-center justify-between px-3 py-1 bg-base-200/80 text-xs">
            <span className="font-medium">📹 {activeCall.partner?.nickname}</span>
            <span className="text-base-content/50 hidden sm:inline">
              Chat stays below — browse freely
            </span>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(min(42vh, 360px) - 28px)' }}>
            <VideoCall
              embedded
              partner={activeCall.partner}
              roomId={activeCall.roomId}
              onEndCall={handleEndFromComponent}
              pendingIncomingCall={activeCall.pendingIncoming}
              onPendingIncomingConsumed={() =>
                setActiveCall((c) => (c ? { ...c, pendingIncoming: null } : null))
              }
            />
          </div>
        </div>
      )}
    </VideoCallContext.Provider>
  );
};

export default VideoCallContext;
