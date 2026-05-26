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
import IncomingCallOverlay from './components/IncomingCallOverlay';
import DmToast from './components/DmToast';
import { VideoCallProvider, useVideoCall } from './context/VideoCallContext';
import { initializeAds } from './utils/adUtils';
import { initSounds } from './utils/soundUtils';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/chat" />;
};

const PrivateLayout = ({ children }) => {
  const { callActive } = useVideoCall();
  return (
    <>
      <Navbar />
      <div className={callActive ? 'pt-[min(42vh,360px)]' : undefined}>{children}</div>
    </>
  );
};

function App() {
  useEffect(() => {
    initializeAds();
    initSounds();
  }, []);

  return (
    <AuthProvider>
      <ChatProvider>
        <VideoCallProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
            <IncomingCallOverlay />
            <DmToast />
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
        </VideoCallProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
