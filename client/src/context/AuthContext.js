import React, { createContext, useState, useContext, useEffect } from 'react';
import { guestLogin, profileLoginApi } from '../api';
import { initSocket, disconnectSocket } from '../socket';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('vibeUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nicknameSuggestions, setNicknameSuggestions] = useState([]);

  useEffect(() => {
    if (user) {
      initSocket(user._id);
    }
  }, [user]);

  const login = async (nickname, gender) => {
    setLoading(true);
    setError(null);
    setNicknameSuggestions([]);
    try {
      const userData = await guestLogin(nickname, gender);
      setUser(userData);
      localStorage.setItem('vibeUser', JSON.stringify(userData));
      initSocket(userData._id);
      return userData;
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      if (status === 409 && data?.suggestions) {
        setError(data.message);
        setNicknameSuggestions(data.suggestions);
      } else {
        setError(data?.message || 'Login failed');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vibeUser');
    disconnectSocket();
  };

  const profileLogin = async (nickname, fullName, dateOfBirth) => {
    setLoading(true);
    setError(null);
    setNicknameSuggestions([]);
    try {
      const userData = await profileLoginApi(nickname, fullName, dateOfBirth);
      setUser(userData);
      localStorage.setItem('vibeUser', JSON.stringify(userData));
      initSocket(userData._id);
      return userData;
    } catch (err) {
      const data = err.response?.data;
      setError(data?.message || 'Profile login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('vibeUser', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, setUser: updateUser, login, profileLogin, logout, loading, error, nicknameSuggestions }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
