import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Online Chat' },
  { to: '/about', label: 'About' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/articles', label: 'Articles' },
  { to: '/legal', label: 'Legal' },
];

const PublicLayout = ({ children, hideFooter = false, heroHeader = false }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <header
        className={`sticky top-0 z-40 border-b shadow-sm ${
          heroHeader
            ? 'bg-gradient-to-r from-pink-600/95 via-fuchsia-600/95 to-violet-700/95 border-white/10 text-white backdrop-blur-md'
            : 'bg-base-100/95 backdrop-blur-md border-base-200'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link
            to="/"
            className={`flex items-center gap-2 text-lg font-extrabold shrink-0 ${
              heroHeader ? 'text-white' : 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'
            }`}
          >
            <span className="text-xl" aria-hidden>
              ✦
            </span>
            Vibe Talk
          </Link>

          <nav className="hidden md:flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`hover:opacity-100 transition-opacity ${
                  heroHeader
                    ? isActive(link.to)
                      ? 'text-white font-semibold'
                      : 'text-white/85 hover:text-white'
                    : isActive(link.to)
                      ? 'text-primary font-semibold'
                      : 'text-base-content/70 hover:text-primary'
                }`}
              >
                {link.label} ›
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/#start"
              className={`btn btn-sm hidden sm:inline-flex ${
                heroHeader ? 'bg-white text-gray-800 border-0 hover:bg-white/90' : 'btn-primary'
              }`}
            >
              Start Chatting →
            </Link>
            <button
              type="button"
              className={`btn btn-ghost btn-sm btn-square md:hidden ${
                heroHeader ? 'text-white hover:bg-white/10' : ''
              }`}
              aria-label="Open menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            className={`md:hidden border-t px-4 py-3 flex flex-col gap-2 text-sm bg-inherit ${
              heroHeader ? 'border-white/10' : 'border-base-200'
            }`}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={heroHeader ? 'text-white/90 py-1' : 'text-base-content/80 py-1'}
              >
                {link.label} ›
              </Link>
            ))}
            <Link to="/#start" onClick={() => setMenuOpen(false)} className="btn btn-sm btn-primary mt-1">
              Start Chatting →
            </Link>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {!hideFooter && (
        <footer className="border-t border-base-200 bg-base-200/40 mt-auto">
          <div className="max-w-6xl mx-auto px-4 py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div>
              <p className="font-bold mb-2">Vibe Talk</p>
              <p className="text-base-content/60 text-xs leading-relaxed">
                Free random chat, video calls &amp; groups — talk to strangers online on vibetalk.me
              </p>
            </div>
            <div>
              <p className="font-semibold mb-2">Explore</p>
              <ul className="space-y-1 text-base-content/70">
                <li><Link to="/" className="hover:text-primary">Online Chat</Link></li>
                <li><Link to="/about#groups" className="hover:text-primary">Groups</Link></li>
                <li><Link to="/articles" className="hover:text-primary">Articles</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Legal</p>
              <ul className="space-y-1 text-base-content/70">
                <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link to="/legal" className="hover:text-primary">Terms &amp; Legal</Link></li>
                <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Admin</p>
              <ul className="space-y-1 text-base-content/70">
                <li><Link to="/admin/articles" className="hover:text-primary">Manage Articles</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-xs text-base-content/50 pb-6">
            © {new Date().getFullYear()} Vibe Talk · vibetalk.me
          </div>
        </footer>
      )}
    </div>
  );
};

export default PublicLayout;
