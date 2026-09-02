import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { useSeoMeta } from '../utils/seo';

const RandomChatPage = () => {
  useSeoMeta({
    title: 'Random Chat — Meet New People Online | Vibe Talk',
    description:
      'Use Vibe Talk random chat to meet new people online with guest access, instant matching, and safer conversation controls.',
    canonicalPath: '/random-chat',
  });

  return (
    <PublicLayout>
      <article className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-extrabold">Random Chat on Vibe Talk</h1>
          <p className="text-base-content/70 leading-relaxed">
            Vibe Talk helps you meet new people through random chat without long sign-up steps. Start with a
            nickname, connect quickly, and move on when a conversation is not a fit.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">How random chat works</h2>
          <ul className="list-disc pl-5 text-base-content/75 space-y-1">
            <li>Choose guest mode and enter a nickname.</li>
            <li>Use random match to connect with someone new.</li>
            <li>Continue, skip, block, or report based on your experience.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Best use cases</h2>
          <p className="text-base-content/70">
            Random chat is useful for casual social conversation, meeting people from new places, and language
            practice in short, low-pressure sessions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Related pages</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link to="/video-chat" className="btn btn-outline btn-sm">Video Chat</Link>
            <Link to="/talk-to-strangers" className="btn btn-outline btn-sm">Talk to Strangers</Link>
            <Link to="/chat-tips" className="btn btn-outline btn-sm">Chat Tips</Link>
            <Link to="/safety" className="btn btn-outline btn-sm">Safety Center</Link>
          </div>
        </section>
      </article>
    </PublicLayout>
  );
};

export default RandomChatPage;

