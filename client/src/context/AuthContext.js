import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import socket from "../socket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("userInfo");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      // Connect socket and register user
      socket.connect();
      socket.emit("setup", parsed);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    setUser(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
    socket.connect();
    socket.emit("setup", data);
    navigate("/chat");
  };

  const register = async (name, email, password) => {
    const { data } = await API.post("/auth/register", { name, email, password });
    setUser(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
    socket.connect();
    socket.emit("setup", data);
    navigate("/chat");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
    socket.disconnect();
    navigate("/login");
  };

  const updateProfile = async (profileData) => {
    const { data } = await API.put("/auth/profile", profileData);
    setUser(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
