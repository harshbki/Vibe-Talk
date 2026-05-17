import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../socket';
import { showAdBeforeCall, triggerAdOnInteraction } from '../utils/adUtils';
import { playRingingSound, stopRingingSound } from '../utils/soundUtils';
import api from '../api';

const VideoCall = ({ partner, roomId, onEndCall }) => {
  const { user } = useAuth();
  const [callStatus, setCallStatus] = useState('idle');
  const [incomingCall, setIncomingCall] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCaller, setIsCaller] = useState(false);
  const [callError, setCallError] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const pendingIceCandidates = useRef([]);

  const ICE_SERVERS = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleIncomingCall = (data) => {
      if (data.from === user?._id) return; // Ignore own call requests
      setIncomingCall(data);
      setCallStatus('incoming');
      setIsCaller(false);  // Mark as receiver
      playRingingSound(); // Play ringing sound for incoming call
    };

    const handleCallAccepted = async () => {
      try {
        stopRingingSound();
        setCallStatus('connecting');
        // isCaller already set true in requestCall()
        // Media should already be loaded from initiateCall()
        await createOffer();  // ONLY caller creates offer
      } catch (error) {
        console.error('Error on call accepted:', error);
        stopRingingSound();
        setCallStatus('idle');
      }
    };

    const handleCallRejected = () => {
      stopRingingSound(); // Stop ringing when call rejected
      cleanupCall();
      setIncomingCall(null);
      setCallStatus('idle');
      if (onEndCall) onEndCall();
      alert(`${partner?.nickname || 'User'} rejected the call`);
    };

    const handleVideoOffer = (data) => {
      handleOffer(data);
    };

    const handleVideoAnswer = (data) => {
      handleAnswer(data);
    };

    const handleVideoIceCandidate = (data) => {
      handleIceCandidate(data);
    };

    const handleVideoCallEnded = () => {
      stopRingingSound(); // Stop ringing when call ends
      cleanupCall();
      setCallStatus('idle');
      setIncomingCall(null);
      if (onEndCall) onEndCall();
    };

    socket.on('video_offer', handleVideoOffer);
    socket.on('video_answer', handleVideoAnswer);
    socket.on('ice_candidate', handleVideoIceCandidate);
    socket.on('call_incoming', handleIncomingCall);
    socket.on('call_accepted', handleCallAccepted);
    socket.on('call_rejected', handleCallRejected);
    socket.on('video_call_ended', handleVideoCallEnded);

    return () => {
      socket.off('video_offer', handleVideoOffer);
      socket.off('video_answer', handleVideoAnswer);
      socket.off('ice_candidate', handleVideoIceCandidate);
      socket.off('call_incoming', handleIncomingCall);
      socket.off('call_accepted', handleCallAccepted);
      socket.off('call_rejected', handleCallRejected);
      socket.off('video_call_ended', handleVideoCallEnded);
      cleanupCall();
    };
  }, [onEndCall, partner?.nickname, user?._id]);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch((error) => {
        console.error('Remote video autoplay blocked:', error);
      });
    }
  }, [remoteStream]);

  const incrementCallCount = async () => {
    try {
      await api.post('/users/increment-call', { userId: user._id });
    } catch (error) {
      console.error('Error incrementing call count:', error);
    }
  };

  const ensureLocalMedia = async () => {
    if (localStream) return localStream;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Camera/Microphone permission denied:', error.name);
      throw new Error('Camera/Microphone access denied. Please allow permissions and try again.');
    }
  };

  const ensurePeerConnection = (targetUserId) => {
    if (peerConnection.current) return peerConnection.current;

    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      setCallStatus('connected');
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const socket = getSocket();
        if (socket) {
          socket.emit('ice_candidate', { roomId, candidate: event.candidate, to: targetUserId, from: user._id });
        }
      }
    };

    peerConnection.current = pc;
    return pc;
  };

  const flushPendingCandidates = async () => {
    if (!peerConnection.current || pendingIceCandidates.current.length === 0) return;
    const toApply = [...pendingIceCandidates.current];
    pendingIceCandidates.current = [];
    for (const candidate of toApply) {
      await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const createOffer = async () => {
    try {
      setCallError(null);
      const stream = await ensureLocalMedia();
      const pc = ensurePeerConnection(partner?._id);
      if (!pc.getSenders().length) {
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
      }

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const socket = getSocket();
      if (socket) {
        // Send offer to specific user (partner._id) for direct routing
        socket.emit('video_offer', { 
          roomId, 
          offer, 
          to: partner?._id,  // Ensure direct routing to partner
          from: user._id 
        });
      }
      await incrementCallCount();
    } catch (error) {
      console.error('Error creating offer:', error);
      stopRingingSound();
      setCallStatus('idle');
      setCallError('Failed to setup video call: ' + error.message);
    }
  };

  const handleOffer = async (data) => {
    try {
      setCallError(null);
      const stream = await ensureLocalMedia();
      const pc = ensurePeerConnection(data.from);
      if (!pc.getSenders().length) {
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
      }

      // Fix: Use RTCSessionDescriptionInit format instead of deprecated RTCSessionDescription
      await pc.setRemoteDescription(new RTCSessionDescription({
        type: 'offer',
        sdp: data.offer.sdp
      }));
      await flushPendingCandidates();

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      const socket = getSocket();
      if (socket) {
        socket.emit('video_answer', { roomId, answer, to: data.from, from: user._id });
      }
      setCallStatus('connecting');
    } catch (error) {
      console.error('Error handling offer:', error);
      stopRingingSound();
      setCallStatus('idle');
      setCallError('Failed to connect video call: ' + error.message);
    }
  };

  const handleAnswer = async (data) => {
    try {
      if (!peerConnection.current) return;
      // Fix: Use RTCSessionDescriptionInit format instead of deprecated RTCSessionDescription
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription({
        type: 'answer',
        sdp: data.answer.sdp
      }));
      await flushPendingCandidates();
      setCallStatus('connecting');
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  const handleIceCandidate = async (data) => {
    try {
      if (!data?.candidate) return;
      const pc = peerConnection.current;
      if (!pc || !pc.remoteDescription) {
        pendingIceCandidates.current.push(data.candidate);
        return;
      }
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  };

  const cleanupCall = () => {
    stopRingingSound();
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    if (localStream) {
      localStream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (error) {
          console.error('Error stopping track:', error);
        }
      });
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    setLocalStream(null);
    setRemoteStream(null);
    peerConnection.current = null;
    pendingIceCandidates.current = [];
    setIsMuted(false);
    setIsVideoOff(false);
    setIsCaller(false);
    setCallError(null);
  };

  const endCall = () => {
    const socket = getSocket();
    if (socket) {
      socket.emit('video_call_end', { roomId, from: user._id });
    }
    cleanupCall();
    setCallStatus('ended');
    setIncomingCall(null);
    if (onEndCall) onEndCall();
  };

  const requestCall = () => {
    const socket = getSocket();
    if (!socket || !roomId || !partner?._id) return;
    setIsCaller(true);  // Mark as caller IMMEDIATELY
    setCallStatus('calling');
    playRingingSound(); // Play ringing sound for caller
    socket.emit('call_request', {
      roomId,
      from: user._id,
      fromNickname: user.nickname
    });
  };

  const acceptIncomingCall = async () => {
    try {
      stopRingingSound();
      setCallError(null);
      triggerAdOnInteraction();
      
      // Get media permission first
      if (!localStream) {
        await ensureLocalMedia();
      }
      
      const socket = getSocket();
      if (socket) {
        socket.emit('call_accept', { roomId, from: user._id });
      }
      setIncomingCall(null);
      setCallStatus('connecting');
    } catch (error) {
      console.error('Error accepting call:', error);
      stopRingingSound();
      setCallError(error.message || 'Could not access camera/microphone. Please check browser permissions.');
      setCallStatus('idle');
      rejectIncomingCall();
    }
  };

  const rejectIncomingCall = () => {
    stopRingingSound(); // Stop ringing when rejecting
    const socket = getSocket();
    if (socket) {
      socket.emit('call_reject', { roomId, from: user._id });
    }
    setIncomingCall(null);
    cleanupCall();
    setCallStatus('idle');
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

  const initiateCall = async () => {
    try {
      setCallError(null);
      // Get media permission FIRST before calling
      await ensureLocalMedia();
      triggerAdOnInteraction();
      if (user.freeCallsUsed < 1) {
        requestCall();
      } else {
        showAdBeforeCall(() => { requestCall(); });
      }
    } catch (error) {
      console.error('Camera/microphone error:', error);
      setCallError(error.message || 'Camera/microphone access denied');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-base-200 rounded-xl">
      {callStatus === 'idle' && (
        <div className="card bg-base-100 shadow-lg p-8 flex flex-col items-center gap-4">
          {callError && (
            <div className="alert alert-error text-sm w-full">
              <span>{callError}</span>
              <button 
                className="btn btn-sm btn-ghost" 
                onClick={() => setCallError(null)}
              >
                ✕
              </button>
            </div>
          )}
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
          <div className="divider my-2 w-full" />
          <div className="alert alert-info text-sm">
            <span>🔒 Camera/mic permissions needed. Browser will ask for permission when you click the button above.</span>
          </div>
          {user.freeCallsUsed >= 1 && (
            <p className="text-xs text-base-content/50">* Ad will play before call starts</p>
          )}
        </div>
      )}

      {callStatus === 'incoming' && (
        <div className="card bg-base-100 shadow-lg p-8 flex flex-col items-center gap-4">
          <h3 className="font-bold text-lg">Incoming Call</h3>
          <p className="text-sm text-base-content/70">{incomingCall?.fromNickname || partner?.nickname} is calling you</p>
          <div className="flex gap-3">
            <button className="btn btn-success btn-sm" onClick={acceptIncomingCall}>Accept</button>
            <button className="btn btn-error btn-sm" onClick={rejectIncomingCall}>Reject</button>
          </div>
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

      {callStatus === 'connecting' && (
        <div className="card bg-base-100 shadow-lg p-8 flex flex-col items-center gap-4">
          <span className="loading loading-ring loading-md text-primary" />
          <p className="text-sm text-base-content/70">Connecting media...</p>
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
