import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import PublicPageHero from '../components/PublicPageHero';
import { GROUP_TOPICS } from '../data/landingContent';

const CORE_VALUES = [
  {
    icon: '🔒',
    title: 'Privacy by Design',
    desc: 'You can start chatting as a guest with just a nickname. We never require phone numbers, credit cards, or mandatory social log-ins.',
  },
  {
    icon: '⚡',
    title: 'Peer-to-Peer WebRTC',
    desc: 'Video and audio calls connect directly between browsers via encrypted WebRTC. Streams never touch or get stored on central servers.',
  },
  {
    icon: '🛡️',
    title: 'Safety & Respect First',
    desc: 'Proactive anti-harassment tools, instant one-tap user blocking, and responsive review teams keep conversations clean and welcoming.',
  },
  {
    icon: '🌍',
    title: 'Global Community',
    desc: 'Connect with people across 190+ countries for genuine friendship, cultural exchange, and language practice without spam or bots.',
  },
];

const AboutPage = () => {
  useEffect(() => {
    document.title = 'About Vibe Talk — Free Random Chat, Video Calls & Community | vibetalk.me';
  }, []);

  return (
    <PublicLayout>
      <PublicPageHero
        emoji="💬"
        title="About Vibe Talk"
        subtitle="A modern, safe, and browser-based platform to meet genuine friends worldwide."
      />
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16 space-y-12">
        {/* Story Section */}
        <section className="space-y-4">
          <span className="badge badge-primary badge-sm font-semibold">Our Mission</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content">
            Reimagining Online Conversations for a Safer Web
          </h2>
          <p className="text-base sm:text-lg text-base-content/75 leading-relaxed">
            Following the shutdown of classic stranger-chat websites like Omegle in late 2023, the internet was left flooded with ad-heavy, bot-filled, and unsafe clone sites. <strong>Vibe Talk (vibetalk.me)</strong> was built from the ground up to offer a clean, respectful, and technologically modern alternative.
          </p>
          <p className="text-sm sm:text-base text-base-content/70 leading-relaxed">
            We believe that meeting people online should feel effortless, spontaneous, and above all, safe. Vibe Talk combines anonymous guest text chat, peer-to-peer WebRTC video calling, and interest-based topic communities into one seamless web application that requires zero app downloads.
          </p>
        </section>

        {/* 4 Core Pillars Grid */}
        <section>
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-base-content">Our Core Principles</h2>
            <p className="text-xs sm:text-sm text-base-content/60 mt-1">What guides every feature we build on Vibe Talk.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {CORE_VALUES.map((val) => (
              <div key={val.title} className="card bg-base-100 border border-base-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <span className="text-3xl mb-3 block">{val.icon}</span>
                <h3 className="font-bold text-base text-base-content mb-1">{val.title}</h3>
                <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack & Architecture Transparency */}
        <section className="card bg-base-200/40 border border-base-200 p-6 sm:p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-base-content mb-3">Modern &amp; Secure Architecture</h2>
          <p className="text-sm text-base-content/70 leading-relaxed mb-4">
            Vibe Talk is powered by modern, reliable web technologies engineered for speed, low-latency streaming, and data security:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-base-100 rounded-xl border border-base-200">
              <span className="font-bold text-sm block">React 18</span>
              <span className="text-xs text-base-content/50">Fast SPA UI</span>
            </div>
            <div className="p-3 bg-base-100 rounded-xl border border-base-200">
              <span className="font-bold text-sm block">WebRTC</span>
              <span className="text-xs text-base-content/50">Direct P2P Video</span>
            </div>
            <div className="p-3 bg-base-100 rounded-xl border border-base-200">
              <span className="font-bold text-sm block">Socket.IO</span>
              <span className="text-xs text-base-content/50">Instant Match</span>
            </div>
            <div className="p-3 bg-base-100 rounded-xl border border-base-200">
              <span className="font-bold text-sm block">Node / Express</span>
              <span className="text-xs text-base-content/50">Hardened API</span>
            </div>
          </div>
        </section>

        {/* Groups Preview */}
        <section id="groups" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-2">Community Groups on Vibe Talk</h2>
          <p className="text-sm text-base-content/65 mb-6">
            Beyond 1-on-1 stranger matching, discover topic-based groups to connect with like-minded peers:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {GROUP_TOPICS.map((g) => (
              <div key={g.title} className="card bg-base-100 border border-base-200 p-3.5 rounded-xl">
                <span className="text-xl mb-1">{g.icon}</span>
                <h3 className="font-bold text-xs text-base-content leading-tight">{g.title}</h3>
                <p className="text-[10px] text-base-content/55 mt-0.5 leading-snug">{g.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center sm:text-left">
            <Link to="/start" className="btn btn-primary font-bold">
              Start Chatting Free &rarr;
            </Link>
          </div>
        </section>

        {/* Trust & Safety Reference Footer */}
        <section className="text-xs sm:text-sm text-base-content/60 border-t border-base-200 pt-6 flex flex-wrap items-center justify-between gap-4">
          <p>
            Have questions or feedback? Check our <Link to="/safety" className="link link-primary">Safety Center</Link>,{' '}
            <Link to="/community-guidelines" className="link link-primary">Community Guidelines</Link>, or{' '}
            <Link to="/contact" className="link link-primary">Contact Support</Link>.
          </p>
          <span className="text-base-content/40">&copy; 2026 Vibe Talk</span>
        </section>
      </div>
    </PublicLayout>
  );
};

export default AboutPage;
