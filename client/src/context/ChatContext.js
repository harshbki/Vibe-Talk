import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import API from "../api";
import socket from "../socket";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useState([]);

  // Fetch all chats
  const fetchChats = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await API.get("/chats");
      setChats(data);
    } catch (error) {
      console.error("Failed to fetch chats:", error.message);
    }
  }, [user]);

  // Fetch messages for selected chat
  const fetchMessages = useCallback(async (chatId) => {
    if (!chatId) return;
    try {
      const { data } = await API.get(`/chats/${chatId}/messages`);
      setMessages(data);
      socket.emit("join-chat", chatId);
    } catch (error) {
      console.error("Failed to fetch messages:", error.message);
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(
    async (content, chatId, fileUrl = "", fileType = "") => {
      try {
        const { data } = await API.post("/chats/message", {
          content,
          chatId,
          fileUrl,
          fileType,
        });
        socket.emit("new-message", data);
        setMessages((prev) => [...prev, data]);
        setChats((prev) =>
          prev.map((c) => (c._id === chatId ? { ...c, latestMessage: data } : c))
        );
        return data;
      } catch (error) {
        console.error("Failed to send message:", error.message);
      }
    },
    []
  );

  // Access or create a chat with a user
  const accessChat = useCallback(async (userId) => {
    try {
      const { data } = await API.post("/chats", { userId });
      setSelectedChat(data);
      setChats((prev) => {
        if (prev.find((c) => c._id === data._id)) return prev;
        return [data, ...prev];
      });
      return data;
    } catch (error) {
      console.error("Failed to access chat:", error.message);
    }
  }, []);

  // Create a group chat
  const createGroupChat = useCallback(async (users, chatName) => {
    try {
      const { data } = await API.post("/chats/group", { users, chatName });
      setChats((prev) => [data, ...prev]);
      return data;
    } catch (error) {
      console.error("Failed to create group chat:", error.message);
    }
  }, []);

  // Socket.IO event listeners
  useEffect(() => {
    socket.on("connected", () => {
      console.log("Socket.IO connection established");
    });

    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("message-received", (newMessage) => {
      // Add to notification if not in selected chat
      if (!selectedChat || selectedChat._id !== newMessage.chat._id) {
        setNotification((prev) => [newMessage, ...prev]);
      } else {
        setMessages((prev) => [...prev, newMessage]);
      }
      setChats((prev) =>
        prev.map((c) =>
          c._id === newMessage.chat._id ? { ...c, latestMessage: newMessage } : c
        )
      );
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop-typing", () => setIsTyping(false));

    return () => {
      socket.off("connected");
      socket.off("online-users");
      socket.off("message-received");
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, [selectedChat]);

  // Emit typing events
  const emitTyping = useCallback((chatId) => {
    socket.emit("typing", chatId);
  }, []);

  const emitStopTyping = useCallback((chatId) => {
    socket.emit("stop-typing", chatId);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        messages,
        setMessages,
        onlineUsers,
        isTyping,
        notification,
        setNotification,
        fetchChats,
        fetchMessages,
        sendMessage,
        accessChat,
        createGroupChat,
        emitTyping,
        emitStopTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);

export default ChatContext;
