import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');
  const [mode, setMode] = useState('guest'); // 'guest' or 'profile'
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const { login, profileLogin, loading, error, nicknameSuggestions } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-base-200 to-secondary/5 p-4">
      {/* Floating decorative dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[15%] w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-accent/5 rounded-full blur-3xl -translate-x-1/2" />
      </div>

      <div className="card w-full max-w-md bg-base-100/80 backdrop-blur-xl shadow-2xl border border-base-300/50 animate-scale-in relative z-10">
        <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-primary rounded-t-2xl" />
        <div className="card-body items-center text-center gap-6 p-8">
          {/* Logo */}
          <div className="space-y-2">
            <div className="text-5xl">💬</div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Vibe Talk
            </h1>
            <p className="text-base-content/50 text-sm">
              {mode === 'guest' ? 'Chat anonymously with people around you' : 'Welcome back! Login with your profile'}
            </p>
          </div>

          {/* Mode tabs */}
          <div className="join w-full">
            <button
              type="button"
              className={`join-item btn btn-sm flex-1 ${mode === 'guest' ? 'btn-primary' : 'btn-ghost border border-base-300'}`}
              onClick={() => setMode('guest')}
            >
              🆕 New User
            </button>
            <button
              type="button"
              className={`join-item btn btn-sm flex-1 ${mode === 'profile' ? 'btn-primary' : 'btn-ghost border border-base-300'}`}
              onClick={() => setMode('profile')}
            >
              🔑 Profile Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Nickname</span>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. CoolCat99"
                maxLength={20}
                required
                className="input input-bordered w-full focus:outline-none focus:input-primary bg-base-200/50"
              />
            </div>

            {mode === 'guest' ? (
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">I am a...</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`btn ${gender === 'Male' ? 'btn-primary shadow-md shadow-primary/25' : 'btn-outline btn-ghost border-base-300'} gap-2 h-14 text-base transition-all`}
                  >
                    <input type="radio" name="gender" value="Male" checked={gender === 'Male'} onChange={(e) => setGender(e.target.value)} className="hidden" />
                    <span className="text-xl">👨</span> Male
                  </label>
                  <label
                    className={`btn ${gender === 'Female' ? 'btn-secondary shadow-md shadow-secondary/25' : 'btn-outline btn-ghost border-base-300'} gap-2 h-14 text-base transition-all`}
                  >
                    <input type="radio" name="gender" value="Female" checked={gender === 'Female'} onChange={(e) => setGender(e.target.value)} className="hidden" />
                    <span className="text-xl">👩</span> Female
                  </label>
                </div>
              </div>
            ) : (
              <>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-semibold">Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="input input-bordered w-full focus:outline-none focus:input-primary bg-base-200/50"
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-semibold">Date of Birth</span>
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    className="input input-bordered w-full focus:outline-none focus:input-primary bg-base-200/50"
                  />
                </div>
              </>
            )}

            {error && (
              <div className="alert alert-error text-sm py-2">
                <span>{error}</span>
              </div>
            )}

            {nicknameSuggestions.length > 0 && (
              <div className="bg-base-200 rounded-xl p-3 space-y-2">
                <p className="text-xs font-semibold text-base-content/60">Try one of these:</p>
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
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full text-base font-bold h-12 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              disabled={loading || !nickname.trim() || (mode === 'guest' ? !gender : (!fullName.trim() || !dateOfBirth))}
            >
              {loading ? <span className="loading loading-spinner loading-sm" /> : null}
              {loading ? 'Logging in...' : mode === 'guest' ? 'Join Chat →' : '🔑 Login →'}
            </button>
          </form>

          <div className="flex items-center gap-4 w-full opacity-40">
            <div className="flex-1 border-t border-base-300" />
            <span className="text-xs">{mode === 'guest' ? 'no registration needed' : 'login with your profile details'}</span>
            <div className="flex-1 border-t border-base-300" />
          </div>

          <div className="flex gap-6 text-xs text-base-content/40">
            <span>💬 Chat</span>
            <span>🎲 Random Match</span>
            <span>📹 Video Calls</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
