import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import PublicPageHero from '../components/PublicPageHero';

const LegalPage = () => {
  useEffect(() => {
    document.title = 'Terms & Conditions — Vibe Talk | vibetalk.me';
  }, []);

  return (
    <PublicLayout>
      <PublicPageHero title="Terms & Conditions" subtitle="Rules for using Vibe Talk responsibly." emoji="📋" />
      <article className="max-w-3xl mx-auto px-4 py-10 sm:py-14 text-sm text-base-content/80 leading-relaxed space-y-6">
        <p className="text-base-content/50 text-xs">Last updated: July 2026</p>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Acceptance</h2>
          <p>
            By using vibetalk.me you agree to these Terms, our{' '}
            <Link to="/privacy" className="link link-primary">Privacy Policy</Link>, and{' '}
            <Link to="/community-guidelines" className="link link-primary">Community Guidelines</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Eligibility</h2>
          <p>You must be at least 18 years old (or the age of majority in your jurisdiction) to use Vibe Talk.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Acceptable use</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>No harassment, hate speech, threats, or illegal content.</li>
            <li>No spam, bots, scraping, or automated abuse.</li>
            <li>No impersonation or sharing others&apos; private information.</li>
            <li>No sexual exploitation, CSAM, or content involving minors.</li>
            <li>This is a friendship/social chat platform — not a dating service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">User content</h2>
          <p>
            You are responsible for messages and media you send. We may remove content or suspend accounts
            that violate our guidelines. We do not pre-screen all user content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Disclaimer</h2>
          <p>
            Service is provided &quot;as is&quot; without warranties. We are not liable for user interactions,
            third-party links, or service interruptions. Use video chat and stranger meetup at your own discretion.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Advertising</h2>
          <p>
            Free access is supported by Google AdSense and Monetag. Ad partners operate under their own terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Governing law</h2>
          <p>These terms are governed by applicable laws in India. Disputes subject to local jurisdiction.</p>
        </section>

        <p className="text-xs text-base-content/50 pt-4 border-t border-base-200">
          <Link to="/contact" className="link">Contact us</Link> for legal questions.
        </p>
      </article>
    </PublicLayout>
  );
};

export default LegalPage;
