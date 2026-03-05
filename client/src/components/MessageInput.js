import React, { useState, useRef } from "react";
import { useChat } from "../context/ChatContext";
import API from "../api";

const MessageInput = () => {
  const { selectedChat, sendMessage, emitTyping, emitStopTyping } = useChat();
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const TYPING_INDICATOR_TIMEOUT = 2000;

  const handleTyping = (e) => {
    setText(e.target.value);
    if (selectedChat) {
      emitTyping(selectedChat._id);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        emitStopTyping(selectedChat._id);
      }, TYPING_INDICATOR_TIMEOUT);
    }
  };

  const handleSend = async () => {
    if (!text.trim() && !uploading) return;
    if (!selectedChat) return;
    emitStopTyping(selectedChat._id);
    await sendMessage(text.trim(), selectedChat._id);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedChat) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploading(true);
      const { data } = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await sendMessage("", selectedChat._id, data.url, data.fileType);
    } catch (error) {
      console.error("File upload failed:", error.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (!selectedChat) return null;

  return (
    <div className="flex items-center p-3 border-t bg-white gap-2">
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 text-gray-500 hover:text-indigo-500 transition"
        title="Attach file"
      >
        📎
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileUpload}
      />
      <input
        type="text"
        value={text}
        onChange={handleTyping}
        onKeyDown={handleKeyDown}
        placeholder={uploading ? "Uploading..." : "Type a message..."}
        disabled={uploading}
        className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
      />
      <button
        onClick={handleSend}
        disabled={(!text.trim() && !uploading) || uploading}
        className="bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-600 transition disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
