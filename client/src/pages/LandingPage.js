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

const QUICK_PILLS = [
  { icon: '⚡', label: '1-Click Match' },
  { icon: '🔒', label: 'Zero Sign-up' },
  { icon: '📹', label: 'Cam-to-Cam HD' },
  { icon: '🛡️', label: 'Female-Friendly & Safe' },
  { icon: '🌍', label: '190+ Countries' },
];

const BENTO_FEATURES = [
  {
    icon: '🎲',
    badge: 'Spontaneous Match',
    title: '1-on-1 Instant Random Match',
    desc: 'Hit Match to instantly connect with real, friendly people worldwide. Whether you want quick casual text or face-to-face video, skip to the next person anytime with zero awkwardness.',
    highlight: 'Instant 1-Tap Connect',
    color: 'border-pink-200/80 hover:border-pink-400 bg-pink-50/30',
    tagColor: 'bg-pink-100 text-pink-700',
  },
  {
    icon: '📹',
    badge: 'P2P Encrypted',
    title: 'Cam-to-Cam HD Video & Audio',
    desc: 'Experience high-definition video chat with low latency right inside your browser. No third-party software or plugins required. Your camera stays off until you choose to enable it.',
    highlight: 'Encrypted WebRTC Streams',
    color: 'border-indigo-200/80 hover:border-indigo-400 bg-indigo-50/30',
    tagColor: 'bg-indigo-100 text-indigo-700',
  },
  {
    icon: '🛡️',
    badge: 'Clean Community',
    title: 'Female-Friendly & Anti-Harassment',
    desc: 'Say goodbye to creeps, bots, and unmoderated spam. Vibe Talk features 1-tap instant blocking, AI content protection, and zero tolerance for inappropriate behavior.',
    highlight: '1-Tap Block & Report',
    color: 'border-emerald-200/80 hover:border-emerald-400 bg-emerald-50/30',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    icon: '👥',
    badge: 'Shared Passions',
    title: 'Interest Groups & Hangout Hubs',
    desc: 'Looking to talk about specific topics? Join active community hubs for Anime, Gaming, Music, Travel, and Late Night chill talks with people who share your vibe.',
    highlight: '15+ Active Categories',
    color: 'border-amber-200/80 hover:border-amber-400 bg-amber-50/30',
    tagColor: 'bg-amber-100 text-amber-700',
  },
];

const KEYWORD_HIGHLIGHTS = [
  {
    title: 'Random Chat with Strangers',
    desc: 'Talk with strangers online safely and anonymously. Discover international perspectives, practice new languages, and make genuine friends across the globe.',
  },
  {
    title: 'Best Free Omegle Alternative',
    desc: 'Looking for a cleaner, modern Omegle replacement? Vibe Talk delivers instant stranger video chat without annoying captchas, coins, or predatory subscription traps.',
  },
  {
    title: 'Chat with Girls & Diverse People',
    desc: 'A respectful, female-friendly space where women and men can chat comfortably without being bombarded by vulgar bots or unsolicited harassment.',
  },
  {
    title: 'No Login & No App Download',
    desc: 'Works seamlessly on mobile browsers (Android Chrome, iOS Safari) as well as desktop. Start chatting in 3 seconds as a guest with just a nickname.',
  },
];

const WORKFLOW_STEPS = [
  {
    step: '1',
    emoji: '✨',
    title: 'Choose a Nickname',
    desc: 'No email, phone number, or password required. Pick any fun nickname to start as an anonymous guest.',
  },
  {
    step: '2',
    emoji: '🎯',
    title: 'Pick Your Chat Mode',
    desc: 'Choose 1-on-1 Random Match, browse live online users, or jump straight into topic-based group rooms.',
  },
  {
    step: '3',
    emoji: '🎉',
    title: 'Connect & Vibe',
    desc: 'Chat via text, switch on your camera whenever you feel comfortable, or tap Next to meet someone new.',
  },
];

