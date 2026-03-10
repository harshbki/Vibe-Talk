import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import UsersListPage from './pages/UsersListPage';
import RandomMatchPage from './pages/RandomMatchPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import GroupsListPage from './pages/GroupsListPage';
import CreateGroupPage from './pages/CreateGroupPage';
import GroupChatPage from './pages/GroupChatPage';
import UserProfilePage from './pages/UserProfilePage';
import Navbar from './components/Navbar';
import { initializeAds } from './utils/adUtils';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/chat" />;
};

const PrivateLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  useEffect(() => {
    initializeAds();
  }, []);

  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
            <Routes>
              <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/chat" element={<PrivateRoute><PrivateLayout><ChatPage /></PrivateLayout></PrivateRoute>} />
              <Route path="/users" element={<PrivateRoute><PrivateLayout><UsersListPage /></PrivateLayout></PrivateRoute>} />
              <Route path="/match" element={<PrivateRoute><PrivateLayout><RandomMatchPage /></PrivateLayout></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><PrivateLayout><ProfilePage /></PrivateLayout></PrivateRoute>} />
              <Route path="/user/:userId" element={<PrivateRoute><PrivateLayout><UserProfilePage /></PrivateLayout></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><PrivateLayout><SettingsPage /></PrivateLayout></PrivateRoute>} />
              <Route path="/groups" element={<PrivateRoute><PrivateLayout><GroupsListPage /></PrivateLayout></PrivateRoute>} />
              <Route path="/groups/create" element={<PrivateRoute><PrivateLayout><CreateGroupPage /></PrivateLayout></PrivateRoute>} />
              <Route path="/group/:groupId" element={<PrivateRoute><PrivateLayout><GroupChatPage /></PrivateLayout></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
