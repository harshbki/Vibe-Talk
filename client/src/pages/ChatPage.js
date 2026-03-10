import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

const ChatPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden flex items-center px-3 py-2 border-b border-base-300 bg-base-100">
        <button className="btn btn-ghost btn-sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? '✕ Close' : '☰ Chats'}
        </button>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Sidebar: always visible on lg+, toggleable on mobile */}
        <div className={`${sidebarOpen ? 'block absolute inset-0 z-40 bg-base-100' : 'hidden'} lg:block lg:relative lg:z-auto`}>
          <Sidebar />
        </div>
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatPage;
