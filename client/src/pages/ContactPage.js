import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import PublicPageHero from '../components/PublicPageHero';

const CONTACT_DEPARTMENTS = [
  {
    icon: '💬',
    label: 'General User Support',
    email: 'support@vibetalk.me',
    desc: 'Assistance with guest login, account settings, connection issues, or bug reports.',
    sla: 'Response within 24–48 hours',
  },
  {
    icon: '🛡️',
    label: 'Safety & Abuse Reports',
    email: 'safety@vibetalk.me',
    desc: 'Report harassment, inappropriate video conduct, minors, or community violations.',
    sla: 'Urgent priority: within 12–24 hours',
  },
  {
    icon: '🔒',
    label: 'Privacy & Data Protection',
    email: 'privacy@vibetalk.me',
    desc: 'Requests for data deletion, GDPR/CCPA inquiries, or telemetry questions.',
    sla: 'Response within 3 business days',
  },
  {
    icon: '⚖️',
    label: 'Legal, DMCA & Partnerships',
    email: 'legal@vibetalk.me',
    desc: 'Official inquiries, copyright notices, terms compliance, or business proposals.',
    sla: 'Response within 3–5 business days',
  },
];

const ContactPage = () => {
  useEffect(() => {
    document.title = 'Contact Support & Safety Team — Vibe Talk | vibetalk.me';
  }, []);

  return (
    <PublicLayout>
      <PublicPageHero
        title="Contact Us"
        subtitle="We're here to help. Reach out to our dedicated support, safety, and privacy teams."
        emoji="✉️"
      />
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16 space-y-12">
        <section className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content mb-3">
            How Can We Help You?
          </h2>
          <p className="text-sm sm:text-base text-base-content/70">
            Choose the relevant department below for the fastest assistance. We take community feedback and safety reports very seriously.
          </p>
        </section>

        {/* 4 Departments Grid */}
        <section className="grid sm:grid-cols-2 gap-4">
          {CONTACT_DEPARTMENTS.map((c) => (
            <div key={c.email} className="card bg-base-100 border border-base-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <h3 className="font-bold text-base text-base-content leading-tight">{c.label}</h3>
                    <span className="text-[11px] text-primary font-medium">{c.sla}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed mb-4">{c.desc}</p>
              </div>
              <div>
                <a
                  href={`mailto:${c.email}?subject=Inquiry%20via%20VibeTalk.me`}
                  className="btn btn-outline btn-primary btn-sm w-full gap-2"
                >
                  <span>Email {c.email}</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>
          ))}
        </section>

        {/* Self-Service Quick Links */}
        <section className="card bg-base-200/40 border border-base-200 p-6 rounded-2xl text-center space-y-3">
          <h3 className="font-bold text-base text-base-content">Looking for Quick Answers?</h3>
          <p className="text-xs sm:text-sm text-base-content/70 max-w-lg mx-auto">
            You may find immediate answers in our educational guides and policies without waiting for an email response:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/how-it-works" className="btn btn-sm btn-ghost">How It Works</Link>
            <Link to="/safety" className="btn btn-sm btn-ghost">Safety Tips</Link>
            <Link to="/articles" className="btn btn-sm btn-ghost">Articles &amp; Guides</Link>
            <Link to="/privacy" className="btn btn-sm btn-ghost">Privacy Policy</Link>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link to="/start" className="btn btn-primary font-bold px-8">
            Start Chatting Now &rarr;
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ContactPage;
