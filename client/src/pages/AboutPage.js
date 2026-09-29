import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import PublicPageHero from '../components/PublicPageHero';
import { GROUP_TOPICS } from '../data/landingContent';

const AboutPage = () => {
  useEffect(() => {
    document.title = 'About Vibe Talk — Free Random Chat & Groups | vibetalk.me';
  }, []);

  return (
    <PublicLayout>
      <PublicPageHero
        emoji="💬"
        title="About Vibe Talk"
        subtitle="A free, female-friendly platform to talk to strangers, random match, video call, and join interest-based groups."
      />
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14 space-y-8">
        <section className="prose prose-sm max-w-none text-base-content/80 leading-relaxed">
          <h1 className="text-2xl font-bold text-base-content mb-4">About Vibe Talk</h1>
          <p>
            <strong>Vibe Talk</strong> (vibetalk.me) is a free browser-based platform for random chat, text chat, video calls, groups, and meeting new people online. We help users make friends through guest chat, random match, direct messages, video calls, and topic-based <strong>Groups</strong> — without complicated registration.
          </p>
          <p>
            Unlike dating sites, Vibe Talk focuses on respectful conversation, genuine friendship, and a clean experience for everyone. Our community guidelines prioritize safety and harassment-free interaction — especially for women seeking a friendly place to chat.
          </p>
          <h2 className="text-lg font-bold text-base-content pt-4">How Vibe Talk Works</h2>
          <p>
            Start chatting in seconds with guest access — just choose a nickname. No phone number, email, or registration required. When you're ready, create a full profile to unlock direct messages, advanced filters, and group creation features.
          </p>
          <h2 className="text-lg font-bold text-base-content pt-4">Key Features</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Random Match</strong> — One-tap connection with strangers worldwide for text and video chat</li>
            <li><strong>Video Calls</strong> — Browser-based video chat without app download</li>
            <li><strong>Direct Messages</strong> — Private one-to-one conversations with people you meet</li>
            <li><strong>Groups</strong> — Interest-based communities (music, gaming, anime, travel, wellness, and more)</li>
            <li><strong>Guest Access</strong> — Start chatting immediately with just a nickname</li>
            <li><strong>Mobile Friendly</strong> — Works on Android, iPhone, desktop, and tablet</li>
            <li><strong>Free to Use</strong> — Basic features completely free with no hidden charges</li>
          </ul>
          <h2 className="text-lg font-bold text-base-content pt-4">Our Community Values</h2>
          <p>
            Vibe Talk is built for friendly conversation, not dating or harassment. We believe in:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Respect</strong> — Treat everyone with dignity and kindness</li>
            <li><strong>Safety</strong> — Tools and guidelines to protect users</li>
            <li><strong>Authenticity</strong> — Real conversations, not bots or spam</li>
            <li><strong>Inclusivity</strong> — Welcoming community for all backgrounds</li>
          </ul>
        </section>

        <section id="groups" className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4">Groups on Vibe Talk</h2>
          <p className="text-sm text-base-content/60 mb-6">
            After you join, explore or create groups like these:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {GROUP_TOPICS.map((g) => (
              <div key={g.title} className="card bg-base-200/40 border border-base-200">
                <div className="card-body p-4">
                  <span className="text-2xl">{g.icon}</span>
                  <h3 className="font-bold text-sm">{g.title}</h3>
                  <p className="text-xs text-base-content/60">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/start" className="btn btn-primary mt-6">
            Start Chatting →
          </Link>
        </section>

        <section className="text-sm text-base-content/60 border-t border-base-200 pt-6">
          <p>
            Questions? See our <Link to="/safety" className="link link-primary">Safety</Link>,{' '}
            <Link to="/contact" className="link link-primary">Contact</Link>, or{' '}
            <Link to="/articles" className="link link-primary">Articles</Link> pages.
          </p>
        </section>
      </div>
    </PublicLayout>
  );
};

export default AboutPage;
