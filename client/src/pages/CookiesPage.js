import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import PublicPageHero from '../components/PublicPageHero';

const CookiesPage = () => {
  useEffect(() => {
    document.title = 'Cookies Policy — Vibe Talk';
  }, []);

  return (
    <PublicLayout>
      <PublicPageHero title="Cookies Policy" subtitle="How we use cookies and similar technologies." emoji="🍪" />
      <article className="max-w-3xl mx-auto px-4 py-10 sm:py-14 text-sm text-base-content/80 leading-relaxed space-y-6">
        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">What are cookies?</h2>
          <p>
            Cookies are small text files stored on your device. They help websites remember preferences
            and improve functionality.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Cookies we use</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Essential:</strong> session and login state.</li>
            <li><strong>Preferences:</strong> cookie consent choice (localStorage).</li>
            <li><strong>Analytics:</strong> Google Analytics (if enabled).</li>
            <li><strong>Advertising:</strong> Google AdSense and Monetag may set third-party cookies.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Managing cookies</h2>
          <p>
            You can block or delete cookies in your browser settings. Blocking essential cookies may
            affect login and chat functionality.
          </p>
        </section>
        <p className="text-xs text-base-content/50">
          <Link to="/privacy" className="link">Privacy Policy</Link>
        </p>
      </article>
    </PublicLayout>
  );
};

export default CookiesPage;
