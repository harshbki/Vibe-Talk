import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/articles', label: 'Articles' },
  { to: '/legal', label: 'Legal' },
];

const FOOTER_EXPLORE = [
  { to: '/about', label: 'About Us' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about#groups', label: 'Groups' },
  { to: '/articles', label: 'Articles & Tips' },
  { to: '/start', label: 'Start Chatting' },
];

const FOOTER_LEGAL = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/legal', label: 'Terms & Conditions' },
  { to: '/community-guidelines', label: 'Community Guidelines' },
  { to: '/safety', label: 'Safety' },
  { to: '/cookies', label: 'Cookies Policy' },
  { to: '/contact', label: 'Contact' },
];

const PublicLayout = ({ children }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'system'
  );

  const applyTheme = (t) => {
    const resolved =
      t === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : t;
    document.documentElement.setAttribute('data-theme', resolved);
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', resolved === 'dark' ? '#0c0f1a' : '#6366f1');
    }
  };

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') applyTheme('system');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  // Listen for theme changes from other components/pages
  useEffect(() => {
    const handler = () => setTheme(localStorage.getItem('theme') || 'system');
    window.addEventListener('theme-change', handler);
    return () => window.removeEventListener('theme-change', handler);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
    window.dispatchEvent(new Event('theme-change'));
  };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content antialiased">
      <header className="sticky top-0 z-40 border-b border-base-200/80 bg-base-100/90 backdrop-blur-md shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-black shrink-0 group"
          >
            <span
              className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 text-white flex items-center justify-center text-sm shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform"
              aria-hidden
            >
              ✦
            </span>
            <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent text-xl tracking-tight">
              Vibe Talk
            </span>
          </Link>

          <nav className="hidden md:flex flex-wrap items-center gap-x-5 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`transition-colors py-1 ${
                  isActive(link.to)
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-base-content/70 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm btn-circle text-base hover:bg-base-200 transition-colors"
              title={`Theme: ${theme} (Click to toggle)`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : theme === 'dark' ? '☀️' : '💻'}
            </button>

            <Link
              to="/start"
              className="btn btn-sm btn-primary hidden sm:inline-flex rounded-xl font-bold px-4 shadow-sm"
            >
              Start Chatting &rarr;
            </Link>

            <button
              type="button"
              className="btn btn-ghost btn-sm btn-square md:hidden hover:bg-base-200"
              aria-label="Open menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden border-t border-base-200/80 px-4 py-3 flex flex-col gap-2 text-sm bg-base-100">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`py-1.5 font-medium ${isActive(link.to) ? 'text-primary font-bold' : 'text-base-content/80'}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex items-center justify-between border-t border-base-200">
              <span className="text-xs text-base-content/60">Theme: {theme}</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="btn btn-xs btn-outline rounded-lg"
              >
                Toggle {theme === 'light' ? 'Dark 🌙' : 'Light ☀️'}
              </button>
            </div>
            <Link
              to="/start"
              onClick={() => setMenuOpen(false)}
              className="btn btn-sm btn-primary mt-2 rounded-xl"
            >
              Start Chatting &rarr;
            </Link>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-base-200 bg-base-200/40 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-sm">
          <div>
            <p className="font-bold mb-2">Vibe Talk</p>
            <p className="text-base-content/60 text-xs leading-relaxed">
              Free random chat, video calls &amp; groups — talk to strangers online on vibetalk.me
            </p>
            <Link to="/start" className="btn btn-primary btn-sm mt-4">
              Start Chatting &rarr;
            </Link>
          </div>
          <div>
            <p className="font-semibold mb-2">Explore</p>
            <ul className="space-y-1 text-base-content/70">
              {FOOTER_EXPLORE.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Legal &amp; Trust</p>
            <ul className="space-y-1 text-base-content/70">
              {FOOTER_LEGAL.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-base-content/50 pb-6 border-t border-base-200/80 pt-4 mx-4">
          © {new Date().getFullYear()} Vibe Talk · vibetalk.me
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;