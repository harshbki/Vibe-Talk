import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PublicLayout from '../components/PublicLayout';

const HERO_BG =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1920&q=80';

const GROUP_TOPICS = [
  { icon: '✈️', title: 'Travel', desc: 'Need ideas on traveling?', cta: 'Join Now' },
  { icon: '🎵', title: 'Music', desc: 'Meet other music enthusiasts.', cta: 'Join Now' },
  { icon: '🎮', title: 'Games', desc: 'Find peers for gaming.', cta: 'Join Now' },
  { icon: '🎬', title: 'Movies', desc: 'Best movie recommendations.', cta: 'Join Now' },
  { icon: '🍕', title: 'Foodie', desc: 'Share recipes with foodies.', cta: 'Join Now' },
  { icon: '🎌', title: 'Anime', desc: 'Discuss anime you must watch.', cta: 'Join Now' },
  { icon: '🔬', title: 'Science', desc: "What's new in science.", cta: 'Join Now' },
  { icon: '📰', title: 'News', desc: 'Discuss current events.', cta: 'Join Now' },
  { icon: '⚽', title: 'Sports', desc: 'Your favorite athletes & teams.', cta: 'Join Now' },
  { icon: '🆕', title: 'Fresh Groups', desc: 'Newly created by users.', cta: 'Join Now' },
  { icon: '⭐', title: 'Promoted', desc: 'Community promoted groups.', cta: 'Join Now' },
  { icon: '💚', title: 'Wellness', desc: 'Supportive mental health chat.', cta: 'Join Now' },
];

const LONG_FEATURES = [
  {
    icon: '📱',
    title: 'Mobile chat anywhere',
    text: 'Use Vibe Talk on Android, iPhone, desktop, or tablet. Responsive design fits any screen — chat from anywhere without downloading an app.',
  },
  {
    icon: '👩👨',
    title: 'Talk to strangers',
    text: 'Meet people from around the world online, free and anonymously. Random match, direct messages, and video calls keep conversations fresh and fun.',
  },
  {
    icon: '🔒',
    title: 'Online chat without login',
    text: 'Start as a guest with just a nickname — no sign-up required. Create a full profile later to unlock filters, DMs, and group creation.',
  },
  {
    icon: '🆓',
    title: 'Free groups & chat',
    text: 'Basic chat, random match, and groups are 100% free. We use ads (Google AdSense, Monetag) to keep the service running.',
  },
  {
    icon: '🏘️',
    title: 'Group chat (not chat rooms)',
    text: 'Join interest-based Groups or create your own. Search groups, invite friends, share media — a modern alternative to old public chat rooms.',
  },
  {
    icon: '👩',
    title: 'Talk to female strangers',
    text: 'We focus on a female-friendly, clean community. Be social and responsible — friendship and conversation, not dating or harassment.',
  },
  {
    icon: '🔄',
    title: 'Random chat & stranger meetup',
    text: 'One tap Random Match connects you with someone new. Skip with Next, or move to video when you are ready.',
  },
  {
    icon: '🅾️',
    title: 'Omegle alternative',
    text: 'Inspired by Omegle and ChatHub — random chat without captcha hassle, video calls in browser, and groups by interest when you want more than 1-on-1.',
  },
];

