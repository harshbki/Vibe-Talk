import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import LegalPage from './pages/LegalPage';
import SafetyPage from './pages/SafetyPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import AdminArticlesPage from './pages/AdminArticlesPage';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import IncomingCallOverlay from './components/IncomingCallOverlay';
import DmToast from './components/DmToast';
import { VideoCallProvider, useVideoCall } from './context/VideoCallContext';
import { initializeAds } from './utils/adUtils';
import { initSounds } from './utils/soundUtils';
import { initAnalytics } from './utils/analytics';
import CookieConsent from './components/CookieConsent';
import PageViewTracker from './components/PageViewTracker';
import { useSeoMeta } from './utils/seo';

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

  const PrivateSeoMeta = () => {
    const location = useLocation();
    const path = location.pathname;

    let title = 'Vibe Talk App';
    if (path === '/chat') title = 'Chat — Vibe Talk';
    else if (path === '/users') title = 'Users — Vibe Talk';
    else if (path === '/match') title = 'Random Match — Vibe Talk';
    else if (path === '/profile') title = 'Profile — Vibe Talk';
    else if (path === '/settings') title = 'Settings — Vibe Talk';
    else if (path.startsWith('/groups')) title = 'Groups — Vibe Talk';
    else if (path.startsWith('/group/')) title = 'Group Chat — Vibe Talk';
    else if (path.startsWith('/user/')) title = 'User Profile — Vibe Talk';

    useSeoMeta({
      title,
      description: 'Private Vibe Talk user area.',
      canonicalPath: path,
      robots: 'noindex,nofollow',
    });

    return null;
  };

  return (
    <>
      <PrivateSeoMeta />
      <Navbar />
      <div
        className={`flex-1 min-h-0 pb-[4.5rem] lg:pb-0 ${callActive ? 'pt-[min(42vh,360px)]' : ''}`}
      >
        {children}
      </div>
      <MobileBottomNav />
    </>
  );
};

function App() {
  useEffect(() => {
    initializeAds();
    initSounds();
    initAnalytics();
  }, []);

  return (
    <AuthProvider>
      <ChatProvider>
        <VideoCallProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <PageViewTracker />
          <CookieConsent />
          <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
            <IncomingCallOverlay />
            <DmToast />
            <Routes>
              <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/legal" element={<LegalPage />} />
              <Route path="/safety" element={<SafetyPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/articles/:slug" element={<ArticleDetailPage />} />
              <Route path="/admin/articles" element={<AdminArticlesPage />} />
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
