import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import PublicPageHero from '../components/PublicPageHero';
import { getArticles } from '../api';
import publicArticles from '../data/publicArticles';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Articles & Chat Tips — Vibe Talk Blog';
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

  return (
    <PublicLayout>
      <PublicPageHero
        title="Articles & Tips"
        subtitle="Guides on safe chatting, making friends online, and using Vibe Talk."
        emoji="📝"
      />
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
        {loading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 text-base-content/50 space-y-4">
            <p>New articles coming soon.</p>
            <Link to="/start" className="btn btn-primary btn-sm">
              Start Chatting →
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {articles.map((a) => (
              <li key={a._id}>
                <Link
                  to={`/articles/${a.slug}`}
                  className="card bg-base-100 border border-base-200 hover:border-primary/40 hover:shadow-md transition-all block"
                >
                  <div className="card-body p-5 sm:p-6">
                    <h2 className="font-bold text-lg hover:text-primary">{a.title}</h2>
                    {a.excerpt && (
                      <p className="text-sm text-base-content/65 line-clamp-2 mt-1">{a.excerpt}</p>
                    )}
                    <p className="text-xs text-base-content/40 mt-2">
                      {new Date(a.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 pt-8 border-t border-base-200 text-center">
          <p className="text-sm text-base-content/60 mb-4">Ready to try what you learned?</p>
          <Link to="/start" className="btn btn-primary">Start Chatting →</Link>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ArticlesPage;
