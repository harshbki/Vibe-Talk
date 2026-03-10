import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../socket';
import { showAdBeforeCall, triggerAdOnInteraction } from '../utils/adUtils';
import api from '../api';

const VideoCall = ({ partner, roomId, onEndCall }) => {
  const { user } = useAuth();
  const [callStatus, setCallStatus] = useState('idle');
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  const ICE_SERVERS = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('video_offer', handleOffer);
    socket.on('video_answer', handleAnswer);
    socket.on('ice_candidate', handleIceCandidate);
    socket.on('video_call_ended', () => {
      cleanupCall();
      setCallStatus('ended');
    });

    return () => {
      socket.off('video_offer');
      socket.off('video_answer');
      socket.off('ice_candidate');
      socket.off('video_call_ended');
      cleanupCall();
    };
  }, []);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const incrementCallCount = async () => {
    try {
      await api.post('/users/increment-call', { userId: user._id });
    } catch (error) {
      console.error('Error incrementing call count:', error);
    }
  };

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      setCallStatus('calling');

      peerConnection.current = new RTCPeerConnection(ICE_SERVERS);
      stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

      peerConnection.current.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        setCallStatus('connected');
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          const socket = getSocket();
          socket.emit('ice_candidate', { roomId, candidate: event.candidate, to: partner._id });
        }
      };

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      const socket = getSocket();
      socket.emit('video_offer', { roomId, offer, to: partner._id, from: user._id });
      await incrementCallCount();
    } catch (error) {
      console.error('Error starting call:', error);
      alert('Could not access camera/microphone. Please allow permissions.');
      setCallStatus('idle');
    }
  };

  const handleOffer = async (data) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);

      peerConnection.current = new RTCPeerConnection(ICE_SERVERS);
      stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

      peerConnection.current.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        setCallStatus('connected');
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          const socket = getSocket();
          socket.emit('ice_candidate', { roomId, candidate: event.candidate, to: data.from });
        }
      };

      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      const socket = getSocket();
      socket.emit('video_answer', { roomId, answer, to: data.from });
      setCallStatus('connected');
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleAnswer = async (data) => {
    try {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  const handleIceCandidate = async (data) => {
    try {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  };

  const cleanupCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    setLocalStream(null);
    setRemoteStream(null);
    peerConnection.current = null;
  };

  const endCall = () => {
    const socket = getSocket();
    if (socket) {
      socket.emit('video_call_end', { roomId, from: user._id });
    }
    cleanupCall();
    setCallStatus('ended');
    if (onEndCall) onEndCall();
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => { track.enabled = !track.enabled; });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => { track.enabled = !track.enabled; });
      setIsVideoOff(!isVideoOff);
    }
  };

  const initiateCall = () => {
    triggerAdOnInteraction();
    if (user.freeCallsUsed < 1) {
      startCall();
    } else {
      showAdBeforeCall(() => { startCall(); });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-base-200 rounded-xl">
      {callStatus === 'idle' && (
        <div className="card bg-base-100 shadow-lg p-8 flex flex-col items-center gap-4">
          <div className="avatar placeholder">
            <div className={`w-20 rounded-full ${partner?.gender === 'Male' ? 'bg-info/20 text-info' : 'bg-secondary/20 text-secondary'}`}>
              <span className="text-3xl">{partner?.nickname?.charAt(0).toUpperCase()}</span>
            </div>
          </div>
          <h3 className="font-bold text-lg">{partner?.nickname}</h3>
          <span className="badge badge-outline">
            {partner?.gender === 'Male' ? '👨' : '👩'} {partner?.gender}
          </span>
          <button className="btn btn-primary gap-2 mt-2" onClick={initiateCall}>
            📹 Start Video Call
          </button>
          {user.freeCallsUsed >= 1 && (
            <p className="text-xs text-base-content/50">* Ad will play before call starts</p>
          )}
        </div>
      )}

      {callStatus === 'calling' && (
        <div className="card bg-base-100 shadow-lg p-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="avatar placeholder">
              <div className={`w-14 rounded-full ${user?.gender === 'Male' ? 'bg-info/20 text-info' : 'bg-secondary/20 text-secondary'}`}>
                <span className="text-xl">{user?.nickname?.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <span className="loading loading-dots loading-md text-primary" />
            <div className="avatar placeholder">
              <div className={`w-14 rounded-full ${partner?.gender === 'Male' ? 'bg-info/20 text-info' : 'bg-secondary/20 text-secondary'}`}>
                <span className="text-xl">{partner?.nickname?.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-base-content/70">Calling {partner?.nickname}...</p>
          <button className="btn btn-error btn-outline btn-sm" onClick={endCall}>Cancel</button>
        </div>
      )}

      {callStatus === 'connected' && (
        <div className="w-full flex flex-col items-center gap-4">
          <div className="relative w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <span className="absolute top-2 left-2 badge badge-neutral badge-sm">{partner?.nickname}</span>
            <div className="absolute bottom-3 right-3 w-32 aspect-video bg-base-300 rounded-lg overflow-hidden border-2 border-base-100 shadow-lg">
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <span className="absolute bottom-1 left-1 badge badge-neutral badge-xs">You</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className={`btn btn-circle ${isMuted ? 'btn-warning' : 'btn-ghost'}`} onClick={toggleMute}>
              {isMuted ? '🔇' : '🔊'}
            </button>
            <button className={`btn btn-circle ${isVideoOff ? 'btn-warning' : 'btn-ghost'}`} onClick={toggleVideo}>
              {isVideoOff ? '📷' : '📹'}
            </button>
            <button className="btn btn-circle btn-error" onClick={endCall}>
              📞
            </button>
          </div>
        </div>
      )}

      {callStatus === 'ended' && (
        <div className="card bg-base-100 shadow-lg p-8 flex flex-col items-center gap-4">
          <h3 className="font-bold text-lg">Call Ended</h3>
          <button className="btn btn-primary btn-sm" onClick={() => setCallStatus('idle')}>Start New Call</button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
