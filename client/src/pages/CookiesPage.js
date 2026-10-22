import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import PublicPageHero from '../components/PublicPageHero';

const COOKIE_CATEGORIES = [
  {
    category: 'Strictly Essential Cookies',
    purpose: 'Required for core website functionality, user authentication, active chat sessions, and cross-site request security.',
    examples: 'vibeUser (session token), data-theme (light/dark preference), cookieConsent (consent banner state).',
    retention: 'Session to 12 months.',
    optOut: 'Cannot be disabled as the site cannot function without them.',
  },
  {
    category: 'Advertising & Monetization Cookies',
    purpose: 'Used by authorized ad partners (Google AdSense, Monetag) to serve personalized or contextual advertisements to keep Vibe Talk 100% free for users worldwide.',
    examples: '__gads, __gpi, IDE, test_cookie (Google DoubleClick & AdSense networks).',
    retention: '30 days to 24 months.',
    optOut: 'Can be managed via our Cookie Banner, Google Ads Settings, or your browser settings.',
  },
  {
    category: 'Performance & Analytical Cookies',
    purpose: 'Helps us understand aggregated page views, bounce rates, technical connection errors, and user journeys to improve latency and stability.',
    examples: '_ga, _gid, _gat (Google Analytics aggregated reporting without PII).',
    retention: '24 hours to 2 years.',
    optOut: 'Can be declined via Google Analytics Opt-Out Browser Add-on or privacy settings.',
  },
];

const CookiesPage = () => {
  useEffect(() => {
    document.title = 'Cookies Policy & Tracking Transparency — Vibe Talk | vibetalk.me';
  }, []);

  return (
    <PublicLayout>
      <PublicPageHero
        title="Cookies &amp; Tracking Policy"
        subtitle="Transparent information on how cookies, storage, and ad technologies are utilized on vibetalk.me."
        emoji="🍪"
      />

      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16 space-y-12">
        {/* Intro */}
        <section className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-100">
            Cookie Transparency
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How We Use Cookies to Keep Vibe Talk Free
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            This Cookies Policy explains what cookies and local storage tokens are, how <strong>Vibe Talk (vibetalk.me)</strong> uses them, and how you can control your preferences. We believe in complete transparency regarding your data.
          </p>
        </section>

        {/* Categories Table */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Categories of Cookies We Use</h3>
          <div className="grid gap-5">
            {COOKIE_CATEGORIES.map((c) => (
              <div
                key={c.category}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <h4 className="text-base font-extrabold text-slate-900">{c.category}</h4>
                  <span className="text-xs font-mono font-semibold text-slate-500">Retention: {c.retention}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{c.purpose}</p>
                <div className="text-xs text-slate-500 space-y-1 pt-1">
                  <p><strong>Sample Tokens:</strong> {c.examples}</p>
                  <p><strong>Management:</strong> {c.optOut}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to Control Cookies */}
        <section className="bg-slate-50/70 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">How You Can Manage Your Cookie Settings</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            You have the right to accept or decline non-essential cookies. You can manage your preferences through several mechanisms:
          </p>
          <ul className="text-xs sm:text-sm text-slate-600 space-y-2 list-disc pl-5">
            <li>
              <strong>Browser Controls:</strong> Most web browsers (Chrome, Edge, Firefox, Safari) allow you to view, manage, and delete cookies from your browser history settings.
            </li>
            <li>
              <strong>Google Ads Settings:</strong> You can manage Google personalized ads by visiting{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Google Ad Settings
              </a>.
            </li>
            <li>
              <strong>Industry Opt-Out Portals:</strong> You can opt out of behavioral advertising via the Digital Advertising Alliance ({' '}
              <a
                href="https://optout.aboutads.info"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 font-semibold hover:underline"
              >
                aboutads.info
              </a>{' '}
              ) or Your Online Choices ({' '}
              <a
                href="https://www.youronlinechoices.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 font-semibold hover:underline"
              >
                youronlinechoices.com
              </a>{' '}
              ).
            </li>
          </ul>
        </section>

        {/* Links */}
        <section className="border-t border-slate-200 pt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <p>Last modified: October 2026</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-indigo-600 font-semibold hover:underline">
              Privacy Policy &rarr;
            </Link>
            <Link to="/legal" className="text-indigo-600 font-semibold hover:underline">
              Terms of Service &rarr;
            </Link>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default CookiesPage;