const FAQS = [
  {
    q: 'Is Vibe Talk really 100% free?',
    a: 'Yes, 100% free! All random matching, text messaging, WebRTC video calling, and topic groups are free. No paywalls, coins, or hidden subscription traps.',
  },
  {
    q: 'Do I need to sign up or download an app?',
    a: 'Zero sign-up and zero downloads. You can chat as a guest in 3 seconds straight from your iPhone, Android, tablet, or PC browser.',
  },
  {
    q: 'How does Random Matching work?',
    a: 'Our high-speed matchmaking engine connects you 1-on-1 with another live user waiting in queue. Sessions are private and direct between the two of you.',
  },
  {
    q: 'Is Vibe Talk a safe Omegle alternative?',
    a: 'Yes! Vibe Talk was built to replace chaotic legacy chat apps with a clean, female-friendly experience featuring instant blocking, active report moderation, and zero tolerance for harassment.',
  },
  {
    q: 'Are my video calls recorded or stored?',
    a: 'Never. Video calls use peer-to-peer WebRTC encryption, meaning streams travel directly between you and your partner. We never record, inspect, or save your video calls.',
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
    <PublicLayout>
      {/* ================= HERO SECTION (CLEAN 2026 WHITE UI) ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 via-purple-50/30 to-white pt-10 pb-16 sm:py-20 border-b border-slate-200/70">
        {/* Soft Ambient Background Glow */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: Punchy Copy & Instant CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Live Ticker Pill */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-slate-800 text-xs sm:text-sm font-semibold mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>1,420+ People Vibing Live Right Now</span>
              </div>

              {/* High-Impact Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-black text-slate-900 tracking-tight leading-[1.15] mb-5">
                Talk to Strangers &amp;{' '}
                <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Video Chat Live
                </span>{' '}
                Online
              </h1>

              {/* Subtitle with Key Search Terms */}
              <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Meet cool, friendly people worldwide in 3 seconds. Instant 1-on-1 random match, live cam-to-cam video, and anonymous text chat. Zero registration, no downloads, 100% free.
              </p>

              {/* Primary Call to Action Button Group */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                <Link
                  to="/start"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:brightness-110 text-white font-black px-9 py-4 rounded-2xl shadow-xl shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all text-base sm:text-lg group"
                >
                  <span>⚡ Start Chatting in 1-Click</span>
                  <span className="group-hover:translate-x-1.5 transition-transform duration-200">&rarr;</span>
                </Link>
                <Link
                  to="/how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm sm:text-base shadow-xs transition-all"
                >
                  How It Works &rarr;
                </Link>
              </div>

              {/* Quick Feature Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
                {QUICK_PILLS.map((pill) => (
                  <span
                    key={pill.label}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 text-slate-700 shadow-xs"
                  >
                    <span>{pill.icon}</span>
                    <span>{pill.label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Modern Aesthetic Hero Banner with Floating Live Badges */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                
                {/* Visual Frame */}
                <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl shadow-indigo-500/15 bg-slate-100 group">
                  {heroOk && (
                    <picture>
                      <source srcSet={HERO_IMG_WEBP} type="image/webp" />
                      <img
                        src={HERO_IMG}
                        alt="Friends video chatting live on Vibe Talk stranger chat platform"
                        width="480"
                        height="430"
                        fetchPriority="high"
                        decoding="async"
                        onError={() => setHeroOk(false)}
                        className="w-full h-[370px] sm:h-[430px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                    </picture>
                  )}

                  {/* Gradient bottom scrim for card badges */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/20 pointer-events-none" />

                  {/* Floating Top Badge */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-md">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Live Match: Connected</span>
                  </div>

                  {/* Floating Top Right Location */}
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/15 text-white/90 text-xs font-semibold shadow-md">
                    <span>🌍</span>
                    <span>Global Chatters</span>
                  </div>

                  {/* Floating Bottom Card Over Image */}
                  <div className="absolute bottom-4 inset-x-4 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/50 shadow-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white text-lg font-black shrink-0">
                        👋
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-tight">Instant Stranger Connect</p>
                        <p className="text-[11px] text-slate-500">Skip anytime if vibe is off</p>
                      </div>
                    </div>
                    <Link
                      to="/start"
                      className="inline-flex items-center gap-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-sm hover:brightness-110 shrink-0"
                    >
                      <span>Say Hi</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>

                {/* Decorative Soft Neon Blobs */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-pink-500/15 rounded-full blur-2xl -z-10" />
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl -z-10" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= KEYWORD HIGHLIGHT STRIP (SEO & SEARCH VISIBILITY) ================= */}
      <section className="py-12 bg-slate-50/60 border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {KEYWORD_HIGHLIGHTS.map((item) => (
              <div
                key={item.title}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold text-sm text-slate-900 mb-1.5 flex items-center gap-2">
                  <span className="text-indigo-600 font-bold">✓</span>
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BENTO GRID 2.0 (FEATURES & VALUE) ================= */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold uppercase tracking-wider mb-3 border border-indigo-100">
              Next-Gen Stranger Chat
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Why Millions Choose Vibe Talk for Random Chat
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Clean vibes only. Everything you love about random stranger video chat — minus the creepy bots, predatory paywalls, and unmoderated chaos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {BENTO_FEATURES.map((b) => (
              <div
                key={b.title}
                className={`card bg-white border p-6 sm:p-8 rounded-3xl shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${b.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl p-3 rounded-2xl bg-white shadow-xs border border-slate-100">{b.icon}</span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${b.tagColor}`}>{b.badge}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2">{b.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{b.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                  <span>{b.highlight}</span>
                  <Link to="/start" className="hover:underline inline-flex items-center gap-1">
                    Try It Now &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= AD SLOT 1 (CLEAN ZERO-GAP) ================= */}
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-center">
        <AdBanner slot="public-inline" />
      </div>

      {/* ================= 3-STEP VISUAL TIMELINE ================= */}
      <section className="py-16 sm:py-20 bg-slate-50/50 border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-xs font-extrabold uppercase tracking-wider mb-2">
              Super Simple
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Start Vibing in 3 Easy Steps
            </h2>
            <p className="mt-2 text-sm text-slate-600">Zero sign-up forms. Zero friction. 3 seconds to connect.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 relative">
            {WORKFLOW_STEPS.map((s) => (
              <div
                key={s.step}
                className="bg-white border border-slate-200 p-6 sm:p-7 rounded-3xl relative hover:border-indigo-400 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-indigo-500/20">
                    {s.step}
                  </span>
                  <span className="text-2xl">{s.emoji}</span>
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mb-2">{s.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/start"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-9 py-4 rounded-2xl shadow-lg transition-all text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get Started in 3 Seconds</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= TOPIC HANGOUT HUBS ================= */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Find Your Vibe in Topic Groups
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Not in the mood for 1-on-1? Hang out in active community groups based on what you love.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {GROUP_TOPICS.map((g) => (
              <Link
                key={g.title}
                to="/start"
                className="group card bg-white border border-slate-200/90 hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5 transition-all rounded-2xl p-4 text-left flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl mb-2.5 block">{g.icon}</span>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-purple-600 transition-colors leading-tight">
                    {g.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">{g.desc}</p>
                </div>
                <span className="text-[11px] font-bold text-purple-600 mt-3 flex items-center gap-1">
                  Join Group &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= RESPECT & FEMALE-FRIENDLY SAFETY BANNER ================= */}
      <section className="py-14 bg-slate-50/70 border-t border-slate-200/70">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-purple-200/80 rounded-3xl p-6 sm:p-9 bg-white">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-4xl mb-3 block">🛡️</span>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-3 tracking-tight">
                Female-Friendly &amp; Respectful by Design
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 max-w-2xl mx-auto">
                No creepy behavior tolerated. Vibe Talk enforces strict community guidelines, 1-tap blocking, and 24-hour review queues to ensure clean, consensual, and positive conversations for everyone.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/safety"
                  className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all"
                >
                  Safety Guidelines &rarr;
                </Link>
                <Link
                  to="/community-guidelines"
                  className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all"
                >
                  Community Rules &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COLLAPSIBLE SEO INTRO (FOR GOOGLEBOT) ================= */}
      <section className="py-10 bg-white border-t border-slate-200/70">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
            About Vibe Talk Free Online Random Video Chat Platform
          </h2>
          <div className="text-xs text-slate-600 leading-relaxed space-y-2">
            <p>{SEO_INTRO}</p>
            {readMore && <p className="pt-2">{SEO_MORE}</p>}
          </div>
          <button
            type="button"
            onClick={() => setReadMore(!readMore)}
            className="mt-3 text-xs font-bold text-indigo-600 hover:underline"
          >
            {readMore ? 'Show less ↑' : 'Read more about Vibe Talk ↓'}
          </button>
        </div>
      </section>

      {/* ================= AD SLOT 2 (CLEAN ZERO-GAP) ================= */}
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-center">
        <AdBanner slot="public-inline" />
      </div>

      {/* ================= FAQS ACCORDION (INTERACTIVE & SEO) ================= */}
      <section className="py-16 sm:py-20 bg-slate-50/50 border-t border-slate-200/70">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold uppercase tracking-wider mb-2 border border-indigo-100">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">Everything you need to know before chatting.</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={faq.q}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className="w-full px-5 py-4 text-left font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-indigo-600 font-mono text-xs flex items-center justify-center shrink-0">
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= VIBRANT 2026 BOTTOM CONVERSION CARD ================= */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/15 to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <span className="inline-block text-3xl mb-3 animate-bounce">⚡</span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
            Ready to Vibe with Someone New?
          </h2>
          <p className="text-white/85 text-xs sm:text-base mb-8 max-w-lg mx-auto leading-relaxed">
            Join thousands of friendly people chatting right now. Free, instant, and 100% private.
          </p>
          <Link
            to="/start"
            className="inline-flex items-center gap-2 bg-white text-slate-900 font-black px-9 py-4 rounded-2xl shadow-2xl hover:bg-slate-100 hover:scale-[1.03] active:scale-[0.98] transition-all text-base sm:text-lg"
          >
            <span>Start Chatting in 1-Click</span>
            <span>&rarr;</span>
          </Link>
          <p className="text-[11px] text-white/60 mt-4">
            Zero sign-up required · Works smoothly on Android, iPhone &amp; Desktop
          </p>
        </div>
      </section>
    </PublicLayout>
  );
};

export default LandingPage;