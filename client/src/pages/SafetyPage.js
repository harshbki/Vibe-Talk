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
          <h1 className="text-2xl font-bold text-base-content mb-4">Safety Center</h1>
          <h2 className="text-lg font-bold text-base-content mb-2">Our commitment</h2>
          <p>
            Vibe Talk is built for friendly conversation — not dating, harassment, or scams. We provide tools and guidelines to help you chat safely with strangers online. Our platform includes blocking, reporting, and moderation features to maintain a clean community.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Essential safety tips</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Protect personal information</strong> — Never share passwords, OTPs, bank details, credit card numbers, or home address.</li>
            <li><strong>Keep photos private</strong> — Do not send intimate, revealing, or compromising photos or videos to strangers.</li>
            <li><strong>Beware of links</strong> — Be cautious with external links — phishing, scams, and malware are common on chat sites.</li>
            <li><strong>Use a nickname</strong> — Avoid sharing your real full name, phone number, or email publicly as a guest.</li>
            <li><strong>Trust your instincts</strong> — Leave or block immediately if someone makes you uncomfortable or asks for money.</li>
            <li><strong>Report abuse</strong> — Use the block and report features in Settings, or email us directly.</li>
            <li><strong>No money requests</strong> — Never send money, gift cards, or financial assistance to anyone you meet online.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Video chat safety</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Only enable video when you feel comfortable — you control your camera.</li>
            <li>Ensure your background does not reveal personal information, documents, or location details.</li>
            <li>You can end a video call at any time — there's no obligation to continue.</li>
            <li>Report anyone who behaves inappropriately during video calls.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Recognizing scams</h2>
          <p>
            Common red flags include: requests for money, promises of quick wealth, pressure to share personal photos, links to suspicious websites, or someone claiming to be in an emergency needing immediate financial help. If you encounter any of these, block and report immediately.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Age requirement</h2>
          <p>
            Vibe Talk is strictly for adults 18 years and older. If you encounter someone who appears underage, stop chatting immediately and report them to our safety team. Parents: monitor your children's online activity and educate them about online safety.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Blocking and reporting</h2>
          <p>
            Use the block feature to stop receiving messages from specific users. Report serious violations including harassment, threats, scams, or inappropriate behavior to <a href="mailto:safety@vibetalk.me" className="link link-primary">safety@vibetalk.me</a>. We review all reports and take appropriate action.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-base-content mb-2">Need help?</h2>
          <p>
            Email <a href="mailto:safety@vibetalk.me" className="link link-primary">safety@vibetalk.me</a> or visit our <Link to="/contact" className="link link-primary">Contact</Link> page for assistance. For urgent safety concerns, disengage from the conversation immediately and block the user.
          </p>
        </section>

        <Link to="/start" className="btn btn-primary">Start Chatting Safely →</Link>
      </article>
    </PublicLayout>
  );
};

export default SafetyPage;
