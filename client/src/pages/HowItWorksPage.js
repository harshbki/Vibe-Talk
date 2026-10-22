import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import PublicPageHero from '../components/PublicPageHero';

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Choose a Nickname (Guest Mode)',
    badge: '10 Seconds',
    desc: 'Visit Start Chat and enter any friendly nickname. No phone number, email address, password, or credit card is ever required. Your session is temporary and private.',
  },
  {
    step: '02',
    title: 'Select Your Chat Preference',
    badge: 'Flexible',
    desc: 'Hit "Random Match" to be instantly paired 1-on-1 with another active stranger, browse the live Users List, or jump into curated topic Groups (Gaming, Music, Anime, etc.).',
  },
  {
    step: '03',
    title: 'Connect via Text or Live Video',
    badge: 'WebRTC HD',
    desc: 'Begin with spontaneous text chat. When both participants agree, initiate an encrypted WebRTC video call directly in your browser with full camera and mic controls.',
  },
  {
    step: '04',
    title: 'Stay in Full Control (Skip or Block)',
    badge: 'Safety',
    desc: 'If the conversation is not your vibe, tap "Next" to leave instantly. One-tap reporting and blocking protect your experience from bad actors permanently.',
  },
];

const COMPARISON = [
  { feature: 'Mandatory Phone / Email Verification', vibetalk: '❌ Never required (Guest Mode)', others: '⚠️ Often demanded' },
  { feature: 'App / Software Downloads Required', vibetalk: '❌ None (Runs 100% in Browser)', others: '⚠️ Forced APK / App downloads' },
  { feature: 'Live Video Technology', vibetalk: '✅ Encrypted Peer-to-Peer WebRTC', others: '⚠️ Often routed via unverified proxies' },
  { feature: 'Hidden Paywalls & Tokens', vibetalk: '✅ 100% Free Core Features', others: '⚠️ Paywalls after a few minutes' },
  { feature: 'Proactive Community Moderation', vibetalk: '✅ 1-Tap Block & 24hr Report SLA', others: '❌ Often filled with bots and spam' },
];

const HowItWorksPage = () => {
  useEffect(() => {
    document.title = 'How Vibe Talk Works — Step-by-Step Online Chat & Video Call Guide | vibetalk.me';
  }, []);

  return (
    <PublicLayout>
      <PublicPageHero
        emoji="✨"
        title="How Vibe Talk Works"
        subtitle="Start genuine, fun, and safe conversations online in just a few simple steps."
      />
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16 space-y-12">
        {/* Intro Overview */}
        <section className="text-center max-w-2xl mx-auto">
          <span className="badge badge-primary badge-sm font-semibold">User Guide</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content mt-2 mb-3">
            Effortless Online Chat Without Complications
          </h2>
          <p className="text-sm sm:text-base text-base-content/75 leading-relaxed">
            Vibe Talk brings together the spontaneity of classic random chat with modern WebRTC security, fast Socket.IO matchmaking, and interest-based groups.
          </p>
        </section>

        {/* 4 Steps Grid */}
        <section className="grid sm:grid-cols-2 gap-4">
          {WORKFLOW_STEPS.map((s) => (
            <div key={s.step} className="card bg-base-100 border border-base-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black text-primary/40 font-mono">{s.step}</span>
                  <span className="badge badge-ghost badge-sm font-semibold">{s.badge}</span>
                </div>
                <h3 className="font-bold text-base text-base-content mb-2">{s.title}</h3>
                <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Comparison Table (Google SEO & User Clarity) */}
        <section className="card bg-base-200/40 border border-base-200 p-6 sm:p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-base-content mb-2 text-center sm:text-left">
            How Vibe Talk Compares to Legacy Chat Platforms
          </h2>
          <p className="text-xs sm:text-sm text-base-content/65 mb-6 text-center sm:text-left">
            Why thousands of people choose Vibe Talk over outdated, spammy alternatives.
          </p>
          <div className="overflow-x-auto">
            <table className="table table-sm sm:table-md w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-base-300">
                  <th className="font-bold text-base-content">Platform Feature</th>
                  <th className="font-bold text-primary">Vibe Talk (vibetalk.me)</th>
                  <th className="font-bold text-base-content/60">Other Clones &amp; Apps</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="border-b border-base-200/60">
                    <td className="font-medium text-base-content">{row.feature}</td>
                    <td className="font-semibold text-primary">{row.vibetalk}</td>
                    <td className="text-base-content/60">{row.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bottom CTA Box */}
        <section className="card bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 p-8 rounded-2xl text-center space-y-4">
          <h2 className="text-2xl font-extrabold text-base-content">
            Ready to Connect with New People?
          </h2>
          <p className="text-xs sm:text-sm text-base-content/70 max-w-lg mx-auto">
            No registration required. Enter a nickname and join thousands chatting right now.
          </p>
          <div>
            <Link to="/start" className="btn btn-primary font-bold px-8">
              Start Chatting in 5 Seconds &rarr;
            </Link>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default HowItWorksPage;
