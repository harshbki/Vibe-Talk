import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Online Chat' },
  { to: '/about', label: 'About' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/articles', label: 'Articles' },
  { to: '/legal', label: 'Legal' },
];

const PublicLayout = ({ children, hideFooter = false }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <header className="sticky top-0 z-40 bg-base-100/95 backdrop-blur-md border-b border-base-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            💬 Vibe Talk
          </Link>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`hover:text-primary transition-colors ${
                  location.pathname === link.to ? 'text-primary font-semibold' : 'text-base-content/70'
                }`}
              >
                {link.label} ›
              </Link>
            ))}
          </nav>
          <Link to="/#start" className="btn btn-primary btn-sm shrink-0">
            Start Chatting →
          </Link>
        </div>
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
