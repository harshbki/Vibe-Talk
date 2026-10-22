import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import PublicPageHero from '../components/PublicPageHero';

const GUIDELINE_PILLARS = [
  {
    icon: '🤝',
    title: 'Mutual Respect & Civility',
    rule: 'Treat every user with dignity. Hate speech, racism, misogyny, body shaming, and discriminatory remarks are strictly prohibited.',
    details: 'Vibe Talk is an international melting pot of cultures, backgrounds, and languages. Disagreements must remain respectful.',
  },
  {
    icon: '🛡️',
    title: 'Zero Tolerance for Harassment',
    rule: 'No bullying, stalking, aggressive unwanted messaging, or intimidation.',
    details: 'If someone skips, declines to chat, or expresses discomfort, continuing to pursue them or creating alternate accounts is treated as harassment.',
  },
  {
    icon: '🚫',
    title: 'Explicit Content & CSAM Ban',
    rule: 'Strict prohibition on unsolicited nudity, sexual acts, obscene gestures, and exploitation.',
    details: 'Child Sexual Abuse Material (CSAM) or any exploitation of minors results in immediate permanent blacklisting and mandatory reporting to law enforcement authorities (NCMEC / Cyber Crime divisions).',
  },
  {
    icon: '🤖',
    title: 'Anti-Bot & Anti-Spam Policy',
    rule: 'Automated bots, phishing links, commercial advertising, and crypto/forex scams are strictly banned.',
    details: 'Accounts attempting to script connections or post repetitive commercial promos are automatically trapped and banned by our heuristic filters.',
  },
  {
    icon: '🔒',
    title: 'Consent & Personal Privacy',
    rule: 'Never record, screenshot, or distribute another user’s live video feed without their explicit written consent.',
    details: 'Doxxing, sharing real names, phone numbers, addresses, social handles, or school/workplace information of strangers without permission is grounds for instant expulsion.',
  },
  {
    icon: '✨',
    title: 'Friendship & Cultural Exchange',
    rule: 'Vibe Talk is built for casual conversation, language learning, and genuine social connection — not predatory dating.',
    details: 'Respect other people’s personal boundaries. Conversations should remain consensual, positive, and enjoyable for both parties.',
  },
];

const CommunityGuidelinesPage = () => {
  useEffect(() => {
    document.title = 'Community Guidelines & Safety Standards — Vibe Talk | vibetalk.me';
  }, []);

  return (
    <PublicLayout>
      <PublicPageHero
        title="Community Guidelines"
        subtitle="Our code of conduct for keeping Vibe Talk safe, friendly, and respectful for everyone worldwide."
        emoji="🤝"
      />

      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16 space-y-12">
        {/* Intro */}
        <section className="text-center max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2 border border-indigo-100">
            Safety Code
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Building a Kind &amp; Respectful Community
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Every day, thousands of people connect on Vibe Talk to talk about gaming, share travel stories, and make new international friends. These guidelines ensure our space remains safe, welcoming, and female-friendly.
          </p>
        </section>

        {/* 6 Core Pillars Grid */}
        <section className="grid sm:grid-cols-2 gap-5">
          {GUIDELINE_PILLARS.map((p) => (
            <div
              key={p.title}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl p-2.5 rounded-xl bg-slate-50 border border-slate-100">{p.icon}</span>
                <h3 className="font-bold text-base text-slate-900">{p.title}</h3>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-indigo-700 mb-2 leading-snug">{p.rule}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{p.details}</p>
            </div>
          ))}
        </section>

        {/* Moderation & Enforcement Process */}
        <section className="bg-slate-50/70 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">How We Enforce Community Guidelines</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Our safety infrastructure utilizes a multi-layered approach combining automated machine heuristics with fast human review workflows:
          </p>
          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-white rounded-xl border border-slate-200 text-center">
              <span className="text-2xl block mb-1">⚡</span>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">1-Tap Instant Block</h4>
              <p className="text-[11px] text-slate-500 mt-1">Users can sever connections instantly with zero contact retention.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 text-center">
              <span className="text-2xl block mb-1">🔍</span>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">Automated Heuristics</h4>
              <p className="text-[11px] text-slate-500 mt-1">Spam text, bot links, and repetitive phrases are blocked proactively.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 text-center">
              <span className="text-2xl block mb-1">⚖️</span>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">Fast Escalation</h4>
              <p className="text-[11px] text-slate-500 mt-1">Reported infractions receive action within 12–24 hours.</p>
            </div>
          </div>
        </section>

        {/* Appeals & Contact */}
        <section className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div>
            <p className="font-bold text-slate-800">Believe your account was flagged in error?</p>
            <p>You may submit an appeal by emailing our Trust &amp; Safety desk at safety@vibetalk.me.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/safety" className="font-bold text-indigo-600 hover:underline">
              Safety Center &rarr;
            </Link>
            <Link to="/contact" className="font-bold text-indigo-600 hover:underline">
              Contact Support &rarr;
            </Link>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default CommunityGuidelinesPage;