import React, { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

const ChatWindow = () => {
  const { user } = useAuth();
  const { selectedChat, messages, isTyping } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-lg">
        Select a chat to start messaging
      </div>
    );
  }

  const getChatName = () => {
    if (selectedChat.isGroupChat) return selectedChat.chatName;
    const other = selectedChat.users.find((u) => u._id !== user._id);
    return other ? other.name : "Unknown";
  };

  const getChatPic = () => {
    if (selectedChat.isGroupChat) return selectedChat.groupPic || "/group-default.svg";
    const other = selectedChat.users.find((u) => u._id !== user._id);
    return other?.profilePic || "/default-avatar.svg";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-4 border-b bg-white shadow-sm">
        <img
          src={getChatPic()}
          alt="chat"
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <h2 className="text-lg font-semibold">{getChatName()}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((msg) => {
          const isOwn = msg.sender._id === user._id;
          return (
            <div
              key={msg._id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              {!isOwn && (
                <img
                  src={msg.sender.profilePic || "/default-avatar.svg"}
                  alt={msg.sender.name}
                  className="w-8 h-8 rounded-full mr-2 self-end"
                />
              )}
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
                  isOwn
                    ? "bg-indigo-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 shadow rounded-bl-none"
                }`}
              >
                {!isOwn && selectedChat.isGroupChat && (
                  <p className="text-xs font-semibold text-indigo-500 mb-1">
                    {msg.sender.name}
                  </p>
                )}
                {msg.fileUrl ? (
                  msg.fileType === "video" ? (
                    <video src={msg.fileUrl} controls className="rounded max-w-full" />
                  ) : (
                    <img
                      src={msg.fileUrl}
                      alt="attachment"
                      className="rounded max-w-full"
                    />
                  )
                ) : (
                  <p>{msg.content}</p>
                )}
                <p
                  className={`text-xs mt-1 ${
                    isOwn ? "text-indigo-200" : "text-gray-400"
                  } text-right`}
                  title={new Date(msg.createdAt).toLocaleString()}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-2 rounded-2xl shadow text-gray-500 text-sm italic">
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
