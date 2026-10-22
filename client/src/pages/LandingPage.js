import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import AdBanner from '../components/AdBanner';
import {
  HERO_IMG,
  HERO_IMG_WEBP,
  GROUP_TOPICS,
  SEO_INTRO,
  SEO_MORE,
} from '../data/landingContent';

const STATS = [
  { icon: '⚡', title: '5 Seconds', desc: 'Instant 1-Click Connect' },
  { icon: '🔒', title: '100% Anonymous', desc: 'No Sign-up or Phone Needed' },
  { icon: '📹', title: 'HD WebRTC', desc: 'Browser Video & Audio Calls' },
  { icon: '🛡️', title: 'Zero Tolerance', desc: '1-Tap Anti-Harassment Tools' },
];

const CORE_PILLARS = [
  {
    icon: '🎲',
    badge: 'Popular',
    title: '1-on-1 Random Match',
    description:
      'Tap once to instantly connect with friendly strangers worldwide for spontaneous text or video conversations. If the vibe isn’t right, skip to the next person with a single click.',
    tag: 'Instant Match',
  },
  {
    icon: '📹',
    badge: 'HD Quality',
    title: 'Peer-to-Peer Video Calls',
    description:
      'Enjoy crystal-clear, low-latency video and voice chat directly in your browser. Strictly permission-based camera controls protect your privacy until you are comfortable.',
    tag: 'WebRTC Powered',
  },
  {
    icon: '👥',
    badge: 'Community',
    title: 'Interest-Based Groups',
    description:
      'Meet people who share your passions. Join active discussion groups for Gaming, Anime, Music, Travel, Tech, and more instead of old, spammy public chatrooms.',
    tag: 'Topic Hubs',
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Pick a Nickname',
    description: 'Jump straight in as a guest with just a nickname. No email, phone number, or passwords required.',
  },
  {
    step: '02',
    title: 'Choose Your Mode',
    description: 'Select Random Match for 1-on-1 conversations, browse the active Users List, or explore Topic Groups.',
  },
  {
    step: '03',
    title: 'Chat & Stay in Control',
    description: 'Start with text, move to video call if both agree, and use instant 1-tap block or report tools anytime.',
  },
];

