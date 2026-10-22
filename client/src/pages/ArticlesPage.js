import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import PublicPageHero from '../components/PublicPageHero';
import AdBanner from '../components/AdBanner';
import { getArticles } from '../api';
import publicArticles from '../data/publicArticles';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'Articles, Tips & Safety Guides — Vibe Talk Blog | vibetalk.me';
    const loadArticles = async () => {
      try {
        const remoteArticles = await getArticles();
        setArticles(remoteArticles.length > 0 ? remoteArticles : publicArticles);
      } catch (error) {
        console.error('Article list load error:', error);
        setArticles(publicArticles);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const filteredArticles = articles.filter((a) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      a.title?.toLowerCase().includes(query) ||
      a.excerpt?.toLowerCase().includes(query) ||
      a.body?.toLowerCase().includes(query)
    );
  });

  return (
    <PublicLayout>
      <PublicPageHero
        title="Articles, Guides &amp; Chat Tips"
        subtitle="Practical guides on safe chatting, making friends online, and getting the most out of Vibe Talk."
        emoji="📝"
      />
      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16 space-y-8">
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-base-200">
          <div>
            <h2 className="text-xl font-extrabold text-base-content">All Published Guides</h2>
            <p className="text-xs text-base-content/60">Written &amp; reviewed by the VibeTalk Safety Team</p>
          </div>
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered input-sm w-full rounded-xl text-xs"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16 text-base-content/60 space-y-3">
            <p className="text-base font-semibold">No articles found matching &quot;{searchQuery}&quot;</p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="btn btn-outline btn-xs"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((a) => {
              const readTime = a.body
                ? Math.max(1, Math.ceil(a.body.split(/\s+/).length / 200))
                : 3;

              return (
                <Link
                  key={a._id || a.slug}
                  to={`/articles/${a.slug}`}
                  className="card bg-base-100 border border-base-200 hover:border-primary/50 hover:shadow-lg transition-all rounded-2xl flex flex-col justify-between p-6 group"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-base-content/50 mb-3">
                      <span className="badge badge-ghost badge-xs font-semibold">Safety &amp; Tips</span>
                      <span>⏱️ {readTime} min read</span>
                    </div>

                    <h3 className="font-bold text-base text-base-content group-hover:text-primary leading-snug mb-2 transition-colors">
                      {a.title}
                    </h3>

                    {a.excerpt && (
                      <p className="text-xs text-base-content/65 line-clamp-3 leading-relaxed">
                        {a.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-base-200/60 flex items-center justify-between text-xs">
                    <span className="text-base-content/40">
                      {new Date(a.createdAt || '2026-10-03').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="font-semibold text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Read &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Ad Slot Below Article Grid */}
        <div className="py-6 flex justify-center">
          <AdBanner slot="public-inline" />
        </div>

        {/* Bottom CTA */}
        <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 p-8 rounded-2xl text-center space-y-3">
          <h3 className="text-xl font-bold text-base-content">Ready to Put These Tips Into Practice?</h3>
          <p className="text-xs sm:text-sm text-base-content/70 max-w-md mx-auto">
            Connect with friendly people worldwide right now. 100% free, anonymous, and no app required.
          </p>
          <Link to="/start" className="btn btn-primary font-bold px-8">
            Start Chatting in 5 Seconds &rarr;
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ArticlesPage;
