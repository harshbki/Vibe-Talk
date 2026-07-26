import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import PublicPageHero from '../components/PublicPageHero';
import { GROUP_TOPICS } from '../data/landingContent';

const AboutPage = () => {
  useEffect(() => {
    document.title = 'About Vibe Talk — Free Random Chat & Groups | vibetalk.me';
  }, []);

  return (
    <PublicLayout>
      <PublicPageHero
        emoji="💬"
        title="About Vibe Talk"
        subtitle="A free, female-friendly platform to talk to strangers, random match, video call, and join interest-based groups."
      />
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14 space-y-8">
        <section className="prose prose-sm max-w-none text-base-content/80 leading-relaxed">
          <p>
            <strong>Vibe Talk</strong> (vibetalk.me) helps people make friends online through guest chat,
            random match, direct messages, video calls, and topic-based <strong>Groups</strong> — without
            complicated registration.
          </p>
          <p>
            We are not a dating site. Our community guidelines focus on respectful conversation, safety,
            and a clean experience for everyone — especially women who want a friendly place to chat.
          </p>
          <h2 className="text-lg font-bold text-base-content pt-2">What makes us different</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Groups, not chat rooms</strong> — join communities by interest</li>
            <li><strong>Guest access</strong> — nickname only to start</li>
            <li><strong>Random match + video</strong> — meet strangers in one tap</li>
            <li><strong>Browser-based</strong> — no app download required</li>
          </ul>
        </section>

        <section id="groups" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4">Groups on Vibe Talk</h2>
          <p className="text-sm text-base-content/60 mb-6">
            After you join, explore or create groups like these:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {GROUP_TOPICS.map((g) => (
              <div key={g.title} className="card bg-base-200/40 border border-base-200">
                <div className="card-body p-4">
                  <span className="text-2xl">{g.icon}</span>
                  <h3 className="font-bold text-sm">{g.title}</h3>
                  <p className="text-xs text-base-content/60">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/start" className="btn btn-primary mt-6">
            Start Chatting →
          </Link>
        </section>

        <section className="text-sm text-base-content/60 border-t border-base-200 pt-6">
          <p>
            Questions? See our <Link to="/safety" className="link link-primary">Safety</Link>,{' '}
            <Link to="/contact" className="link link-primary">Contact</Link>, or{' '}
            <Link to="/articles" className="link link-primary">Articles</Link> pages.
          </p>
        </section>
      </div>
    </PublicLayout>
  );
};

export default AboutPage;
