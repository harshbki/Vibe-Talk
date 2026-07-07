import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: '💬', title: 'Free Chat', desc: 'Talk to strangers online without registration hassles.' },
  { icon: '🎲', title: 'Random Match', desc: 'Meet new people instantly with one tap.' },
  { icon: '📹', title: 'Video Calls', desc: 'Face-to-face conversations with real users worldwide.' },
  { icon: '🏘️', title: 'Group Rooms', desc: 'Join or create groups around shared interests.' },
  { icon: '🔒', title: 'Safe & Clean', desc: 'Spam-free community with profile controls.' },
  { icon: '📱', title: 'Mobile Ready', desc: 'Works smoothly on phone, tablet, and desktop.' },
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
    document.title = 'Vibe Talk — Free Random Chat, Video Call & Meet Strangers Online';
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

  return (
    <div className="min-h-screen bg-base-100">
      <header className="border-b border-base-200 bg-base-100/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            💬 Vibe Talk
          </div>
          <a href="#start" className="btn btn-primary btn-sm">Start Chatting →</a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-[8%] w-56 h-56 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-[10%] w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-10 lg:py-16 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center relative">
          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 badge badge-primary badge-outline">
              ✨ Free · No download · Instant chat
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Meet strangers.
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Make friends online.
              </span>
            </h1>
            <p className="text-base-content/70 text-lg leading-relaxed max-w-xl">
              Vibe Talk is a free random chat and video call platform to talk with strangers,
              find matches, join groups, and start conversations in seconds — like top chat sites,
              but cleaner and mobile-friendly.
            </p>
            <ul className="grid sm:grid-cols-2 gap-3 text-sm">
              <li className="flex items-center gap-2">✅ Talk to strangers without signup</li>
              <li className="flex items-center gap-2">✅ Random match &amp; video calls</li>
              <li className="flex items-center gap-2">✅ Female-friendly community</li>
              <li className="flex items-center gap-2">✅ Works on mobile &amp; desktop</li>
            </ul>
          </div>

          <div id="start" className="card bg-base-100 shadow-2xl border border-base-200 animate-scale-in">
            <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-primary rounded-t-2xl" />
            <div className="card-body gap-5 p-6 sm:p-8">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold">Start Chatting Now</h2>
                <p className="text-sm text-base-content/60">
                  {mode === 'guest' ? 'Pick a nickname and jump in' : 'Login with your profile'}
                </p>
              </div>

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

              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="form-control w-full">
                  <span className="label-text font-semibold">Nickname</span>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="e.g. CoolCat99"
                    maxLength={20}
                    required
                    className="input input-bordered w-full focus:input-primary"
                  />
                </label>

                {mode === 'guest' ? (
                  <div className="grid grid-cols-2 gap-3">
                    {['Male', 'Female'].map((g) => (
                      <label
                        key={g}
                        className={`btn h-12 ${gender === g ? (g === 'Male' ? 'btn-primary' : 'btn-secondary') : 'btn-outline btn-ghost border-base-300'}`}
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
                    <label className="form-control w-full">
                      <span className="label-text font-semibold">Full Name</span>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="input input-bordered w-full focus:input-primary"
                      />
                    </label>
                    <label className="form-control w-full">
                      <span className="label-text font-semibold">Date of Birth</span>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        required
                        className="input input-bordered w-full focus:input-primary"
                      />
                    </label>
                  </>
                )}

                {error && (
                  <div className="alert alert-error text-sm py-2">
                    <span>{error}</span>
                  </div>
                )}

                {nicknameSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {nicknameSuggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="btn btn-xs btn-outline btn-primary"
                        onClick={() => setNickname(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
                  disabled={
                    loading ||
                    !nickname.trim() ||
                    (mode === 'guest' ? !gender : !fullName.trim() || !dateOfBirth)
                  }
                >
                  {loading ? <span className="loading loading-spinner loading-sm" /> : null}
                  {loading ? 'Joining...' : 'Start Chatting →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-base-200/40 border-y border-base-200">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-center mb-8">Why people choose Vibe Talk</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="card bg-base-100 border border-base-200 shadow-sm">
                <div className="card-body p-5">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <h3 className="font-bold">{f.title}</h3>
                  <p className="text-sm text-base-content/65">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 text-sm text-base-content/70 leading-relaxed space-y-4">
        <h2 className="text-xl font-bold text-base-content">Free online chat rooms &amp; random stranger meetup</h2>
        <p>
          Vibe Talk helps you talk to strangers online, make friends, and enjoy random video chat without complicated
          signup. Whether you want a quick conversation, a random match, or a group discussion, our platform is built
          for real-time connection on mobile and desktop.
        </p>
        <p>
          Join thousands exploring free chat, anonymous guest access, profile-based messaging, and safe community
          features. Start now — no app download required.
        </p>
      </section>

      <footer className="border-t border-base-200 bg-base-200/30">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-base-content/50">
          © {new Date().getFullYear()} Vibe Talk · Free random chat &amp; video calls · vibetalk.me
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
