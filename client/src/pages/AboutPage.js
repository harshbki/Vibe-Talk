import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

const GROUP_TOPICS = [
  { icon: '✈️', title: 'Travel', desc: 'Need ideas on traveling?' },
  { icon: '🚗', title: 'Cars', desc: 'Discuss your favorite cars.' },
  { icon: '🏅', title: 'Olympics', desc: 'Discuss current Olympic games.' },
  { icon: '🎵', title: 'Music', desc: 'Meet music lovers and share playlists.' },
  { icon: '🎮', title: 'Games', desc: 'Find gaming buddies and discuss new releases.' },
  { icon: '🎬', title: 'Movies', desc: 'Share movie picks and reviews.' },
  { icon: '🍕', title: 'Foodie', desc: 'Recipes, restaurants, and foodie chat.' },
  { icon: '🎌', title: 'Anime', desc: 'Recommendations and fan discussions.' },
  { icon: '🔬', title: 'Science', desc: 'Discuss discoveries and learn together.' },
  { icon: '📰', title: 'News', desc: 'Current events and world topics.' },
  { icon: '⚽', title: 'Sports', desc: 'Talk about matches, athletes, and teams.' },
  { icon: '😂', title: 'Memes', desc: 'Share and collect new memes.' },
  { icon: '🆕', title: 'Fresh Groups', desc: 'Newly created by the community.' },
  { icon: '⭐', title: 'Promoted', desc: 'Featured community groups.' },
  { icon: '💚', title: 'Wellness', desc: 'Supportive mental health chat.' },
];

const AboutPage = () => {
  useEffect(() => {
    document.title = 'About Vibe Talk — Free Random Chat & Groups';
  }, []);

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <h1 className="text-3xl font-extrabold">About Vibe Talk</h1>
        <p className="text-base-content/70 leading-relaxed">
          Vibe Talk is a free platform to talk to strangers, make friends online, enjoy random match chat,
          video calls, and interest-based groups — without complicated signup. We focus on a clean,
          female-friendly community where people can be social and responsible.
        </p>
        <p className="text-base-content/70 leading-relaxed">
          Unlike traditional chat-room sites, Vibe Talk uses <strong>Groups</strong> instead of public chat rooms.
          Create or join groups around topics you care about, message users directly, or use Random Match
          for instant connections.
        </p>

        <section id="groups" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4">Groups on Vibe Talk</h2>
          <p className="text-sm text-base-content/60 mb-6">
            After you join, head to Groups to create or discover communities like these:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GROUP_TOPICS.map((g) => (
              <div key={g.title} className="card bg-base-200/50 border border-base-200">
                <div className="card-body p-4">
                  <span className="text-2xl">{g.icon}</span>
                  <h3 className="font-bold">{g.title}</h3>
                  <p className="text-sm text-base-content/65">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/#start" className="btn btn-primary mt-6">
            Join &amp; Explore Groups →
          </Link>
        </section>
      </div>
    </PublicLayout>
  );
};

export default AboutPage;
