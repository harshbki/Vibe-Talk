import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import AdBanner from '../components/AdBanner';
import { useAuth } from '../context/AuthContext';
import {
  HERO_IMG,
  HERO_IMG_WEBP,
  GROUP_TOPICS,
  SEO_INTRO,
  SEO_MORE,
} from '../data/landingContent';

const QUICK_PILLS = [
  { icon: '⚡', label: '1-Click Match' },
  { icon: '🔒', label: 'Zero Log-in' },
  { icon: '📹', label: 'Cam-to-Cam HD' },
  { icon: '🛡️', label: 'Anti-Harassment' },
  { icon: '🌍', label: 'Global Chatters' },
];

const COOL_NICKNAMES = [
  'CosmicViber',
  'NovaChat',
  'NeonPulse',
  'PixelSurfer',
  'VelvetSky',
  'ZenithEcho',
  'StarGazer',
  'VibeRunner',
  'SolarFlare',
  'MidnightMuse',
  'AuraWalker',
  'CyberNomad',
];

const INTEREST_TAGS = [
  '#Gaming',
  '#Music',
  '#Anime',
  '#DeepTalk',
  '#LateNight',
  '#Travel',
  '#Memes',
  '#College',
];

const MOCK_PARTNERS = [
  { name: 'Elena, 22', location: 'Barcelona, Spain', status: 'Connected · 1080p HD', vibe: '“Listening to lo-fi & coding”' },
  { name: 'Kenji, 24', location: 'Tokyo, Japan', status: 'Connected · 1080p HD', vibe: '“Anime & chill gaming”' },
  { name: 'Maya, 21', location: 'Toronto, Canada', status: 'Connected · 1080p HD', vibe: '“Coffee lover, let’s talk music!”' },
  { name: 'Liam, 23', location: 'Melbourne, Australia', status: 'Connected · 1080p HD', vibe: '“Late night travel stories”' },
];

const BENTO_FEATURES = [
  {
    icon: '🎲',
    badge: 'Fast Match',
    title: '1-on-1 Instant Random Match',
    desc: 'Hit Match to instantly connect with friendly people across 190+ countries. Vibe is off? Tap Next with zero awkwardness.',
    highlight: 'Instant 1-Tap Connect',
    tagColor: 'badge-secondary',
  },
  {
    icon: '📹',
    badge: 'HD WebRTC',
    title: 'Crystal-Clear Video & Audio Calls',
    desc: 'Talk face-to-face with ultra-low latency right inside your browser. Strict consent camera controls protect your privacy until you are ready.',
    highlight: 'Encrypted P2P Streams',
    tagColor: 'badge-primary',
  },
  {
    icon: '🛡️',
    badge: 'Clean Space',
    title: 'Zero Creeps, Zero Spam',
    desc: 'Female-friendly community with instant 1-tap block and automated abuse filters. A safe social space to talk without bots, scams, or toxicity.',
    highlight: '1-Tap Block & Report',
    tagColor: 'badge-accent',
  },
  {
    icon: '👥',
    badge: 'Community',
    title: 'Topic-Based Hangout Hubs',
    desc: 'Ditch dead chatrooms. Join active topic groups for Anime, Gaming, Music, Travel, and Late Night talks with people who share your passions.',
    highlight: '15+ Active Categories',
    tagColor: 'badge-warning',
  },
];

const WORKFLOW_STEPS = [
  {
    step: '1',
    emoji: '✨',
    title: 'Drop a Nickname',
    desc: 'No email, no phone number, no password. Just enter any cool nickname and you are ready to roll.',
  },
  {
    step: '2',
    emoji: '🎯',
    title: 'Pick Your Vibe',
    desc: 'Choose 1-on-1 Random Match for spontaneous chats, browse live online users, or jump into Topic Groups.',
  },
  {
    step: '3',
    emoji: '🎉',
    title: 'Connect & Vibe',
    desc: 'Chat via text, switch on cam-to-cam video when comfortable, and skip or block anytime with complete peace of mind.',
  },
];

