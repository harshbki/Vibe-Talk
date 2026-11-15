import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import PublicPageHero from '../components/PublicPageHero';

const DISCLAIMER_SECTIONS = [
  {
    title: '1. General Website & Informational Disclaimer',
    content: (
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        The information provided by <strong>Vibe Talk (vibetalk.me)</strong> on our website, articles, and safety guides is published in good faith for general educational and informational purposes only. While we endeavor to keep the content accurate and up to date, Vibe Talk makes no warranties of any kind regarding completeness, accuracy, or suitability of any editorial guides or communications.
      </p>
    ),
  },
  {
    title: '2. User-Generated Interactions & Real-Time Communications',
    content: (
      <>
        <p className="mb-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
          Vibe Talk provides an online communication conduit facilitating peer-to-peer WebRTC video calling and anonymous guest text chat between independent users. By using the service, you acknowledge and agree that:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
          <li>Conversations, audio streams, and video calls are initiated directly between participants. Statements, opinions, or materials shared by users do not reflect the views or policies of Vibe Talk.</li>
          <li>Users are solely responsible for protecting their personal privacy, withholding real-world identifying details, and exercising sound personal judgment during live calls.</li>
          <li>Vibe Talk provides immediate one-tap "Next / Disconnect", user reporting, and blocking tools to empower participants to terminate unwanted interactions instantly.</li>
        </ul>
      </>
    ),
  },
  {
    title: '3. 18+ Adult Platform Notice',
    content: (
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        Vibe Talk is strictly intended for individuals aged 18 years and older. Minors are strictly prohibited from using our random matchmaking and video call services. If you suspect an underage user is utilizing the platform, please utilize the in-call reporting system or contact our safety desk immediately at <a href="mailto:support@vibetalk.me" className="text-indigo-600 underline font-semibold">support@vibetalk.me</a>.
      </p>
    ),
  },
  {
    title: '4. Third-Party Advertising & Publisher Transparency',
    content: (
      <>
        <p className="mb-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
          To maintain free, open-access server infrastructure and low-latency WebRTC routing without requiring subscriptions or coins, Vibe Talk displays non-intrusive third-party digital advertising:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
          <li><strong>Google AdSense &amp; Partners:</strong> Third-party vendors, including Google, use cookies to serve ads based on prior visits to our website or other websites on the internet.</li>
          <li>Users may opt out of personalized advertising by visiting Google Ad Settings (<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">google.com/settings/ads</a>) or through industry opt-out portals such as <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">aboutads.info</a>.</li>
          <li>Advertisements displayed do not constitute an explicit endorsement by Vibe Talk of any advertised product, application, or service.</li>
        </ul>
      </>
    ),
  },
  {
    title: '5. External Links & Fair Use Notice',
    content: (
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        Our website and articles may contain hyperlinks to external sites not operated by Vibe Talk. While we strive to provide links only to quality and ethical resources, we have no control over the content and nature of these external sites. Following any external link is done entirely at your own discretion.
      </p>
    ),
  },
  {
    title: '6. Editorial & Publisher Inquiries',
    content: (
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        For questions concerning our editorial standards, publisher policies, or legal disclaimers, please reach out directly to our publishing team via email at <a href="mailto:support@vibetalk.me" className="text-indigo-600 underline font-semibold">support@vibetalk.me</a>.
      </p>
    ),
  },
];

const DisclaimerPage = () => {
  useEffect(() => {
    document.title = 'Disclaimer & Publisher Policy — Vibe Talk';
    const desc = document.head.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute(
        'content',
        'Official Disclaimer, publisher transparency policy, and advertising disclosure for Vibe Talk (vibetalk.me).'
      );
    }
  }, []);

  return (
    <PublicLayout>
      <PublicPageHero
        emoji="⚖️"
        title="Disclaimer &amp; Publisher Policy"
        subtitle="Transparent disclosures concerning user safety, real-time communications, and third-party advertising."
      />

      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-10">
          <div className="border-b border-slate-200/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <span>Last Updated: November 15, 2026</span>
            <span className="font-semibold text-indigo-600">Official Publisher Document</span>
          </div>

          {DISCLAIMER_SECTIONS.map((sec) => (
            <section key={sec.title} className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-l-4 border-indigo-600 pl-3">
                {sec.title}
              </h2>
              {sec.content}
            </section>
          ))}

          <div className="pt-8 border-t border-slate-200/80 flex flex-wrap gap-4 text-xs font-semibold text-indigo-600">
            <Link to="/privacy" className="hover:underline">Privacy Policy &rarr;</Link>
            <Link to="/legal" className="hover:underline">Terms of Service &rarr;</Link>
            <Link to="/safety" className="hover:underline">Safety Guidelines &rarr;</Link>
            <Link to="/contact" className="hover:underline">Contact Publisher &rarr;</Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default DisclaimerPage;
