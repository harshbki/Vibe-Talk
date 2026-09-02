import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { useSeoMeta } from '../utils/seo';

const ChatTipsPage = () => {
  useSeoMeta({
    title: 'Online Chat Tips — Better Conversations | Vibe Talk',
    description:
      'Practical online chat tips for starting conversations, keeping chats respectful, and staying safer on random chat platforms.',
    canonicalPath: '/chat-tips',
  });

  return (
    <PublicLayout>
      <article className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-extrabold">Online Chat Tips</h1>
          <p className="text-base-content/70 leading-relaxed">
            Good chat experiences come from clear communication and mutual respect. Use these practical tips to
            improve conversations when meeting new people online.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Conversation tips</h2>
          <ul className="list-disc pl-5 text-base-content/75 space-y-1">
            <li>Open with simple questions instead of personal details.</li>
            <li>Keep messages short and clear in early conversations.</li>
            <li>Ask for consent before switching from text to video chat.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Safety tips</h2>
          <ul className="list-disc pl-5 text-base-content/75 space-y-1">
            <li>Use block/report immediately for harassment or scam attempts.</li>
            <li>Never share passwords, OTPs, or payment details.</li>
            <li>Exit any conversation that feels unsafe.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Related pages</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link to="/random-chat" className="btn btn-outline btn-sm">Random Chat</Link>
            <Link to="/video-chat" className="btn btn-outline btn-sm">Video Chat</Link>
            <Link to="/talk-to-strangers" className="btn btn-outline btn-sm">Talk to Strangers</Link>
            <Link to="/omegle-alternative" className="btn btn-outline btn-sm">Omegle Alternative</Link>
          </div>
        </section>
      </article>
    </PublicLayout>
  );
};

export default ChatTipsPage;

