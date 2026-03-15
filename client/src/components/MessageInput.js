import React, { useState, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { uploadMedia } from '../api';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { selectedUser, sendMessage, sendTyping, sendStopTyping } = useChat();
  const { user } = useAuth();
  const typingTimeout = useRef(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setMessage(e.target.value);
    if (selectedUser && user) {
      sendTyping(selectedUser._id, user._id);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        sendStopTyping(selectedUser._id, user._id);
      }, 1000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser || !user) return;
    sendMessage(selectedUser._id, message.trim(), user._id);
    setMessage('');
    setShowEmojiPicker(false);
    sendStopTyping(selectedUser._id, user._id);
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handlePickFile = () => {
    if (!selectedUser || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedUser || !user) return;
    setIsUploading(true);
    try {
      const response = await uploadMedia(file);
      sendMessage(selectedUser._id, {
        text: '',
        mediaUrl: response.url,
        mediaType: file.type
      }, user._id);
      sendStopTyping(selectedUser._id, user._id);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 z-50 mb-2">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t border-base-300 bg-base-100">
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-circle text-lg"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          disabled={!selectedUser}
          title="Add emoji"
        >
          😊
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-circle text-lg"
          onClick={handlePickFile}
          disabled={!selectedUser || isUploading}
          title="Upload image or video"
        >
          📎
        </button>
        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
        <input
          type="text"
          value={message}
          onChange={handleChange}
          placeholder={isUploading ? 'Uploading...' : 'Type a message...'}
          disabled={!selectedUser || isUploading}
          className="input input-bordered input-sm flex-1 focus:outline-none focus:input-primary"
        />
        <button
          type="submit"
          disabled={!message.trim() || !selectedUser || isUploading}
          className="btn btn-primary btn-sm"
        >
          {isUploading ? <span className="loading loading-spinner loading-xs" /> : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
