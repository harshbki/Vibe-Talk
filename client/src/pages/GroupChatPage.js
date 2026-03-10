import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { getGroupById, removeGroupMember, deleteGroupApi, getChatMessages, uploadMedia, approveJoinRequestApi, rejectJoinRequestApi } from '../api';
import { getSocket } from '../socket';
import AdBanner from '../components/AdBanner';
import ProfilePromptModal from '../components/ProfilePromptModal';

const GroupChatPage = () => {
  const { groupId } = useParams();
  const { user } = useAuth();
  const { setSelectedUser } = useChat();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [typingUsers, setTypingUsers] = useState({});
  const [showMembers, setShowMembers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupData = await getGroupById(groupId);
        setGroup(groupData);
        try {
          const history = await getChatMessages(groupId);
          const formatted = history.map((m) => {
            const mediaUrl = m.image || null;
            const isVideo = mediaUrl ? /\.(mp4|webm|ogg|mov)(\?|$)/i.test(mediaUrl) : false;
            return {
              from: m.sender?._id || m.sender,
              fromNickname: m.sender?.nickname || 'Unknown',
              text: m.text,
              mediaUrl,
              mediaType: mediaUrl ? (isVideo ? 'video/' : 'image/') : null,
              timestamp: m.timestamp
            };
          });
          setMessages(formatted);
        } catch {
          // No message history yet
        }
      } catch (err) {
        console.error('Fetch group error:', err);
        navigate('/groups');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [groupId, navigate]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !groupId) return;

    socket.emit('join_group', groupId);

    const handleMessage = (data) => {
      if (data.groupId === groupId) {
        const payload = data.message || {};
        setMessages((prev) => [
          ...prev,
          {
            from: data.from,
            fromNickname: data.fromNickname,
            text: payload.text || '',
            mediaUrl: payload.mediaUrl || null,
            mediaType: payload.mediaType || null,
            timestamp: data.timestamp
          }
        ]);
      }
    };

    const handleTyping = ({ from, fromNickname }) => {
      if (from !== user._id) {
        setTypingUsers((prev) => ({ ...prev, [from]: fromNickname }));
      }
    };

    const handleStopTyping = ({ from }) => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[from];
        return next;
      });
    };

    socket.on('group_message_received', handleMessage);
    socket.on('group_user_typing', handleTyping);
    socket.on('group_user_stop_typing', handleStopTyping);

    return () => {
      socket.emit('leave_group', groupId);
      socket.off('group_message_received', handleMessage);
      socket.off('group_user_typing', handleTyping);
      socket.off('group_user_stop_typing', handleStopTyping);
    };
  }, [groupId, user._id]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = useCallback((e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const socket = getSocket();
    if (!socket) return;

    const payload = { text: text.trim() };
    socket.emit('group_message', {
      groupId,
      message: payload,
      from: user._id,
      fromNickname: user.nickname
    });

    setMessages((prev) => [
      ...prev,
      {
        from: user._id,
        fromNickname: user.nickname,
        text: payload.text,
        mediaUrl: null,
        mediaType: null,
        timestamp: new Date()
      }
    ]);

    setText('');
    socket.emit('group_stop_typing', { groupId, from: user._id });
  }, [text, groupId, user._id, user.nickname]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const response = await uploadMedia(file);
      const socket = getSocket();
      if (!socket) return;
      const payload = { text: '', mediaUrl: response.url, mediaType: file.type };
      socket.emit('group_message', {
        groupId,
        message: payload,
        from: user._id,
        fromNickname: user.nickname
      });
      setMessages((prev) => [
        ...prev,
        {
          from: user._id,
          fromNickname: user.nickname,
          text: '',
          mediaUrl: response.url,
          mediaType: file.type,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Group upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleTyping = () => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('group_typing', { groupId, from: user._id, fromNickname: user.nickname });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('group_stop_typing', { groupId, from: user._id });
    }, 2000);
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this member from the group?')) return;
    try {
      const updated = await removeGroupMember(groupId, memberId, user._id);
      setGroup(updated);
    } catch (err) {
      console.error('Remove member error:', err);
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm('Delete this group permanently?')) return;
    try {
      await deleteGroupApi(groupId, user._id);
      navigate('/groups');
    } catch (err) {
      console.error('Delete group error:', err);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm('Leave this group?')) return;
    try {
      await removeGroupMember(groupId, user._id, group.admin?._id || group.admin);
      navigate('/groups');
    } catch (err) {
      console.error('Leave group error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!group) return null;

  const isAdmin = (group.admin?._id || group.admin) === user._id;
  const typingNames = Object.values(typingUsers);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-base-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-base-300 bg-base-100">
        <div>
          <h2 className="font-bold">{group.name}</h2>
          <span className="text-xs text-base-content/50">{group.members?.length || 0} members</span>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm" onClick={() => setShowMembers(!showMembers)}>
            {showMembers ? 'Hide' : 'Members'}
          </button>
          {isAdmin ? (
            <button className="btn btn-error btn-sm btn-outline" onClick={handleDeleteGroup}>Delete</button>
          ) : (
            <button className="btn btn-warning btn-sm btn-outline" onClick={handleLeave}>Leave</button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Messages area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-base-200/30">
            {messages.map((msg, i) => {
              const isMine = msg.from === user._id;
              return (
                <div key={i} className={`chat ${isMine ? 'chat-end' : 'chat-start'}`}>
                  {!isMine && <div className="chat-header text-xs opacity-60">{msg.fromNickname}</div>}
                  <div className={`chat-bubble ${isMine ? 'chat-bubble-primary' : ''} text-sm`}>
                    {msg.mediaUrl ? (
                      <div className="max-w-xs">
                        {(msg.mediaType || '').startsWith('video/') ? (
                          <video controls src={msg.mediaUrl} className="rounded-lg max-w-full" />
                        ) : (
                          <img src={msg.mediaUrl} alt="Upload" className="rounded-lg max-w-full" />
                        )}
                        {msg.text && <p className="mt-1">{msg.text}</p>}
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                  <div className="chat-footer opacity-50 text-xs">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {typingNames.length > 0 && (
            <div className="text-xs text-base-content/50 px-4 py-1">
              <span className="loading loading-dots loading-xs"></span> {typingNames.join(', ')} typing...
            </div>
          )}

          <div className="relative">
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 z-50 mb-2">
                <EmojiPicker onEmojiClick={(emojiData) => { setText(prev => prev + emojiData.emoji); setShowEmojiPicker(false); }} />
              </div>
            )}
          <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-base-300 bg-base-100">
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-circle text-lg"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              title="Add emoji"
            >
              😊
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-circle text-lg"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              title="Upload image or video"
            >
              📎
            </button>
            <input
              ref={fileInputRef}
              className="hidden"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
            />
            <input
              type="text"
              value={text}
              onChange={(e) => { setText(e.target.value); handleTyping(); }}
              placeholder={isUploading ? 'Uploading...' : 'Type a message...'}
              disabled={isUploading}
              className="input input-bordered input-sm flex-1 focus:outline-none focus:input-primary"
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={isUploading}>
              {isUploading ? <span className="loading loading-spinner loading-xs" /> : 'Send'}
            </button>
          </form>
          </div>
        </div>

        {/* Members panel */}
        {showMembers && (
          <div className="w-64 border-l border-base-300 bg-base-100 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-bold text-sm mb-3">Members</h3>
              <div className="space-y-2">
                {group.members?.map((member) => {
                  const memberId = member._id || member;
                  const memberIsAdmin = (group.admin?._id || group.admin) === memberId;
                  return (
                    <div key={memberId} className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-base-200">
                      <div className="flex items-center gap-2 min-w-0">
                        <span>{member.gender === 'Male' ? '👨' : '👩'}</span>
                        <span className="text-sm font-medium truncate">{member.nickname || 'User'}</span>
                        {memberIsAdmin && <span className="badge badge-primary badge-xs">Admin</span>}
                      </div>
                      <div className="flex gap-1">
                        {memberId !== user._id && (
                          <button
                            className="btn btn-ghost btn-xs text-primary"
                            title={user?.isFullAccount ? 'Send private message' : 'Create profile to DM'}
                            onClick={() => {
                              if (!user?.isFullAccount) {
                                setShowProfilePrompt(true);
                                return;
                              }
                              setSelectedUser({ _id: memberId, nickname: member.nickname, gender: member.gender });
                              navigate('/chat');
                            }}
                          >💬</button>
                        )}
                        {isAdmin && !memberIsAdmin && (
                          <button className="btn btn-ghost btn-xs text-error" onClick={() => handleRemoveMember(memberId)}>✕</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Join Requests (admin only) */}
              {isAdmin && group.joinRequests?.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-bold text-sm mb-2">Join Requests ({group.joinRequests.length})</h3>
                  <div className="space-y-2">
                    {group.joinRequests.map((req) => {
                      const reqId = req._id || req;
                      return (
                        <div key={reqId} className="flex items-center justify-between gap-1 p-2 rounded-lg bg-warning/10">
                          <div className="flex items-center gap-2 min-w-0">
                            <span>{req.gender === 'Male' ? '👨' : '👩'}</span>
                            <span className="text-sm font-medium truncate">{req.nickname || 'User'}</span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              className="btn btn-success btn-xs"
                              onClick={async () => {
                                try {
                                  const updated = await approveJoinRequestApi(groupId, reqId, user._id);
                                  setGroup(updated);
                                } catch (err) { console.error('Approve error:', err); }
                              }}
                            >✓</button>
                            <button
                              className="btn btn-error btn-xs"
                              onClick={async () => {
                                try {
                                  await rejectJoinRequestApi(groupId, reqId, user._id);
                                  setGroup(prev => ({ ...prev, joinRequests: prev.joinRequests.filter(r => (r._id || r) !== reqId) }));
                                } catch (err) { console.error('Reject error:', err); }
                              }}
                            >✕</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Ad Banner */}
      <AdBanner slot="group-chat-top" format="horizontal" className="mx-4 my-1 rounded" />

      <ProfilePromptModal show={showProfilePrompt} onClose={() => setShowProfilePrompt(false)} />
    </div>
  );
};

export default GroupChatPage;
