import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import PublicPageHero from '../components/PublicPageHero';

const SafetyPage = () => {
  useEffect(() => {
    document.title = 'Safety — Vibe Talk | Chat Safely Online';
  }, []);

  return (
    <PublicLayout>
      <PublicPageHero
        title="Safety Center"
        subtitle="How to stay safe while chatting with strangers on Vibe Talk."
        emoji="🛡️"
      />
      <article className="max-w-3xl mx-auto px-4 py-10 sm:py-14 text-sm text-base-content/80 leading-relaxed space-y-6">
        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Our commitment</h2>
          <p>
            Vibe Talk is built for friendly conversation — not dating, harassment, or scams. We provide
            tools and guidelines to help you chat safely with strangers online.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Safety tips</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Never share passwords, OTPs, bank details, or home address.</li>
            <li>Do not send intimate photos or videos to strangers.</li>
            <li>Be cautious with links — phishing and scams are common on chat sites.</li>
            <li>Use a nickname — avoid sharing your real full name publicly as a guest.</li>
            <li>Leave or block if someone makes you uncomfortable.</li>
            <li>Report abuse through Settings or contact us.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Video chat safety</h2>
          <p>
            Only enable video when you feel comfortable. Ensure your background does not reveal personal
            information. You can end a call at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Underage users</h2>
          <p>
            Vibe Talk is for adults 18+. If you encounter someone who appears underage, stop chatting and
            report immediately.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Report a problem</h2>
          <p>
            Email <a href="mailto:safety@vibetalk.me" className="link link-primary">safety@vibetalk.me</a> or
            visit our <Link to="/contact" className="link link-primary">Contact</Link> page.
          </p>
        </section>

        <Link to="/start" className="btn btn-primary">Start Chatting Safely →</Link>
      </article>
    </PublicLayout>
  );
};

export default SafetyPage;
