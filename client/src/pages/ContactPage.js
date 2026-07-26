import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import PublicPageHero from '../components/PublicPageHero';

const ContactPage = () => {
  useEffect(() => {
    document.title = 'Contact Us — Vibe Talk | vibetalk.me';
  }, []);

  return (
    <PublicLayout>
      <PublicPageHero title="Contact Us" subtitle="We're here to help with support, safety, and privacy." emoji="✉️" />
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14 space-y-8">
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'General support', email: 'support@vibetalk.me' },
            { label: 'Privacy requests', email: 'privacy@vibetalk.me' },
            { label: 'Safety reports', email: 'safety@vibetalk.me' },
            { label: 'Legal inquiries', email: 'legal@vibetalk.me' },
          ].map((c) => (
            <div key={c.email} className="card bg-base-200/40 border border-base-200">
              <div className="card-body p-5">
                <p className="font-semibold text-sm">{c.label}</p>
                <a href={`mailto:${c.email}`} className="link link-primary text-sm">
                  {c.email}
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-base-content/70 leading-relaxed">
          For abuse on the platform, use in-app reporting where available and email{' '}
          <a href="mailto:safety@vibetalk.me" className="link link-primary">safety@vibetalk.me</a>.
          We aim to respond within 3–5 business days.
        </p>
        <Link to="/start" className="btn btn-primary">Start Chatting →</Link>
      </div>
    </PublicLayout>
  );
};

export default ContactPage;
