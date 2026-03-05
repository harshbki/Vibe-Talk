import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import UserList from "../components/UserList";
import { useChat } from "../context/ChatContext";

const ChatPage = () => {
  const { selectedChat } = useChat();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex flex-col w-80 border-r bg-white h-full">
        {/* Search toggle button */}
        <div className="px-4 py-2 border-b flex justify-between items-center">
          <button
            onClick={() => setShowSearch((v) => !v)}
            className="text-sm text-indigo-500 hover:underline"
          >
            {showSearch ? "✕ Close Search" : "🔍 Search Users"}
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="text-sm text-gray-500 hover:text-indigo-500 transition"
            title="Profile"
          >
            👤 Profile
          </button>
        </div>

        {showSearch ? (
          <div className="overflow-y-auto flex-1">
            <UserList onClose={() => setShowSearch(false)} />
          </div>
        ) : (
          <Sidebar />
        )}
      </div>

      {/* Main chat area */}
      <div className="flex flex-col flex-1 h-full">
        {selectedChat ? (
          <>
            <div className="flex-1 overflow-hidden">
              <ChatWindow />
            </div>
            <MessageInput />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-5xl mb-4">💬</p>
            <p className="text-xl font-semibold">Welcome to Vibe Talk</p>
            <p className="text-sm mt-2">
              Search for users or select a chat to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
