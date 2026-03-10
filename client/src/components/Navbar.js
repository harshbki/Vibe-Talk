import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'system'
  );

  const applyTheme = (t) => {
    const resolved = t === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : t;
    document.documentElement.setAttribute('data-theme', resolved);
  };

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => { if (theme === 'system') applyTheme('system'); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  // Listen for theme changes from settings page
  useEffect(() => {
    const handler = () => setTheme(localStorage.getItem('theme') || 'system');
    window.addEventListener('theme-change', handler);
    return () => window.removeEventListener('theme-change', handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  const navLinks = [
    { to: '/chat', label: 'Chat', icon: '💬', match: '/chat' },
    { to: '/users', label: 'Users', icon: '👥', match: '/users' },
    { to: '/match', label: 'Match', icon: '🎲', match: '/match', accent: true },
    { to: '/groups', label: 'Groups', icon: '🏘️', match: '/group' },
    { to: '/profile', label: 'Profile', icon: '👤', match: '/profile' },
    { to: '/settings', label: 'Settings', icon: '⚙️', match: '/settings' },
  ];

  return (
    <div className="navbar bg-base-100/95 backdrop-blur-lg border-b border-base-200 sticky top-0 z-50 px-4 shadow-sm">
      <div className="navbar-start">
        <Link to="/chat" className="flex items-center gap-2 text-lg font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          💬 <span className="hidden sm:inline">Vibe Talk</span>
        </Link>
      </div>

      {/* Desktop nav */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-0.5 px-1">
          {navLinks.map((link) => {
            const isActive = link.match === '/group'
              ? location.pathname.startsWith('/group')
              : location.pathname === link.to;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`text-xs font-semibold rounded-lg px-3 py-2 gap-1 ${
                    isActive
                      ? link.accent
                        ? 'bg-gradient-to-r from-primary to-secondary text-primary-content shadow-sm'
                        : 'bg-primary/10 text-primary'
                      : 'hover:bg-base-200/80'
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="navbar-end gap-1.5">
        <NotificationBell />

        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-sm btn-square text-lg"
          title={`Theme: ${theme}`}
        >
          {theme === 'light' ? '🌙' : theme === 'dark' ? '☀️' : '💻'}
        </button>

        <div className="hidden lg:flex items-center gap-2">
          <Link to="/profile" className="badge badge-outline gap-1 py-3 hover:badge-primary transition-all cursor-pointer">
            <span className="font-semibold text-xs">{user?.nickname}</span>
            <span>{user?.gender === 'Male' ? '👨' : '👩'}</span>
          </Link>
          <button onClick={logout} className="btn btn-ghost btn-sm text-error font-semibold text-xs">
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <div className="dropdown dropdown-end lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(!menuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          {menuOpen && (
            <ul tabIndex={0} className="menu dropdown-content mt-3 z-50 p-3 shadow-xl bg-base-100 border border-base-200 rounded-2xl w-56 gap-1">
              {navLinks.map((link) => {
                const isActive = link.match === '/group'
                  ? location.pathname.startsWith('/group')
                  : location.pathname === link.to;
                return (
                  <li key={link.to}>
                    <Link to={link.to} className={`gap-2 rounded-lg ${isActive ? 'bg-primary/10 text-primary font-semibold' : ''}`}>
                      <span>{link.icon}</span> {link.label}
                    </Link>
                  </li>
                );
              })}
              <div className="divider my-1" />
              <li>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{user?.nickname} {user?.gender === 'Male' ? '👨' : '👩'}</span>
                </div>
              </li>
              <li>
                <button onClick={logout} className="text-error font-semibold gap-2 rounded-lg">
                  🚪 Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
