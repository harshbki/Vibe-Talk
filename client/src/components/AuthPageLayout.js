import React from 'react';
import { Link } from 'react-router-dom';

/** Minimal layout for /start — centered auth card only (no marketing nav). */
const AuthPageLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-base-200/80 via-base-100 to-primary/5">
    <header className="px-4 py-3 flex items-center justify-between max-w-lg mx-auto w-full">
      <Link to="/" className="text-sm text-base-content/50 hover:text-primary transition-colors">
        ← Home
      </Link>
      <Link
        to="/"
        className="text-lg font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
      >
        💬 Vibe Talk
      </Link>
      <span className="w-12" aria-hidden />
    </header>

    <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10">
      {children}
    </main>

    <footer className="px-4 py-4 text-center text-[11px] text-base-content/40 space-y-2">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        <Link to="/privacy" className="hover:text-primary">
          Privacy
        </Link>
        <Link to="/legal" className="hover:text-primary">
          Terms
        </Link>
        <Link to="/safety" className="hover:text-primary">
          Safety
        </Link>
        <Link to="/contact" className="hover:text-primary">
          Contact
        </Link>
      </div>
      <p>© {new Date().getFullYear()} vibetalk.me</p>
    </footer>
  </div>
);

export default AuthPageLayout;
