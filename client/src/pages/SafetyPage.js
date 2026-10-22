import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import PublicPageHero from '../components/PublicPageHero';

const SAFETY_PILLARS = [
  {
    icon: '🔞',
    title: 'Strict 18+ Policy',
    desc: 'Vibe Talk is strictly intended for adults aged 18 and older. We actively moderate and terminate accounts suspected of being operated by minors.',
  },
  {
    icon: '🚫',
    title: 'Zero Tolerance for Exploitation',
    desc: 'Any distribution or solicitation of Child Sexual Abuse Material (CSAM), non-consensual imagery, or sexual extortion results in an immediate permanent ban and referral to law enforcement and NCMEC.',
  },
  {
    icon: '⛔',
    title: '1-Tap User Blocking',
    desc: 'You can instantly disconnect and block any user with a single tap. Blocked users can never be matched with you again or send you messages.',
  },
  {
    icon: '🔒',
    title: 'Ephemeral WebRTC Privacy',
    desc: 'Video and voice calls are streamed directly between peer browsers via WebRTC encryption. We never record, intercept, or store live video streams on our servers.',
  },
];

const CRISIS_HELPLINES = [
  { region: 'United States & Canada', service: '988 Suicide & Crisis Lifeline', contact: 'Call or text 988 (Available 24/7)' },
  { region: 'India', service: 'Vandrevala Foundation Helpline', contact: '+91 9999 666 555 / National Emergency: 112' },
  { region: 'United Kingdom', service: 'Samaritans', contact: 'Call 116 123 (Free, 24/7)' },
  { region: 'International', service: 'Befrienders Worldwide', contact: 'Visit www.befrienders.org for global hotlines' },
];

const SafetyPage = () => {
  useEffect(() => {
    document.title = 'Safety Center — Vibe Talk | Online Chat Safety & Trust | vibetalk.me';
  }, []);

  return (
    <PublicLayout>
      <PublicPageHero
        title="Safety & Trust Center"
        subtitle="Practical guidelines, safety tools, and policies to protect your wellbeing on Vibe Talk."
        emoji="🛡️"
      />
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16 space-y-12">
        {/* Core Safety Commitment */}
        <section className="space-y-4">
          <span className="badge badge-primary badge-sm font-semibold">User Protection</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content">
            Your Digital Safety Is Our Number One Priority
          </h2>
          <p className="text-base sm:text-lg text-base-content/75 leading-relaxed">
            Meeting people online should be fun, uplifting, and safe. Vibe Talk is dedicated to maintaining a female-friendly, harassment-free environment where every conversation is consensual.
          </p>
        </section>

        {/* 4 Safety Pillars */}
        <section className="grid sm:grid-cols-2 gap-4">
          {SAFETY_PILLARS.map((p) => (
            <div key={p.title} className="card bg-base-100 border border-base-200 p-6 rounded-2xl shadow-sm">
              <span className="text-3xl mb-3 block">{p.icon}</span>
              <h3 className="font-bold text-base text-base-content mb-1">{p.title}</h3>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </section>

        {/* Essential Cyber-Safety Checklist */}
        <section className="card bg-base-200/40 border border-base-200 p-6 sm:p-8 rounded-2xl space-y-6">
          <h2 className="text-xl font-bold text-base-content">Essential Safety Rules for Random Chat</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm text-base-content/80">
            <div className="space-y-2">
              <p><strong>1. Keep Personal Details Private:</strong> Never reveal your full legal name, home address, school, phone number, or passwords.</p>
              <p><strong>2. Check Your Background:</strong> Before turning on video, verify that no personal documents, IDs, house numbers, or family photos are visible.</p>
            </div>
            <div className="space-y-2">
              <p><strong>3. Never Send Money or Gifts:</strong> Scammers often use sob stories or fake emergencies. Never transfer funds or cryptocurrency to strangers.</p>
              <p><strong>4. Beware of External Links:</strong> Do not click on external links sent in chat, which may contain phishing or malware.</p>
            </div>
          </div>
        </section>

        {/* Crisis Helplines Directory (Google EEAT & Safety Compliance) */}
        <section className="border-t border-base-200 pt-8 space-y-4">
          <h2 className="text-xl font-bold text-base-content">Mental Health &amp; Crisis Support Resources</h2>
          <p className="text-xs sm:text-sm text-base-content/70">
            If you or someone you meet on Vibe Talk is experiencing emotional distress or considering self-harm, free confidential support is available 24/7 worldwide:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {CRISIS_HELPLINES.map((h) => (
              <div key={h.region} className="p-4 bg-base-100 border border-base-200 rounded-xl">
                <span className="text-xs font-bold text-primary block">{h.region}</span>
                <span className="font-semibold text-sm text-base-content block">{h.service}</span>
                <span className="text-xs text-base-content/60">{h.contact}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How to Report Abuse */}
        <section className="card bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-base-content">Encountered Inappropriate Behavior?</h3>
            <p className="text-xs sm:text-sm text-base-content/70 mt-1">
              Tap the report flag in any chat, or email our dedicated safety team at{' '}
              <a href="mailto:safety@vibetalk.me" className="link link-primary font-semibold">safety@vibetalk.me</a>.
              We review and action all reports within 24 hours.
            </p>
          </div>
          <Link to="/start" className="btn btn-primary font-bold shrink-0">
            Start Chatting Safely &rarr;
          </Link>
        </section>
      </div>
    </PublicLayout>
  );
};

export default SafetyPage;
