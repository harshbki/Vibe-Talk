import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

const ChatPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] lg:h-[calc(100dvh-4rem)]">
      <div className="lg:hidden flex items-center justify-between px-3 py-2.5 border-b border-base-200 bg-base-100/90 backdrop-blur-sm">
        <button
          type="button"
          className="btn btn-ghost btn-sm gap-2 font-semibold"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span className="text-lg">{sidebarOpen ? '✕' : '☰'}</span>
          {sidebarOpen ? 'Close' : 'Chats'}
        </button>
        <span className="text-xs font-medium text-base-content/50">Direct messages</span>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {sidebarOpen && (
          <button
            type="button"
            className="lg:hidden absolute inset-0 z-30 bg-black/40 backdrop-blur-[2px]"
            aria-label="Close chats panel"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`${
            sidebarOpen
              ? 'flex absolute inset-y-0 left-0 z-40 w-full max-w-sm shadow-2xl'
              : 'hidden'
          } lg:flex lg:relative lg:z-auto lg:w-auto lg:max-w-none lg:shadow-none`}
        >
          <Sidebar onChatSelect={() => setSidebarOpen(false)} />
        </div>

        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatPage;
