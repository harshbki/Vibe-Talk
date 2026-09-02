import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { useSeoMeta } from '../utils/seo';

const OmegleAlternativePage = () => {
  useSeoMeta({
    title: 'Omegle Alternative for Random Chat | Vibe Talk',
    description:
      'Vibe Talk is an Omegle alternative focused on random chat, video calls, groups, and practical user safety controls.',
    canonicalPath: '/omegle-alternative',
  });

  return (
    <PublicLayout>
      <article className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-extrabold">Vibe Talk as an Omegle Alternative</h1>
          <p className="text-base-content/70 leading-relaxed">
            If you are searching for an Omegle alternative, Vibe Talk offers random matching, video chat, and
            interest-based groups in one platform with clearer safety guidance.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">What makes it useful</h2>
          <ul className="list-disc pl-5 text-base-content/75 space-y-1">
            <li>Guest-friendly onboarding with quick chat start.</li>
            <li>Text and video experiences with group-based discovery.</li>
            <li>Blocking and reporting flow for moderation support.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Expectation setting</h2>
          <p className="text-base-content/70">
            No random chat platform can guarantee perfect behavior from all users. Always use privacy-safe
            practices and report rule violations promptly.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Related pages</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link to="/random-chat" className="btn btn-outline btn-sm">Random Chat</Link>
            <Link to="/video-chat" className="btn btn-outline btn-sm">Video Chat</Link>
            <Link to="/talk-to-strangers" className="btn btn-outline btn-sm">Talk to Strangers</Link>
            <Link to="/safety" className="btn btn-outline btn-sm">Safety Center</Link>
          </div>
        </section>
      </article>
    </PublicLayout>
  );
};

export default OmegleAlternativePage;

