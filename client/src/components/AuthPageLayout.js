import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

/** Minimal layout for /start — centered auth card only (no marketing nav). Always light theme. */
const AuthPageLayout = ({ children }) => {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', '#6366f1');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 text-slate-800 antialiased font-sans">
      <header className="px-4 py-4 flex items-center justify-between max-w-lg mx-auto w-full">
        <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1">
          <span>&larr;</span> Back to Home
        </Link>
        <Link
          to="/"
          className="text-xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-1.5"
        >
          <span className="text-indigo-600">✦</span> Vibe Talk
        </Link>
        <span className="w-16" aria-hidden />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10">
        {children}
      </main>

      <footer className="px-4 py-6 text-center text-xs text-slate-500 space-y-2 border-t border-slate-200/60 bg-white/40">
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 font-medium">
          <Link to="/privacy" className="hover:text-indigo-600 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/legal" className="hover:text-indigo-600 transition-colors">
            Terms of Service
          </Link>
          <Link to="/safety" className="hover:text-indigo-600 transition-colors">
            Safety Center
          </Link>
          <Link to="/contact" className="hover:text-indigo-600 transition-colors">
            Contact Support
          </Link>
        </div>
        <p className="text-[11px] text-slate-400">© {new Date().getFullYear()} Vibe Talk · vibetalk.me</p>
      </footer>
    </div>
  );
};

export default AuthPageLayout;