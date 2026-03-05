import React, { useState } from "react";
import API from "../api";
import { useChat } from "../context/ChatContext";

const UserList = ({ onClose }) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { accessChat, onlineUsers } = useChat();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    try {
      setLoading(true);
      const { data } = await API.get(`/auth/users?search=${value}`);
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = async (userId) => {
    await accessChat(userId);
    setSearch("");
    setResults([]);
    if (onClose) onClose();
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search users by name or email..."
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {loading && <p className="text-center text-sm text-gray-400">Searching...</p>}

      <div className="space-y-2">
        {results.map((user) => (
          <div
            key={user._id}
            onClick={() => handleSelectUser(user._id)}
            className="flex items-center p-3 rounded-lg hover:bg-indigo-50 cursor-pointer transition"
          >
            <div className="relative mr-3">
              <img
                src={user.profilePic || "/default-avatar.svg"}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <p className="font-semibold text-sm">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
        ))}
        {!loading && search && results.length === 0 && (
          <p className="text-center text-sm text-gray-400">No users found</p>
        )}
      </div>
    </div>
  );
};

export default UserList;
