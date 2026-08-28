import React from 'react';
import PublicLayout from '../components/PublicLayout';
import { useSeoMeta } from '../utils/seo';

const LegalPage = () => {
  useSeoMeta({
    title: 'Terms & Legal — Vibe Talk',
    description:
      'Review Vibe Talk terms, acceptable-use rules, and legal information for using the platform responsibly.',
    canonicalPath: '/legal',
  });

  return (
    <PublicLayout>
      <article className="max-w-3xl mx-auto px-4 py-12 space-y-4 text-sm text-base-content/80 leading-relaxed">
        <h1 className="text-3xl font-extrabold text-base-content mb-6">Terms &amp; Legal</h1>

        <h2 className="text-lg font-bold text-base-content">Acceptable use</h2>
        <p>
          Vibe Talk is for friendly conversation. Do not harass, spam, share illegal content, or impersonate others.
          Users must be 18+ or have parental consent where required by law.
        </p>

        <h2 className="text-lg font-bold text-base-content pt-4">No dating / flirting policy</h2>
        <p>
          This is a social chat platform focused on friendship and conversation — not a dating site.
          Be respectful in random match and group chats.
        </p>

        <h2 className="text-lg font-bold text-base-content pt-4">Disclaimer</h2>
        <p>
          Service is provided &quot;as is&quot;. We are not responsible for user-generated content or third-party links.
          Video calls and chats are between users; report abuse via settings.
        </p>

        <h2 className="text-lg font-bold text-base-content pt-4">Advertising</h2>
        <p>
          Free tier is supported by ads (Google AdSense, Monetag). Ad partners may use cookies per their policies.
        </p>

        <h2 className="text-lg font-bold text-base-content pt-4">Governing law</h2>
        <p>These terms are governed by applicable laws in India. Disputes subject to local jurisdiction.</p>
      </article>
    </PublicLayout>
  );
};

export default LegalPage;
