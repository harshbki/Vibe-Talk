import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import PublicPageHero from '../components/PublicPageHero';

const PrivacyPage = () => {
  useEffect(() => {
    document.title = 'Privacy Policy — Vibe Talk | vibetalk.me';
  }, []);

  return (
    <PublicLayout>
      <PublicPageHero title="Privacy Policy" subtitle="How we collect, use, and protect your information." emoji="🔒" />
      <article className="max-w-3xl mx-auto px-4 py-10 sm:py-14 text-sm text-base-content/80 leading-relaxed space-y-6">
        <p className="text-base-content/50 text-xs">Last updated: July 2026 · vibetalk.me</p>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Overview</h2>
          <p>
            Vibe Talk (&quot;we&quot;, &quot;us&quot;, &quot;vibetalk.me&quot;) respects your privacy. This policy explains what
            information we collect when you use guest chat, profile login, random match, video calls,
            direct messages, and groups.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Information we collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account data:</strong> nickname, gender (guest), optional profile (name, DOB, bio, photo).</li>
            <li><strong>Content:</strong> messages, images, and media you send on the platform.</li>
            <li><strong>Technical data:</strong> IP address, browser, device type, session cookies.</li>
            <li><strong>Analytics:</strong> aggregated usage via Google Analytics (if enabled).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">How we use information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide chat, match, video, and group services.</li>
            <li>Maintain safety, prevent abuse, and enforce community guidelines.</li>
            <li>Improve performance and fix bugs.</li>
            <li>Display ads through Google AdSense and Monetag on our free service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Third-party services</h2>
          <p>
            We use MongoDB Atlas, Cloudinary, Render, Google AdSense, Monetag, and optionally Google
            Analytics. Each provider has its own privacy policy. Ad partners may use cookies — see our{' '}
            <Link to="/cookies" className="link link-primary">Cookies Policy</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Your rights</h2>
          <p>
            You may delete your account from Profile settings. For data access or deletion requests,
            contact <a href="mailto:privacy@vibetalk.me" className="link link-primary">privacy@vibetalk.me</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Children</h2>
          <p>
            Vibe Talk is intended for users 18+ (or minimum age required in your country). We do not
            knowingly collect data from children.
          </p>
        </section>

        <p className="text-xs text-base-content/50 pt-4 border-t border-base-200">
          Related: <Link to="/legal" className="link">Terms</Link> ·{' '}
          <Link to="/safety" className="link">Safety</Link> ·{' '}
          <Link to="/contact" className="link">Contact</Link>
        </p>
      </article>
    </PublicLayout>
  );
};

export default PrivacyPage;
