import React from 'react';
import PublicLayout from '../components/PublicLayout';
import { useSeoMeta } from '../utils/seo';

const SafetyPage = () => {
  useSeoMeta({
    title: 'Safety Center — Vibe Talk',
    description:
      'Read Vibe Talk safety guidelines, moderation approach, and user reporting steps for safer online conversations.',
    canonicalPath: '/safety',
  });

  return (
    <PublicLayout>
      <article className="max-w-3xl mx-auto px-4 py-12 space-y-5 text-sm text-base-content/80 leading-relaxed">
        <h1 className="text-3xl font-extrabold text-base-content mb-2">Vibe Talk Safety Center</h1>
        <p>
          Vibe Talk is built for friendly conversation. We do not promise a risk-free platform, but we provide
          controls to help users stay safer while chatting with new people online.
        </p>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Community rules</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>No harassment, hate speech, threats, or abusive behavior.</li>
            <li>No scams, impersonation, spam, or malicious links.</li>
            <li>No sharing private personal information in public or direct chats.</li>
            <li>No explicit or illegal content.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Reporting and blocking</h2>
          <p>
            If a user behaves inappropriately, use in-app controls to block or report that user immediately.
            After reporting, leave the conversation and continue only with users you trust.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Safety tips for users</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Do not share phone numbers, OTPs, passwords, or payment details.</li>
            <li>Avoid opening unknown links or downloading files from strangers.</li>
            <li>End chats quickly if someone pressures you, asks for money, or feels suspicious.</li>
            <li>Use profile and privacy settings to control your visibility.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Support contact</h2>
          <p>
            For urgent safety concerns or policy questions, contact: <strong>support@vibetalk.me</strong>
          </p>
        </section>
      </article>
    </PublicLayout>
  );
};

export default SafetyPage;

