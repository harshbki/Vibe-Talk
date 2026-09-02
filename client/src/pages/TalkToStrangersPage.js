import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { useSeoMeta } from '../utils/seo';

const TalkToStrangersPage = () => {
  useSeoMeta({
    title: 'Talk to Strangers Online Safely | Vibe Talk',
    description:
      'Learn how to talk to strangers online with better safety habits, moderation-aware behavior, and respectful conversation practices.',
    canonicalPath: '/talk-to-strangers',
  });

  return (
    <PublicLayout>
      <article className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-extrabold">Talk to Strangers Online</h1>
          <p className="text-base-content/70 leading-relaxed">
            Talking to strangers can be useful for social connection and discovering different perspectives.
            The best experience comes from respectful communication and strong personal safety habits.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">How to keep conversations healthy</h2>
          <ul className="list-disc pl-5 text-base-content/75 space-y-1">
            <li>Start with simple, neutral topics and avoid pressure-based conversation.</li>
            <li>Set boundaries early if a discussion becomes uncomfortable.</li>
            <li>Leave chats that feel unsafe or manipulative.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">What not to share</h2>
          <p className="text-base-content/70">
            Do not share your home address, financial details, OTPs, passwords, private photos, or identity
            documents with anyone you meet online.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Related pages</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link to="/random-chat" className="btn btn-outline btn-sm">Random Chat</Link>
            <Link to="/video-chat" className="btn btn-outline btn-sm">Video Chat</Link>
            <Link to="/chat-tips" className="btn btn-outline btn-sm">Chat Tips</Link>
            <Link to="/safety" className="btn btn-outline btn-sm">Safety Center</Link>
          </div>
        </section>
      </article>
    </PublicLayout>
  );
};

export default TalkToStrangersPage;

