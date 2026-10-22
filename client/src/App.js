import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { VideoCallProvider, useVideoCall } from './context/VideoCallContext';

// Primary homepage is directly imported for instant First Paint
import LandingPage from './pages/LandingPage';

// Lazy-load all secondary pages to maximize mobile performance and eliminate unused JS
const StartChatPage = lazy(() => import('./pages/StartChatPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const UsersListPage = lazy(() => import('./pages/UsersListPage'));
const RandomMatchPage = lazy(() => import('./pages/RandomMatchPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const GroupsListPage = lazy(() => import('./pages/GroupsListPage'));
const CreateGroupPage = lazy(() => import('./pages/CreateGroupPage'));
const GroupChatPage = lazy(() => import('./pages/GroupChatPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const SafetyPage = lazy(() => import('./pages/SafetyPage'));
const CommunityGuidelinesPage = lazy(() => import('./pages/CommunityGuidelinesPage'));
const CookiesPage = lazy(() => import('./pages/CookiesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage'));
const AdminArticlesPage = lazy(() => import('./pages/AdminArticlesPage'));

// Core UI components
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import IncomingCallOverlay from './components/IncomingCallOverlay';
import DmToast from './components/DmToast';
import CookieConsent from './components/CookieConsent';
import PageViewTracker from './components/PageViewTracker';
import SeoManager from './components/SeoManager';
import { initializeAds } from './utils/adUtils';
import { initAnalytics } from './utils/analytics';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/start" replace />;
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
      <div
        className={`flex-1 min-h-0 flex flex-col pb-[4.5rem] lg:pb-0 ${callActive ? 'pt-[min(42vh,360px)]' : ''}`}
      >
        {children}
      </div>
      <MobileBottomNav />
    </>
  );
};

const PageFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center p-8">
    <span className="loading loading-spinner text-primary loading-md" aria-label="Loading page"></span>
  </div>
);

function App() {
  useEffect(() => {
    initializeAds();
    initAnalytics();
  }, []);

  return (
    <AuthProvider>
      <ChatProvider>
        <VideoCallProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <PageViewTracker />
            <SeoManager />
            <CookieConsent />
            <div className="min-h-screen h-screen flex flex-col bg-base-100 text-base-content">
              <IncomingCallOverlay />
              <DmToast />
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/start" element={<PublicRoute><StartChatPage /></PublicRoute>} />
                  <Route path="/login" element={<Navigate to="/start" replace />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/legal" element={<LegalPage />} />
                  <Route path="/safety" element={<SafetyPage />} />
                  <Route path="/community-guidelines" element={<CommunityGuidelinesPage />} />
                  <Route path="/cookies" element={<CookiesPage />} />
                  <Route path="/contact" element={<ContactPage />} />
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
              </Suspense>
            </div>
          </Router>
        </VideoCallProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;