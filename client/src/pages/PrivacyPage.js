import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import PublicPageHero from '../components/PublicPageHero';

const PRIVACY_SECTIONS = [
  {
    title: '1. Information We Collect & Why',
    content: (
      <>
        <p className="mb-2">
          At <strong>Vibe Talk (vibetalk.me)</strong>, our core philosophy is data minimization. When you use our service, we only collect information strictly necessary to facilitate real-time chat and enforce community safety:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
          <li><strong>Guest Account Data:</strong> Nickname and self-selected gender indicator. We do not require phone numbers, email addresses, or government identification to start chatting.</li>
          <li><strong>Profile Account Data (Optional):</strong> If you choose to create a registered profile, you may optionally provide a display name, date of birth (to verify 18+ eligibility), bio, and profile picture.</li>
          <li><strong>Real-Time Communications:</strong> Text messages exchanged during active chat sessions. Peer-to-peer WebRTC video and audio streams travel directly between client browsers and are never recorded or stored on central servers.</li>
          <li><strong>Technical &amp; Log Data:</strong> Temporary IP addresses, browser user agent strings, device screen dimensions, and connection timestamps used solely to prevent denial-of-service (DoS) attacks, detect bot abuse, and enforce bans against hostile actors.</li>
        </ul>
      </>
    ),
  },
  {
    title: '2. Video Calling & WebRTC Peer-to-Peer Encryption',
    content: (
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        Live video and audio conversations on Vibe Talk are conducted utilizing the open WebRTC standard. Media packets are encrypted end-to-end between peer connections using DTLS-SRTP. Our servers act merely as signaling conduits (to establish initial handshake exchange). We do not record, listen to, inspect, or archive user video or audio streams under any circumstances.
      </p>
    ),
  },
  {
    title: '3. Third-Party Service Providers & Advertising',
    content: (
      <>
        <p className="mb-2 text-xs sm:text-sm text-slate-600">
          Vibe Talk remains 100% free for all users worldwide. To maintain server bandwidth, matchmaking infrastructure, and moderation systems, we partner with trusted third-party providers:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
          <li><strong>Google AdSense:</strong> Serves contextual and non-intrusive display ads. Google uses cookies (such as the DoubleClick cookie) to serve relevant advertisements based on visits to this and other websites.</li>
          <li><strong>Cloud Infrastructure:</strong> We utilize hardened cloud hosting (Render, MongoDB Atlas) with strict encrypted storage at rest.</li>
          <li><strong>Analytics:</strong> Aggregated, privacy-respecting metrics to assess server latency and feature adoption without personal profiling.</li>
        </ul>
      </>
    ),
  },
  {
    title: '4. International Data Rights (GDPR & CCPA Compliance)',
    content: (
      <>
        <p className="mb-2 text-xs sm:text-sm text-slate-600">
          Depending on your location, you have statutory rights concerning your personal data:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
          <li><strong>Right to Access &amp; Portability:</strong> Request confirmation of what data we hold concerning your account.</li>
          <li><strong>Right to Erasure (Right to be Forgotten):</strong> You can permanently delete your profile at any time from Profile Settings or email privacy@vibetalk.me for immediate record purging.</li>
          <li><strong>Right to Restrict or Object:</strong> Control non-essential cookies and targeted advertising preferences via our Cookies Policy settings.</li>
        </ul>
      </>
    ),
  },
  {
    title: '5. Child Safety & COPPA (Strict 18+ Restriction)',
    content: (
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        Vibe Talk is strictly intended for individuals who are 18 years of age or older (or the legal age of majority in your jurisdiction). We do not knowingly solicit or collect data from minors under 18. Any accounts discovered to belong to a minor are immediately terminated and permanently purged. Suspected child exploitation or endangerment is reported directly to the National Center for Missing &amp; Exploited Children (NCMEC) and relevant law enforcement agencies.
      </p>
    ),
  },
];

const PrivacyPage = () => {
  useEffect(() => {
    document.title = 'Privacy Policy & Data Protection — Vibe Talk | vibetalk.me';
  }, []);

  return (
    <PublicLayout>
      <PublicPageHero
        title="Privacy Policy"
        subtitle="How we safeguard your anonymity, personal data, and peer-to-peer communications."
        emoji="🔒"
      />

      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16 space-y-10">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 text-xs text-slate-500">
          <span>Effective Date: October 2026</span>
          <span>Platform: vibetalk.me</span>
        </div>

        <section className="space-y-8">
          {PRIVACY_SECTIONS.map((sec) => (
            <div key={sec.title} className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">{sec.title}</h2>
              <div className="text-slate-600 leading-relaxed">{sec.content}</div>
            </div>
          ))}
        </section>

        {/* Contact Desk */}
        <section className="bg-slate-50/70 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-3">
          <h3 className="text-base font-bold text-slate-900">Contacting Our Data Protection Officer</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            If you have questions, feedback, or requests regarding this Privacy Policy or your data rights, please contact our dedicated Privacy Desk at{' '}
            <a href="mailto:privacy@vibetalk.me" className="text-indigo-600 font-bold hover:underline">
              privacy@vibetalk.me
            </a>.
          </p>
        </section>

        <section className="border-t border-slate-200 pt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <Link to="/legal" className="text-indigo-600 font-semibold hover:underline">
              Terms &amp; Conditions &rarr;
            </Link>
            <Link to="/safety" className="text-indigo-600 font-semibold hover:underline">
              Safety Guidelines &rarr;
            </Link>
            <Link to="/cookies" className="text-indigo-600 font-semibold hover:underline">
              Cookies Policy &rarr;
            </Link>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default PrivacyPage;