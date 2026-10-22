import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/safety', label: 'Safety' },
  { to: '/articles', label: 'Articles' },
  { to: '/contact', label: 'Contact' },
];

const FOOTER_EXPLORE = [
  { to: '/start', label: 'Start Random Chat' },
  { to: '/how-it-works', label: 'How Vibe Talk Works' },
  { to: '/about', label: 'About Our Community' },
  { to: '/about#groups', label: 'Topic Hangout Hubs' },
  { to: '/articles', label: 'Chat Tips & Guides' },
];

const FOOTER_SAFETY = [
  { to: '/safety', label: 'Safety Center & Helplines' },
  { to: '/community-guidelines', label: 'Community Guidelines' },
  { to: '/contact', label: 'Report Abuse / Contact Support' },
];

const FOOTER_LEGAL = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/legal', label: 'Terms of Service' },
  { to: '/cookies', label: 'Cookies Policy' },
];

const PublicLayout = ({ children }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Enforce pristine Light Mode on all public pages
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', '#6366f1');
    }
  }, []);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased font-sans">
      {/* ================= HEADER NAVBAR ================= */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-xl font-black shrink-0 group"
          >
            <span
              className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 text-white flex items-center justify-center text-base shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform"
              aria-hidden
            >
              ✦
            </span>
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent text-2xl font-black tracking-tight">
              Vibe Talk
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-x-6 text-sm font-semibold">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`py-1 transition-colors ${
                  isActive(link.to)
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Action */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/start"
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:brightness-110 text-white font-extrabold px-5 py-2.5 rounded-xl text-sm shadow-md shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>⚡ Start Chatting</span>
              <span>&rarr;</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-square md:hidden text-slate-700 hover:bg-slate-100"
              aria-label="Open navigation menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {menuOpen && (
          <nav className="md:hidden border-t border-slate-200 px-4 py-4 flex flex-col gap-2.5 text-sm font-medium bg-white shadow-lg">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`py-2 px-3 rounded-lg transition-colors ${
                  isActive(link.to)
                    ? 'bg-indigo-50 text-indigo-600 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/start"
              onClick={() => setMenuOpen(false)}
              className="mt-2 text-center bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-extrabold py-3 rounded-xl shadow-md"
            >
              ⚡ Start Chatting Now &rarr;
            </Link>
          </nav>
        )}
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1">{children}</main>

      {/* ================= CLEAN FOOTER ================= */}
      <footer className="border-t border-slate-200/80 bg-slate-50/80 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
          {/* Col 1: Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                ✦
              </span>
              <span className="text-lg font-black bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent">
                Vibe Talk
              </span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed mb-4">
              Free random chat, live video calls, and topic groups. Connect with friendly people worldwide with zero registration and zero fees.
            </p>
            <Link
              to="/start"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              <span>Instant Guest Chat</span>
              <span>&rarr;</span>
            </Link>
          </div>

          {/* Col 2: Explore */}
          <div>
            <p className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Explore</p>
            <ul className="space-y-2 text-slate-600 text-xs">
              {FOOTER_EXPLORE.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-indigo-600 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Safety & Trust */}
          <div>
            <p className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Trust &amp; Safety</p>
            <ul className="space-y-2 text-slate-600 text-xs">
              {FOOTER_SAFETY.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-indigo-600 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div>
            <p className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Legal &amp; Compliance</p>
            <ul className="space-y-2 text-slate-600 text-xs">
              {FOOTER_LEGAL.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-indigo-600 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-slate-200/80 py-6 px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Vibe Talk (vibetalk.me). All rights reserved.</p>
            <p className="text-[11px] text-slate-400">
              Safe 18+ stranger chat &amp; video platform · Free Omegle alternative
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;