const LoginPage = () => {
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');
  const [mode, setMode] = useState('guest');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const { login, profileLogin, loading, error, nicknameSuggestions } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title =
      'Vibe Talk — Free Random Chat, Video Call & Meet Strangers Online | vibetalk.me';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Vibe Talk — spam-free random chat, talk to strangers, video call & groups. No registration. Female-friendly Omegle alternative on vibetalk.me'
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'guest') {
      if (!nickname.trim() || !gender) return;
      try {
        await login(nickname.trim(), gender);
        navigate('/chat');
      } catch (err) {
        console.error('Login error:', err);
      }
    } else {
      if (!nickname.trim() || !fullName.trim() || !dateOfBirth) return;
      try {
        await profileLogin(nickname.trim(), fullName.trim(), dateOfBirth);
        navigate('/chat');
      } catch (err) {
        console.error('Profile login error:', err);
      }
    }
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <PublicLayout hideFooter>
      {/* Hero — meetyou.me style: photo + pink/purple overlay */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url(${HERO_BG})` }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-pink-600/90 via-fuchsia-600/85 to-violet-800/80"
          aria-hidden
        />
        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-28 w-full">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.1] mb-5 drop-shadow-sm">
              Start making new friends
            </h1>
            <p className="text-lg sm:text-xl text-white/95 mb-10 font-light leading-relaxed">
              Start spending your spare time making friends.
            </p>
            <a
              href="#start"
              className="inline-flex items-center gap-2 bg-white text-gray-800 font-bold px-10 py-4 rounded-md shadow-2xl hover:bg-white/95 transition-all text-base sm:text-lg"
            >
              Start Chatting →
            </a>
          </div>
        </div>
      </section>

      {/* SEO headline block — like meetyou below fold */}
      <section className="bg-base-100 border-b border-base-200">
        <div className="max-w-4xl mx-auto px-4 py-10 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-base-content leading-snug">
            No. 1 Spam Free Platform for online chat, meetup. No Registration.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-base-content/70 leading-relaxed text-left sm:text-center">
            Vibe Talk is a stranger meeting platform — talk without login, without app, without bots
            &amp; without spam. Random match, video calls, direct messages, and interest-based{' '}
            <strong>Groups</strong> (not chat rooms). Female-friendly, clean community for making
            friends online — not dating. Be social &amp; responsible on vibetalk.me.
          </p>
        </div>
      </section>

      {/* Login */}
      <section id="start" className="bg-base-100 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 py-12 lg:py-16 grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4 order-2 lg:order-1">
            <h3 className="text-xl font-bold">About the chat</h3>
            <p className="text-base-content/70 leading-relaxed text-sm">
              You can start directly with <strong>Start Chatting</strong> or explore Groups after
              login. Guest chat needs only a nickname; full profile unlocks user filters, DMs, and
              group creation.
            </p>
            <ul className="text-sm space-y-2 text-base-content/80">
              <li>✅ Guest chat — no registration</li>
              <li>✅ Random match &amp; video calls</li>
              <li>✅ Groups by topic — not public chat rooms</li>
              <li>✅ Mobile &amp; desktop friendly</li>
            </ul>
            <Link to="/about#groups" className="link link-primary text-sm">
              Learn about Groups →
            </Link>
          </div>

          <div className="card bg-base-100 shadow-2xl border border-base-200 order-1 lg:order-2">
            <div className="h-1.5 bg-gradient-to-r from-pink-500 via-primary to-violet-600 rounded-t-2xl" />
            <div className="card-body gap-4 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-center">Join Vibe Talk</h3>
              <div className="join w-full">
                <button
                  type="button"
                  className={`join-item btn btn-sm flex-1 ${mode === 'guest' ? 'btn-primary' : 'btn-ghost border border-base-300'}`}
                  onClick={() => setMode('guest')}
                >
                  🆕 Guest
                </button>
                <button
                  type="button"
                  className={`join-item btn btn-sm flex-1 ${mode === 'profile' ? 'btn-primary' : 'btn-ghost border border-base-300'}`}
                  onClick={() => setMode('profile')}
                >
                  🔑 Profile
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Nickname"
                  maxLength={20}
                  required
                  className="input input-bordered w-full"
                />
                {mode === 'guest' ? (
                  <div className="grid grid-cols-2 gap-2">
                    {['Male', 'Female'].map((g) => (
                      <label
                        key={g}
                        className={`btn btn-sm h-11 ${gender === g ? (g === 'Male' ? 'btn-primary' : 'btn-secondary') : 'btn-outline'}`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={gender === g}
                          onChange={(e) => setGender(e.target.value)}
                          className="hidden"
                        />
                        {g === 'Male' ? '👨 Male' : '👩 Female'}
                      </label>
                    ))}
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full name"
                      required
                      className="input input-bordered w-full"
                    />
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      required
                      className="input input-bordered w-full"
                    />
                  </>
                )}
                {error && (
                  <div className="alert alert-error text-sm py-2">
                    <span>{error}</span>
                  </div>
                )}
                {nicknameSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {nicknameSuggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="btn btn-xs btn-outline"
                        onClick={() => setNickname(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={
                    loading ||
                    !nickname.trim() ||
                    (mode === 'guest' ? !gender : !fullName.trim() || !dateOfBirth)
                  }
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    'Start Chatting →'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Group categories — meetyou "Join Now" grid */}
      <section className="bg-base-200/40 border-y border-base-200 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2">Explore Groups</h2>
          <p className="text-center text-sm text-base-content/60 mb-10 max-w-2xl mx-auto">
            Key features of our chat — choose a topic, then join after login. We use Groups, not old-style
            chat rooms.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {GROUP_TOPICS.map((g) => (
              <a
                key={g.title}
                href="#start"
                className="group card bg-base-100 border border-base-200 hover:border-pink-400/60 hover:shadow-md transition-all"
              >
                <div className="card-body p-4 sm:p-5">
                  <span className="text-2xl sm:text-3xl">{g.icon}</span>
                  <h3 className="font-bold text-sm sm:text-base group-hover:text-primary">{g.title}</h3>
                  <p className="text-[11px] sm:text-xs text-base-content/55 leading-snug">{g.desc}</p>
                  <span className="text-xs font-semibold text-primary mt-1">{g.cta} →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Long SEO sections — meetyou style */}
      <section className="py-14 bg-base-100">
        <div className="max-w-3xl mx-auto px-4 space-y-10">
          {LONG_FEATURES.map((f) => (
            <div key={f.title} className="flex gap-4">
              <span className="text-3xl shrink-0 leading-none">{f.icon}</span>
              <div>
                <h3 className="font-bold text-base sm:text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-base-content/70 leading-relaxed">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer links + scroll top */}
      <footer className="border-t border-base-200 bg-base-200/50">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center space-y-4">
          <p className="text-xs text-base-content/50">© Vibe Talk · vibetalk.me</p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-base-content/65">
            <Link to="/about" className="hover:text-primary">
              About
            </Link>
            <Link to="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link to="/legal" className="hover:text-primary">
              Legal
            </Link>
            <Link to="/articles" className="hover:text-primary">
              Articles
            </Link>
          </div>
          <button
            type="button"
            onClick={scrollTop}
            className="btn btn-ghost btn-xs text-base-content/45"
          >
            To the top ↑
          </button>
        </div>
      </footer>
    </PublicLayout>
  );
};

export default LoginPage;
