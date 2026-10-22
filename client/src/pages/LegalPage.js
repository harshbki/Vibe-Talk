import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import PublicPageHero from '../components/PublicPageHero';

const TERMS_SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using Vibe Talk (vibetalk.me) via web browser or mobile interface, you agree to be bound by these Terms and Conditions, our Privacy Policy, and our Community Guidelines. If you do not agree to all terms, do not access or use our services.',
  },
  {
    title: '2. User Age & Eligibility Requirements',
    body: 'You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to use Vibe Talk. By using the platform, you represent and warrant that you are 18 or older. Minors are strictly prohibited from using the platform.',
  },
  {
    title: '3. Prohibited Conduct & Content Standards',
    body: 'You agree not to use Vibe Talk to: transmit unlawful, defamatory, harassing, sexually explicit, abusive, or obscene material; engage in hate speech or intimidation; upload malware or automated scripts; impersonate any individual or entity; collect or publish private personal information (doxxing); or engage in commercial spam, solicitation, or fraud. Child Sexual Abuse Material (CSAM) is strictly prohibited and subject to immediate law enforcement referral.',
  },
  {
    title: '4. Anonymous Chat & Peer Disclaimers',
    body: 'Vibe Talk provides spontaneous text and video matchmaking between strangers. While we employ proactive automated filters and fast reporting tools, we cannot pre-screen all real-time peer interactions. You assume full personal responsibility for your communications, boundaries, and disclosure of any information during live sessions.',
  },
  {
    title: '5. Intellectual Property & License',
    body: 'All trademarks, logos, UI designs, code, and proprietary assets on vibetalk.me are the intellectual property of Vibe Talk. You are granted a personal, revocable, non-transferable license to access the platform for individual, non-commercial use.',
  },
  {
    title: '6. Limitation of Liability',
    body: 'To the fullest extent permitted by applicable law, Vibe Talk and its operators shall not be liable for any indirect, incidental, special, or consequential damages resulting from user conduct, inability to use the service, or unauthorized third-party access.',
  },
  {
    title: '7. Advertising & Monetization Notice',
    body: 'Vibe Talk is provided free of charge and is supported in part by third-party advertising networks (including Google AdSense). Advertisements comply with global publisher policies and Google advertising guidelines.',
  },
  {
    title: '8. Governing Law & Dispute Resolution',
    body: 'These Terms are governed by and construed in accordance with the laws of India, without regard to conflict of law principles. Any legal proceedings shall be subject to the exclusive jurisdiction of the competent courts located in India.',
  },
];

const LegalPage = () => {
  useEffect(() => {
    document.title = 'Terms & Conditions of Service — Vibe Talk | vibetalk.me';
  }, []);

  return (
    <PublicLayout>
      <PublicPageHero
        title="Terms &amp; Conditions"
        subtitle="The legal framework and user agreement governing the use of vibetalk.me."
        emoji="📋"
      />

      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16 space-y-10">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 text-xs text-slate-500">
          <span>Last Updated: October 2026</span>
          <span>Version: 2.4</span>
        </div>

        <section className="space-y-6">
          {TERMS_SECTIONS.map((sec) => (
            <div key={sec.title} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-2">
              <h2 className="text-base font-bold text-slate-900">{sec.title}</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{sec.body}</p>
            </div>
          ))}
        </section>

        <section className="bg-slate-50/70 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-2">
          <h3 className="text-base font-bold text-slate-900">Questions or Legal Inquiries?</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            For formal legal inquiries, DMCA notices, or terms clarification, please contact our legal team at{' '}
            <a href="mailto:legal@vibetalk.me" className="text-indigo-600 font-bold hover:underline">
              legal@vibetalk.me
            </a>.
          </p>
        </section>

        <section className="border-t border-slate-200 pt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-indigo-600 font-semibold hover:underline">
              Privacy Policy &rarr;
            </Link>
            <Link to="/safety" className="text-indigo-600 font-semibold hover:underline">
              Safety Center &rarr;
            </Link>
            <Link to="/community-guidelines" className="text-indigo-600 font-semibold hover:underline">
              Community Guidelines &rarr;
            </Link>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default LegalPage;