const FAQS = [
  {
    q: 'Is Vibe Talk really 100% free?',
    a: 'Yes, 100% free! All random matching, text messaging, WebRTC video calling, and topic groups are free. No paywalls, coins, or hidden subscription traps.',
  },
  {
    q: 'Do I need to sign up or download an app?',
    a: 'Zero sign-up and zero downloads. You can chat as a guest in 5 seconds straight from your iPhone, Android, tablet, or PC browser.',
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
  const { user, login, loading: authLoading } = useAuth();

  // Fast-Start Match Console State
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('Male');
  const [chatMode, setChatMode] = useState('video'); // 'video' | 'text'
  const [selectedTags, setSelectedTags] = useState(['#Music', '#Gaming']);
  const [consoleError, setConsoleError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Mock Call Simulation State
  const [partnerIndex, setPartnerIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [reactions, setReactions] = useState(['👋 Hey there!']);

  // Public Landing State
  const [heroOk, setHeroOk] = useState(true);
  const [readMore, setReadMore] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    if (window.location.hash === '#start') {
      navigate('/start', { replace: true });
    }
  }, [navigate]);

  const handleRandomizeNick = () => {
    const randomNick = COOL_NICKNAMES[Math.floor(Math.random() * COOL_NICKNAMES.length)] + Math.floor(10 + Math.random() * 90);
    setNickname(randomNick);
    setConsoleError('');
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleFastStart = async (e) => {
    e?.preventDefault();
    setConsoleError('');

    // If user already logged in, navigate straight to match
    if (user) {
      navigate('/match');
      return;
    }

    const finalNick = nickname.trim() || COOL_NICKNAMES[Math.floor(Math.random() * COOL_NICKNAMES.length)] + Math.floor(10 + Math.random() * 90);

    setIsConnecting(true);
    try {
      await login(finalNick, gender);
      navigate('/match');
    } catch (err) {
      console.error('Fast start login error:', err);
      // If error (or duplicate), redirect to /start for manual handling
      navigate('/start');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleNextPartner = () => {
    setPartnerIndex((prev) => (prev + 1) % MOCK_PARTNERS.length);
    const newReactions = ['👋 Hello!', '🔥 Nice vibe!', '✨ Cool background!', '😄 What’s up?'];
    const chosen = newReactions[Math.floor(Math.random() * newReactions.length)];
    setReactions((prev) => [chosen, ...prev.slice(0, 2)]);
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const currentPartner = MOCK_PARTNERS[partnerIndex];

  return (
    <PublicLayout>
      {/* ================= 2026 HERO SECTION WITH FAST-START CONSOLE & WEBRTC MOCKUP ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-base-100 to-base-100 pt-8 pb-16 sm:py-20 border-b border-base-200">
        {/* Ambient Neon Glow Blur Blobs */}
        <div className="absolute top-10 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            {/* LEFT COLUMN: Punchy Copy & Fast-Start Console */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Live Ticker Pill */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-base-100 border border-base-300 shadow-xs text-xs sm:text-sm font-semibold mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-base-content/90">1,420+ People Vibing Live Right Now</span>
              </div>

              {/* High-Impact Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-black text-base-content tracking-tight leading-[1.12] mb-5">
                Talk to Strangers &amp;{' '}
                <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Video Chat Live
                </span>{' '}
                Online
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-base-content/75 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Meet cool, friendly people worldwide in 3 seconds. Zero registration, no downloads — 100% free anonymous video &amp; text chat.
              </p>

              {/* ================= FAST-START INTERACTIVE LAUNCH CONSOLE ================= */}
              <div className="bg-base-100 border border-base-200/90 rounded-3xl p-5 sm:p-6 shadow-xl shadow-primary/5 max-w-xl mx-auto lg:mx-0 mb-6 text-left">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-base-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-base-content/70">
                      ⚡ Quick Match Console
                    </span>
                  </div>
                  <span className="badge badge-sm badge-ghost font-semibold">100% Free · No Sign-up</span>
                </div>

                <form onSubmit={handleFastStart} className="space-y-4">
                  {/* Nickname Input with Randomizer */}
                  <div>
                    <label className="text-xs font-bold text-base-content/80 flex items-center justify-between mb-1.5">
                      <span>Your Chat Nickname</span>
                      <button
                        type="button"
                        onClick={handleRandomizeNick}
                        className="text-primary hover:underline flex items-center gap-1 font-semibold text-[11px]"
                      >
                        <span>🎲 Generate Cool Name</span>
                      </button>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="e.g. NeonVibe99 (or tap generate)"
                        maxLength={20}
                        className="input input-bordered w-full bg-base-200/50 text-base-content font-medium rounded-xl text-sm pr-12 focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={handleRandomizeNick}
                        title="Randomize Nickname"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 btn btn-xs btn-ghost btn-circle text-base"
                      >
                        🎲
                      </button>
                    </div>
                  </div>

                  {/* Mode & Gender Row */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Chat Mode Toggle */}
                    <div>
                      <span className="text-xs font-bold text-base-content/80 block mb-1.5">Chat Mode</span>
                      <div className="grid grid-cols-2 gap-1 p-1 bg-base-200/60 rounded-xl border border-base-300/60">
                        <button
                          type="button"
                          onClick={() => setChatMode('video')}
                          className={`btn btn-xs rounded-lg font-bold transition-all ${
                            chatMode === 'video'
                              ? 'bg-primary text-primary-content shadow-xs'
                              : 'btn-ghost text-base-content/70 hover:bg-base-200'
                          }`}
                        >
                          📹 Video
                        </button>
                        <button
                          type="button"
                          onClick={() => setChatMode('text')}
                          className={`btn btn-xs rounded-lg font-bold transition-all ${
                            chatMode === 'text'
                              ? 'bg-primary text-primary-content shadow-xs'
                              : 'btn-ghost text-base-content/70 hover:bg-base-200'
                          }`}
                        >
                          💬 Text
                        </button>
                      </div>
                    </div>

                    {/* Gender Selection */}
                    <div>
                      <span className="text-xs font-bold text-base-content/80 block mb-1.5">I am a</span>
                      <div className="grid grid-cols-2 gap-1 p-1 bg-base-200/60 rounded-xl border border-base-300/60">
                        <button
                          type="button"
                          onClick={() => setGender('Male')}
                          className={`btn btn-xs rounded-lg font-bold transition-all ${
                            gender === 'Male'
                              ? 'bg-primary text-primary-content shadow-xs'
                              : 'btn-ghost text-base-content/70 hover:bg-base-200'
                          }`}
                        >
                          👦 Guy
                        </button>
                        <button
                          type="button"
                          onClick={() => setGender('Female')}
                          className={`btn btn-xs rounded-lg font-bold transition-all ${
                            gender === 'Female'
                              ? 'bg-secondary text-secondary-content shadow-xs'
                              : 'btn-ghost text-base-content/70 hover:bg-base-200'
                          }`}
                        >
                          👧 Girl
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Vibe Interest Pills */}
                  <div>
                    <span className="text-xs font-bold text-base-content/80 block mb-1.5">
                      Interests <span className="text-base-content/50 font-normal">(Match people with shared hobbies)</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {INTEREST_TAGS.map((tag) => {
                        const active = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                              active
                                ? 'bg-primary/15 text-primary border border-primary/30 font-bold'
                                : 'bg-base-200/50 text-base-content/60 border border-base-300/40 hover:bg-base-200 hover:text-base-content'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {consoleError && (
                    <p className="text-xs text-error font-medium">{consoleError}</p>
                  )}

                  {/* Primary Instant Match Action Button */}
                  <button
                    type="submit"
                    disabled={isConnecting || authLoading}
                    className="w-full inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all text-base sm:text-lg disabled:opacity-50"
                  >
                    {isConnecting || authLoading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <>
                        <span>⚡ Connect Instantly (Free)</span>
                        <span>&rarr;</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-base-content/50 pt-1">
                    <span>🔒 Safe &amp; Moderated</span>
                    <span>🚫 Zero Logs Saved</span>
                    <span>⚡ No Download Required</span>
                  </div>
                </form>
              </div>

              {/* Quick Feature Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2">
                {QUICK_PILLS.map((pill) => (
                  <span
                    key={pill.label}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-base-100 border border-base-200 text-base-content/75 shadow-2xs"
                  >
                    <span>{pill.icon}</span>
                    <span>{pill.label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive WebRTC Call Simulator Mockup */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                
                {/* Simulated WebRTC Call Window */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-base-300 shadow-2xl bg-base-300 group">
                  
                  {/* Main Partner Video Feed */}
                  <div className="relative h-[380px] sm:h-[440px] w-full overflow-hidden bg-slate-900">
                    {heroOk && (
                      <picture>
                        <source srcSet={HERO_IMG_WEBP} type="image/webp" />
                        <img
                          src={HERO_IMG}
                          alt="Happy young friends video chatting on VibeTalk"
                          fetchPriority="high"
                          decoding="async"
                          onError={() => setHeroOk(false)}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />
                      </picture>
                    )}

                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

                    {/* Top Call Info Overlay */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/15 text-white text-xs font-bold shadow-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>{currentPartner.name}</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 text-white/90 text-[11px] font-semibold">
                        <span>🌍</span>
                        <span>{currentPartner.location}</span>
                      </div>
                    </div>

                    {/* Floating Live Reactions Feed */}
                    <div className="absolute top-14 left-3 space-y-1.5 z-10 pointer-events-none">
                      {reactions.map((r, idx) => (
                        <div
                          key={idx}
                          className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold shadow-md animate-fade-in inline-block"
                        >
                          {r}
                        </div>
                      ))}
                    </div>

                    {/* Picture-in-Picture Self-Cam (Bottom Right) */}
                    <div className="absolute bottom-16 right-3 w-28 h-36 rounded-2xl overflow-hidden border-2 border-white/80 shadow-2xl bg-slate-800 z-10 flex flex-col justify-between p-1.5">
                      <div className="text-[10px] font-bold text-white bg-slate-900/60 backdrop-blur-xs px-1.5 py-0.5 rounded-md self-start">
                        You {isCamOff ? '(Cam Off)' : ''}
                      </div>
                      <div className="flex-1 flex items-center justify-center text-2xl">
                        {isCamOff ? '🙈' : '😎'}
                      </div>
                      <div className="text-[9px] text-white/80 text-center font-mono">
                        {isMuted ? '🔇 Muted' : '🎙️ Live'}
                      </div>
                    </div>

                    {/* Partner Vibe Status (Bottom Left) */}
                    <div className="absolute bottom-16 left-3 z-10 max-w-[200px]">
                      <p className="text-white text-xs font-bold drop-shadow-md">
                        {currentPartner.vibe}
                      </p>
                      <p className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1 mt-0.5 drop-shadow-sm">
                        <span>●</span> {currentPartner.status}
                      </p>
                    </div>

                    {/* Bottom Call Action Control Bar */}
                    <div className="absolute bottom-2 inset-x-2 py-2 px-3 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/15 flex items-center justify-between gap-2 z-10">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setIsMuted(!isMuted)}
                          className={`btn btn-xs btn-circle ${
                            isMuted ? 'bg-error text-white' : 'bg-white/20 text-white hover:bg-white/30'
                          } border-0`}
                          title="Toggle Mic"
                        >
                          {isMuted ? '🔇' : '🎙️'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCamOff(!isCamOff)}
                          className={`btn btn-xs btn-circle ${
                            isCamOff ? 'bg-error text-white' : 'bg-white/20 text-white hover:bg-white/30'
                          } border-0`}
                          title="Toggle Cam"
                        >
                          {isCamOff ? '🚫' : '📹'}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleNextPartner}
                        className="btn btn-xs bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 font-bold px-3 rounded-xl hover:scale-105 active:scale-95 transition-transform"
                      >
                        ⏭️ Next Partner
                      </button>
                    </div>

                  </div>
                </div>

                {/* Decorative Behind-Card Neon Blobs */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl -z-10" />
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -z-10" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= BENTO GRID 2.0 (FEATURES & VALUE) ================= */}
      <section className="py-16 sm:py-20 bg-base-200/50 border-b border-base-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="badge badge-primary badge-sm font-bold uppercase tracking-wider mb-2">
              Next-Gen Stranger Chat
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-base-content tracking-tight">
              Why Gen Z &amp; Modern Chatters Love Vibe Talk
            </h2>
            <p className="mt-3 text-sm sm:text-base text-base-content/70">
              Clean vibes only. Everything you love about random video chat — minus the creepy bots and forced paywalls.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {BENTO_FEATURES.map((b) => (
              <div
                key={b.title}
                className="card bg-base-100 border border-base-200/90 p-6 sm:p-8 rounded-3xl shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl p-3 rounded-2xl bg-base-200 border border-base-300/50">{b.icon}</span>
                    <span className={`badge ${b.tagColor} badge-sm font-bold`}>{b.badge}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-base-content mb-2">{b.title}</h3>
                  <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">{b.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-base-200 flex items-center justify-between text-xs font-bold text-primary">
                  <span>{b.highlight}</span>
                  <Link to="/start" className="hover:underline inline-flex items-center gap-1">
                    Try It &rarr;
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
      <section className="py-16 sm:py-20 bg-base-100 border-y border-base-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
            <span className="badge badge-ghost badge-sm font-bold uppercase tracking-wider mb-2">
              Super Simple
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-base-content tracking-tight">
              Start Vibing in 3 Easy Steps
            </h2>
            <p className="mt-2 text-sm text-base-content/70">Zero forms. Zero friction. 3 seconds to chat.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 relative">
            {WORKFLOW_STEPS.map((s) => (
              <div
                key={s.step}
                className="card bg-base-200/50 border border-base-200 p-6 sm:p-7 rounded-3xl relative hover:border-primary/60 hover:bg-base-100 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-2xl bg-primary text-primary-content font-black text-sm flex items-center justify-center shadow-md shadow-primary/25">
                    {s.step}
                  </span>
                  <span className="text-2xl">{s.emoji}</span>
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-base-content mb-2">{s.title}</h3>
                <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/start"
              className="inline-flex items-center justify-center gap-2 btn btn-primary font-bold px-8 py-3.5 rounded-2xl shadow-md transition-all text-sm sm:text-base"
            >
              <span>Get Started in 3 Seconds</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= TOPIC HANGOUT HUBS ================= */}
      <section className="py-16 sm:py-20 bg-base-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-base-content tracking-tight">
              Find Your Vibe in Topic Groups
            </h2>
            <p className="mt-2 text-sm sm:text-base text-base-content/70">
              Not in the mood for 1-on-1? Hang out in active community groups based on what you love.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {GROUP_TOPICS.map((g) => (
              <Link
                key={g.title}
                to="/start"
                className="group card bg-base-100 border border-base-200/90 hover:border-primary hover:shadow-md hover:-translate-y-0.5 transition-all rounded-2xl p-4 text-left flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl mb-2.5 block">{g.icon}</span>
                  <h3 className="font-bold text-xs sm:text-sm text-base-content group-hover:text-primary transition-colors leading-tight">
                    {g.title}
                  </h3>
                  <p className="text-[11px] text-base-content/60 mt-1 leading-snug line-clamp-2">{g.desc}</p>
                </div>
                <span className="text-[11px] font-bold text-primary mt-3 flex items-center gap-1">
                  Join Group &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= RESPECT & FEMALE-FRIENDLY SAFETY BANNER ================= */}
      <section className="py-14 bg-base-100 border-t border-base-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-purple-300/40 rounded-3xl p-6 sm:p-9">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-4xl mb-3 block">🛡️</span>
              <h2 className="text-xl sm:text-3xl font-black text-base-content mb-3 tracking-tight">
                Female-Friendly &amp; Respectful by Design
              </h2>
              <p className="text-xs sm:text-sm text-base-content/75 leading-relaxed mb-6 max-w-2xl mx-auto">
                No creepy behavior tolerated. Vibe Talk enforces strict community guidelines, 1-tap blocking, and 24-hour review queues to ensure clean, consensual, and positive conversations for everyone.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/safety" className="btn btn-sm btn-primary rounded-xl font-bold">
                  Safety Guidelines &rarr;
                </Link>
                <Link to="/community-guidelines" className="btn btn-sm btn-ghost rounded-xl">
                  Community Rules &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COLLAPSIBLE SEO INTRO (FOR GOOGLEBOT) ================= */}
      <section className="py-10 bg-base-200/50 border-t border-base-200">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-sm sm:text-base font-bold text-base-content mb-2">
            About Vibe Talk Free Online Chat Platform
          </h2>
          <div className="text-xs text-base-content/70 leading-relaxed space-y-2">
            <p>{SEO_INTRO}</p>
            {readMore && <p className="pt-2">{SEO_MORE}</p>}
          </div>
          <button
            type="button"
            onClick={() => setReadMore(!readMore)}
            className="mt-3 text-xs font-bold text-primary hover:underline"
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
      <section className="py-16 sm:py-20 bg-base-100 border-t border-base-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="badge badge-primary badge-sm font-bold uppercase tracking-wider mb-2">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-base-content tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-base-content/70">Everything you need to know before chatting.</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={faq.q}
                className="border border-base-200 rounded-2xl overflow-hidden bg-base-200/40 hover:bg-base-200/70 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className="w-full px-5 py-4 text-left font-bold text-sm sm:text-base text-base-content flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <span className="w-6 h-6 rounded-full bg-base-100 border border-base-300 text-primary font-mono text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-base-content/75 leading-relaxed border-t border-base-200 pt-3 bg-base-100">
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