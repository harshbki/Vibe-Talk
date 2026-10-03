import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import AdBanner from '../components/AdBanner';
import {
  HERO_IMG,
  GROUP_TOPICS,
  LONG_FEATURES,
  SEO_INTRO,
  SEO_MORE,
  FOOTER_SEO_LINKS,
} from '../data/landingContent';

const LandingPage = () => {
  const navigate = useNavigate();
  const [heroOk, setHeroOk] = useState(true);
  const [readMore, setReadMore] = useState(false);

  useEffect(() => {
    if (window.location.hash === '#start') {
      navigate('/start', { replace: true });
    }
  }, [navigate]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <PublicLayout heroHeader>
      <section className="relative min-h-[min(88vh,820px)] flex items-center overflow-hidden bg-gradient-to-br from-pink-600 via-fuchsia-600 to-violet-800">
        {heroOk && (
          <img
            src={HERO_IMG}
            alt=""
            aria-hidden
            fetchPriority="high"
            decoding="async"
            onError={() => setHeroOk(false)}
            className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-r from-pink-600/88 via-fuchsia-600/82 to-violet-800/78"
          aria-hidden
        />
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24 w-full">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.1] mb-5 drop-shadow-md">
              Free Random Chat, Video Call &amp; Meet Strangers Online
            </h1>
            <p className="text-lg sm:text-xl text-white/95 mb-10 font-light leading-relaxed drop-shadow">
              Start spending your spare time making friends.
            </p>
            <Link
              to="/start"
              className="inline-flex items-center gap-2 bg-white text-gray-800 font-bold px-10 py-4 rounded-md shadow-2xl hover:bg-white/95 transition-all text-base sm:text-lg"
            >
              Start Chatting →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-base-100 border-b border-base-200">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-xl sm:text-2xl font-bold text-base-content leading-snug text-center">
            Free Random Chat, Video Calls & Meet Strangers Online
          </h1>
          <p className="mt-4 text-sm sm:text-base text-base-content/70 leading-relaxed">
            {SEO_INTRO}
            {readMore && SEO_MORE}
          </p>
          {!readMore && (
            <button
              type="button"
              onClick={() => setReadMore(true)}
              className="mt-3 text-sm text-primary font-semibold hover:underline"
            >
              Read more
            </button>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-4">
        <AdBanner slot="public-inline" className="min-h-[90px]" />
      </div>

      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 border-y border-base-200">
        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h2 className="font-bold text-lg">Ready to chat?</h2>
            <p className="text-sm text-base-content/65 mt-1">Guest login with nickname only — takes 10 seconds.</p>
          </div>
          <Link to="/start" className="btn btn-primary btn-wide sm:btn-lg shrink-0">
            Start Chatting →
          </Link>
        </div>
      </section>

      <section className="bg-base-200/40 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2">Explore Groups</h2>
          <p className="text-center text-sm text-base-content/60 mb-10 max-w-2xl mx-auto">
            Choose a topic, then join after login. We use Groups — not old-style chat rooms.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {GROUP_TOPICS.map((g) => (
              <Link
                key={g.title}
                to="/start"
                className="group card bg-base-100 border border-base-200 hover:border-pink-400/60 hover:shadow-md transition-all"
              >
                <div className="card-body p-4">
                  <span className="text-2xl">{g.icon}</span>
                  <h3 className="font-bold text-sm group-hover:text-primary leading-tight">{g.title}</h3>
                  <p className="text-[10px] sm:text-xs text-base-content/55 leading-snug">{g.desc}</p>
                  <span className="text-xs font-semibold text-primary mt-1">Join Now →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-base-100">
        <div className="max-w-3xl mx-auto px-4 space-y-10">
          {LONG_FEATURES.map((f, i) => (
            <React.Fragment key={f.title}>
              <article className="flex gap-4">
                <span className="text-3xl shrink-0 leading-none" aria-hidden>
                  {f.icon}
                </span>
                <div>
                  <h3 className="font-bold text-base sm:text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-base-content/70 leading-relaxed">{f.text}</p>
                </div>
              </article>
              {i === 4 && (
                <div className="py-2">
                  <AdBanner slot="public-inline" className="min-h-[90px]" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-700 text-white py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Join thousands chatting on Vibe Talk</h2>
          <p className="text-white/90 text-sm mb-6">Free · No download · Works on mobile &amp; desktop</p>
          <Link to="/start" className="btn btn-lg bg-white text-gray-800 border-0 hover:bg-white/90 font-bold">
            Start Chatting →
          </Link>
        </div>
      </section>

      <div className="border-t border-base-200 bg-base-200/30 py-6 text-center">
        <p className="text-xs text-base-content/45 max-w-xl mx-auto px-4 leading-relaxed">
          {FOOTER_SEO_LINKS.map((l, i) => (
            <span key={l.to}>
              {i > 0 && ' · '}
              <Link to={l.to} className="text-primary hover:underline">
                {l.label}
              </Link>
            </span>
          ))}
        </p>
        <button type="button" onClick={scrollTop} className="btn btn-ghost btn-xs text-base-content/45 mt-3">
          To the top ↑
        </button>
      </div>
    </PublicLayout>
  );
};

export default LandingPage;
