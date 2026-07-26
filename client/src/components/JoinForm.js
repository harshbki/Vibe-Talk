import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const JoinForm = () => {
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');
  const [mode, setMode] = useState('guest');
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

  const canSubmit =
    nickname.trim() &&
    (mode === 'guest' ? gender : fullName.trim() && dateOfBirth) &&
    !loading;

  return (
    <div className="w-full max-w-[420px]">
      <div className="card bg-base-100 shadow-xl border border-base-200/80 rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary via-fuchsia-500 to-violet-500" />

        <div className="card-body gap-5 p-6 sm:p-8">
          <div className="text-center">
            <div className="text-4xl mb-2" aria-hidden>
              💬
            </div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Vibe Talk
            </h1>
            <p className="text-sm text-base-content/55 mt-1">
              Chat anonymously with people around you.
            </p>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="form-control w-full">
              <span className="label-text font-medium text-sm">Nickname</span>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. CoolCat99"
                maxLength={20}
                required
                autoComplete="username"
                className="input input-bordered w-full bg-base-200/30"
              />
            </label>

            {mode === 'guest' ? (
              <div>
                <span className="label-text font-medium text-sm block mb-2">I am a…</span>
                <div className="grid grid-cols-2 gap-2">
                  {['Male', 'Female'].map((g) => (
                    <label
                      key={g}
                      className={`btn btn-outline h-12 ${gender === g ? (g === 'Male' ? 'btn-primary' : 'btn-secondary') : ''}`}
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
              </div>
            ) : (
              <>
                <label className="form-control w-full">
                  <span className="label-text font-medium text-sm">Full name</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="input input-bordered w-full bg-base-200/30"
                  />
                </label>
                <label className="form-control w-full">
                  <span className="label-text font-medium text-sm">Date of birth</span>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    className="input input-bordered w-full bg-base-200/30"
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

            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={!canSubmit}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : 'Join Chat →'}
            </button>
          </form>

          {mode === 'guest' && (
            <p className="text-xs text-center text-base-content/45">No registration needed.</p>
          )}

          <div className="flex justify-center gap-4 text-xs text-base-content/45 pt-1 border-t border-base-200">
            <span>💬 Chat</span>
            <span>🎲 Random Match</span>
            <span>📹 Video Calls</span>
          </div>

          <p className="text-[10px] text-center text-base-content/40 leading-relaxed">
            By joining you agree to our{' '}
            <Link to="/legal" className="link link-primary">
              Terms
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="link link-primary">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinForm;
