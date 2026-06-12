import React, { createContext, useState, useContext, useEffect } from 'react';
import { guestLogin, profileLoginApi, setAuthToken } from '../api';
import { initSocket, disconnectSocket } from '../socket';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const persistSession = (userData) => {
  const { token, ...user } = userData;
  if (token) setAuthToken(token);
  localStorage.setItem('vibeUser', JSON.stringify(user));
  return user;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('vibeUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem('vibeUser');
      localStorage.removeItem('vibeToken');
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nicknameSuggestions, setNicknameSuggestions] = useState([]);

  useEffect(() => {
    if (user?._id && localStorage.getItem('vibeToken')) {
      initSocket(user._id);
    }
  }, [user]);

  const login = async (nickname, gender) => {
    setLoading(true);
    setError(null);
    setNicknameSuggestions([]);
    try {
      const userData = await guestLogin(nickname, gender);
      const userOnly = persistSession(userData);
      setUser(userOnly);
      initSocket(userOnly._id);
      return userOnly;
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
    setAuthToken(null);
    disconnectSocket();
  };

  const profileLogin = async (nickname, fullName, dateOfBirth) => {
    setLoading(true);
    setError(null);
    setNicknameSuggestions([]);
    try {
      const userData = await profileLoginApi(nickname, fullName, dateOfBirth);
      const userOnly = persistSession(userData);
      setUser(userOnly);
      initSocket(userOnly._id);
      return userOnly;
    } catch (err) {
      const data = err.response?.data;
      setError(data?.message || 'Profile login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    const { token, ...rest } = userData || {};
    if (token) setAuthToken(token);
    setUser(rest);
    localStorage.setItem('vibeUser', JSON.stringify(rest));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: updateUser,
        login,
        profileLogin,
        logout,
        loading,
        error,
        nicknameSuggestions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