const FAQS = [
  {
    q: 'Is Vibe Talk really 100% free to use?',
    a: 'Yes! All random matching, direct messaging, WebRTC video calling, and topic groups are completely free. There are no paywalls, coins, or hidden subscription fees.',
  },
  {
    q: 'Do I need to register or verify my phone number?',
    a: 'No. You can start chatting in seconds as a guest with just a nickname. You only need to create a full profile if you want to save connections and access custom settings.',
  },
  {
    q: 'How does Random Match work?',
    a: 'Our backend matchmaking engine pairs you with another active user waiting in the queue. Connections are ephemeral and private between the two participants.',
  },
  {
    q: 'Is it safe to chat and video call on Vibe Talk?',
    a: 'Safety is our highest priority. We enforce strict community guidelines with instant one-tap user blocking, active report moderation, and zero tolerance for harassment or inappropriate behavior.',
  },
  {
    q: 'Can I use Vibe Talk on mobile without downloading an app?',
    a: 'Absolutely! Vibe Talk is fully responsive and optimized for mobile browsers (Chrome, Safari, Firefox) on Android and iPhone with zero app downloads.',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [heroOk, setHeroOk] = useState(true);
  const [readMore, setReadMore] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    if (window.location.hash === '#start') {
      navigate('/start', { replace: true });
    }
  }, [navigate]);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <PublicLayout heroHeader>
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[min(90vh,780px)] flex items-center overflow-hidden bg-slate-950">
        {heroOk && (
          <picture className="absolute inset-0 w-full h-full">
            <source srcSet={HERO_IMG_WEBP} type="image/webp" />
            <img
              src={HERO_IMG}
              alt="Vibe Talk - Free random chat and stranger video call"
              fetchPriority="high"
              decoding="async"
              onError={() => setHeroOk(false)}
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-700"
            />
          </picture>
        )}

        {/* Smooth natural cinematic vignette */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/50 to-transparent"
          aria-hidden
        />

        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-20 w-full">
          <div className="max-w-xl">
            {/* Live Social Proof Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold mb-5 shadow-lg">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>1,420+ People Chatting Live Right Now</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-extrabold text-white leading-[1.12] mb-5 drop-shadow-md">
              Free Random Chat, Video Calls &amp; Meet Strangers Online
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-white/90 mb-8 font-normal leading-relaxed drop-shadow">
              Connect with friendly people worldwide in 5 seconds. Zero registration, no downloads — 100% free video, audio &amp; text chat.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/start"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-600 text-white font-extrabold px-8 py-4 rounded-xl shadow-xl hover:shadow-pink-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all text-base sm:text-lg group border border-white/20"
              >
                <span>Start Chatting Now</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-200">&rarr;</span>
              </Link>
              <div className="flex items-center justify-center gap-3 text-xs sm:text-sm text-white/80 font-medium">
                <span>🔒 100% Anonymous</span>
                <span>•</span>
                <span>⚡ 1-Click Connect</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS / TRUST BAR ================= */}
      <section className="bg-base-100 border-b border-base-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map((s) => (
              <div key={s.title} className="flex items-center gap-3 p-2">
                <span className="text-2xl sm:text-3xl shrink-0">{s.icon}</span>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-base-content leading-tight">{s.title}</h3>
                  <p className="text-xs text-base-content/60">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CORE VALUE PILLARS ================= */}
      <section className="py-16 bg-base-200/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content">
              Why People Love Chatting on Vibe Talk
            </h2>
            <p className="mt-3 text-sm sm:text-base text-base-content/70">
              A clean, modern alternative to outdated chat sites — built for genuine human connection without spam or bots.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {CORE_PILLARS.map((p) => (
              <div
                key={p.title}
                className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md hover:border-primary/40 transition-all rounded-2xl overflow-hidden"
              >
                <div className="card-body p-6 sm:p-7 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl p-2.5 rounded-xl bg-primary/10">{p.icon}</span>
                      <span className="badge badge-primary badge-sm font-semibold">{p.badge}</span>
                    </div>
                    <h3 className="text-lg font-bold text-base-content mb-2">{p.title}</h3>
                    <p className="text-sm text-base-content/70 leading-relaxed">{p.description}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-base-200/60 flex items-center justify-between">
                    <span className="text-xs font-medium text-base-content/50">{p.tag}</span>
                    <Link to="/start" className="text-xs font-bold text-primary hover:underline">
                      Try Now &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= AD SLOT 1 ================= */}
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-center">
        <AdBanner slot="public-inline" />
      </div>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-16 bg-base-100 border-y border-base-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content">
              How Vibe Talk Works
            </h2>
            <p className="mt-2 text-sm text-base-content/65">
              Start chatting in 3 easy steps — zero friction.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 relative">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div
                key={step.step}
                className="card bg-base-200/40 border border-base-200 p-6 rounded-2xl relative"
              >
                <span className="text-3xl font-black text-primary/30 mb-3 block">{step.step}</span>
                <h3 className="font-bold text-base sm:text-lg text-base-content mb-2">{step.title}</h3>
                <p className="text-sm text-base-content/70 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/start" className="btn btn-primary btn-wide font-bold">
              Get Started in 5 Seconds &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ================= EXPLORE GROUPS ================= */}
      <section className="py-16 bg-base-200/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content">
              Explore Popular Community Groups
            </h2>
            <p className="mt-2 text-sm text-base-content/65">
              Connect with people around shared topics. We use modern Groups — not old-school chatrooms.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {GROUP_TOPICS.map((g) => (
              <Link
                key={g.title}
                to="/start"
                className="group card bg-base-100 border border-base-200 hover:border-primary/50 hover:shadow-md transition-all rounded-xl p-4 text-left"
              >
                <span className="text-2xl mb-2 block">{g.icon}</span>
                <h3 className="font-bold text-sm text-base-content group-hover:text-primary leading-tight">
                  {g.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-base-content/55 mt-1 leading-snug">{g.desc}</p>
                <span className="text-xs font-semibold text-primary mt-2 block">Join Now &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= RESPECTFUL CHAT & SAFETY OVERVIEW ================= */}
      <section className="py-14 bg-base-100 border-t border-base-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card bg-gradient-to-br from-indigo-500/5 via-primary/5 to-pink-500/5 border border-primary/20 rounded-2xl p-6 sm:p-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-3xl mb-3 block">🛡️</span>
              <h2 className="text-xl sm:text-2xl font-bold text-base-content mb-3">
                A Respectful Community for Everyone
              </h2>
              <p className="text-sm sm:text-base text-base-content/75 leading-relaxed mb-4">
                Looking for friendly conversations, language practice, or respectful chats? Vibe Talk provides a safe environment for genuine human connections. We prioritize consent, mutual respect, and give you 1-tap controls to block or report anyone who behaves inappropriately.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/safety" className="btn btn-sm btn-outline btn-primary">
                  Safety Guidelines &rarr;
                </Link>
                <Link to="/community-guidelines" className="btn btn-sm btn-ghost text-base-content/70">
                  Community Rules &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMPREHENSIVE SEO CONTEXT (COLLAPSIBLE) ================= */}
      <section className="py-12 bg-base-200/20 border-t border-base-200">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-lg font-bold text-base-content mb-3 text-center sm:text-left">
            About Vibe Talk Free Online Chat
          </h2>
          <div className="text-xs sm:text-sm text-base-content/70 leading-relaxed space-y-3">
            <p>{SEO_INTRO}</p>
            {readMore && <p>{SEO_MORE}</p>}
          </div>
          <button
            type="button"
            onClick={() => setReadMore(!readMore)}
            className="mt-3 text-xs sm:text-sm font-semibold text-primary hover:underline"
          >
            {readMore ? 'Show less ↑' : 'Read more about Vibe Talk ↓'}
          </button>
        </div>
      </section>

      {/* ================= AD SLOT 2 ================= */}
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-center">
        <AdBanner slot="public-inline" />
      </div>

      {/* ================= FAQS ACCORDION (SEO & USER FRIENDLY) ================= */}
      <section className="py-16 bg-base-100 border-t border-base-200">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-base-content/65">
              Everything you need to know before getting started.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={faq.q}
                className="border border-base-200 rounded-xl overflow-hidden bg-base-200/30 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className="w-full px-5 py-4 text-left font-bold text-sm sm:text-base text-base-content flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <span className="text-primary text-lg font-mono shrink-0">
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-base-content/75 leading-relaxed border-t border-base-200/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CONVERSION CARD ================= */}
      <section className="py-16 bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Ready to Meet Someone New?
          </h2>
          <p className="text-white/80 text-sm sm:text-base mb-8 max-w-xl mx-auto">
            Join thousands of friendly people chatting right now. Free, instant, and 100% private.
          </p>
          <Link
            to="/start"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-extrabold px-9 py-4 rounded-xl shadow-2xl hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all text-base sm:text-lg border border-white/20"
          >
            <span>Start Chatting in 1-Click</span>
            <span>&rarr;</span>
          </Link>
          <p className="text-xs text-white/50 mt-4">
            No registration needed · Works in browser on Mobile &amp; PC
          </p>
        </div>
      </section>
    </PublicLayout>
  );
};

export default LandingPage;
