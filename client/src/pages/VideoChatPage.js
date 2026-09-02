import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { useSeoMeta } from '../utils/seo';

const VideoChatPage = () => {
  useSeoMeta({
    title: 'Video Chat with New People — Browser Based | Vibe Talk',
    description:
      'Start video chat on Vibe Talk from your browser. Meet new people online with quick matching and user safety controls.',
    canonicalPath: '/video-chat',
  });

  return (
    <PublicLayout>
      <article className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-extrabold">Video Chat on Vibe Talk</h1>
          <p className="text-base-content/70 leading-relaxed">
            Video chat lets you connect face-to-face with new people in real time. Vibe Talk runs in your
            browser, so you can get started quickly on desktop or mobile.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Before you start</h2>
          <ul className="list-disc pl-5 text-base-content/75 space-y-1">
            <li>Use a stable internet connection for smoother calls.</li>
            <li>Do not reveal sensitive personal details to strangers.</li>
            <li>Use block/report tools if someone violates community rules.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Who this page is for</h2>
          <p className="text-base-content/70">
            This page is for users who want quick online video conversations, language practice, and social
            discovery while keeping control over who they continue talking to.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Related pages</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link to="/random-chat" className="btn btn-outline btn-sm">Random Chat</Link>
            <Link to="/talk-to-strangers" className="btn btn-outline btn-sm">Talk to Strangers</Link>
            <Link to="/omegle-alternative" className="btn btn-outline btn-sm">Omegle Alternative</Link>
            <Link to="/safety" className="btn btn-outline btn-sm">Safety Center</Link>
          </div>
        </section>
      </article>
    </PublicLayout>
  );
};

export default VideoChatPage;

