import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const {
    chats,
    selectedChat,
    setSelectedChat,
    fetchChats,
    fetchMessages,
    onlineUsers,
    notification,
    setNotification,
  } = useChat();

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat._id);
    // Clear notifications for this chat
    setNotification((prev) => prev.filter((n) => n.chat._id !== chat._id));
  };

  const getChatDisplayName = (chat) => {
    if (chat.isGroupChat) return chat.chatName;
    const other = chat.users.find((u) => u._id !== user._id);
    return other ? other.name : "Unknown";
  };

  const getChatPic = (chat) => {
    if (chat.isGroupChat) return chat.groupPic || "/group-default.png";
    const other = chat.users.find((u) => u._id !== user._id);
    return other?.profilePic || "/default-avatar.png";
  };

  const isUserOnline = (chat) => {
    if (chat.isGroupChat) return false;
    const other = chat.users.find((u) => u._id !== user._id);
    return other ? onlineUsers.includes(other._id) : false;
  };

  const getUnreadCount = (chat) =>
    notification.filter((n) => n.chat._id === chat._id).length;

  return (
    <div className="flex flex-col w-80 border-r bg-white h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold text-indigo-600">Vibe Talk</h1>
        <div className="flex items-center gap-2">
          <img
            src={user?.profilePic || "/default-avatar.png"}
            alt={user?.name}
            className="w-9 h-9 rounded-full object-cover cursor-pointer"
            title={user?.name}
          />
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-red-500 transition"
            title="Logout"
          >
            🚪
          </button>
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <p className="text-center text-gray-400 mt-8 text-sm">
            No chats yet. Search users to start chatting!
          </p>
        ) : (
          chats.map((chat) => {
            const unread = getUnreadCount(chat);
            return (
              <div
                key={chat._id}
                onClick={() => handleSelectChat(chat)}
                className={`flex items-center p-3 cursor-pointer hover:bg-indigo-50 transition border-b ${
                  selectedChat?._id === chat._id ? "bg-indigo-100" : ""
                }`}
              >
                <div className="relative mr-3">
                  <img
                    src={getChatPic(chat)}
                    alt="chat"
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  {isUserOnline(chat) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-sm truncate">
                      {getChatDisplayName(chat)}
                    </p>
                    {unread > 0 && (
                      <span className="bg-indigo-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                        {unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {chat.latestMessage?.content ||
                      (chat.latestMessage?.fileUrl ? "📎 Attachment" : "No messages yet")}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Sidebar;
