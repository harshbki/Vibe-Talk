import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import PublicPageHero from '../components/PublicPageHero';

const CommunityGuidelinesPage = () => {
  useEffect(() => {
    document.title = 'Community Guidelines — Vibe Talk';
  }, []);

  return (
    <PublicLayout>
      <PublicPageHero
        title="Community Guidelines"
        subtitle="Help us keep Vibe Talk friendly, clean, and welcoming."
        emoji="🤝"
      />
      <article className="max-w-3xl mx-auto px-4 py-10 sm:py-14 text-sm text-base-content/80 leading-relaxed space-y-6">
        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Be respectful</h2>
          <p>Treat others as you want to be treated. No insults, bullying, or targeted harassment.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Friendship, not dating</h2>
          <p>
            Vibe Talk is for making friends and conversation. Do not flirt aggressively, send unsolicited
            sexual content, or use the platform for dating pickup lines.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">No spam or bots</h2>
          <p>Automated messaging, advertising spam, and fake accounts are prohibited.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Illegal content</h2>
          <p>
            Zero tolerance for illegal activity, violence threats, CSAM, or content that exploits minors.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Consequences</h2>
          <p>
            Violations may result in warnings, temporary bans, or permanent account removal. Serious
            violations may be reported to authorities.
          </p>
        </section>
        <p className="text-xs text-base-content/50">
          See also: <Link to="/legal" className="link">Terms</Link> ·{' '}
          <Link to="/safety" className="link">Safety</Link>
        </p>
      </article>
    </PublicLayout>
  );
};

export default CommunityGuidelinesPage;
