import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import PublicPageHero from '../components/PublicPageHero';

const STEPS = [
  {
    number: '1',
    title: 'Choose a nickname',
    description: 'Start as a guest with a nickname. You do not need to share your phone number or email to begin.',
  },
  {
    number: '2',
    title: 'Find a conversation',
    description: 'Use chat, Random Match, or browse the community to meet people who are ready to talk.',
  },
  {
    number: '3',
    title: 'Choose how to connect',
    description: 'Keep chatting by text, move to a private conversation, or start a video call when you feel comfortable.',
  },
  {
    number: '4',
    title: 'Stay in control',
    description: 'Block or report users, protect your personal information, and leave any conversation at any time.',
  },
];

const HowItWorksPage = () => {
  useEffect(() => {
    document.title = 'How Vibe Talk Works — Random Chat & Video Calls';
  }, []);

  return (
    <PublicLayout>
      <PublicPageHero
        emoji="✨"
        title="How Vibe Talk Works"
        subtitle="Start a friendly conversation in a few simple steps."
      />
      <article className="max-w-4xl mx-auto px-4 py-10 sm:py-14 text-base-content/80 leading-relaxed">
        <h1 className="text-2xl font-bold text-base-content mb-3">Meet people and start chatting</h1>
        <p className="max-w-2xl mb-8">
          Vibe Talk is a browser-based place for random chat, direct messages, video calls, and interest-based groups. Here is what to expect when you join.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {STEPS.map((step) => (
            <section key={step.number} className="card bg-base-200/40 border border-base-200">
              <div className="card-body p-5">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-content font-bold">
                  {step.number}
                </span>
                <h2 className="text-lg font-bold text-base-content">{step.title}</h2>
                <p className="text-sm">{step.description}</p>
              </div>
            </section>
          ))}
        </div>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-bold text-base-content">What you can do on Vibe Talk</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Try guest chat before creating a full profile.</li>
            <li>Use Random Match to discover new text or video conversations.</li>
            <li>Send direct messages and join groups around shared interests.</li>
            <li>Use the safety tools and community guidelines to keep conversations respectful.</li>
          </ul>
        </section>

        <div className="flex flex-wrap gap-3 mt-10">
          <Link to="/start" className="btn btn-primary">Start Chatting →</Link>
          <Link to="/safety" className="btn btn-ghost">Read Safety Tips</Link>
        </div>
      </article>
    </PublicLayout>
  );
};

export default HowItWorksPage;
