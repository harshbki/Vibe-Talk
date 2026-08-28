import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { getArticles } from '../api';
import { useSeoMeta } from '../utils/seo';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useSeoMeta({
    title: 'Articles — Vibe Talk Blog & Chat Tips',
    description:
      'Read Vibe Talk articles about online chat safety, conversation tips, and making better connections online.',
    canonicalPath: '/articles',
  });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles();
        setArticles(data);
      } catch (error) {
        console.error('Fetch articles error:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold mb-2">Articles</h1>
        <p className="text-base-content/60 mb-8 text-sm">
          Tips, guides, and updates about online chat, making friends, and using Vibe Talk safely.
        </p>

        {loading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 text-base-content/50">
            <p>No articles yet. Check back soon!</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {articles.map((a) => (
              <li key={a._id}>
                <Link
                  to={`/articles/${a.slug}`}
                  className="card bg-base-100 border border-base-200 hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="card-body p-5">
                    <h2 className="font-bold text-lg hover:text-primary">{a.title}</h2>
                    {a.excerpt && (
                      <p className="text-sm text-base-content/65 line-clamp-2">{a.excerpt}</p>
                    )}
                    <p className="text-xs text-base-content/40 mt-1">
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
      </div>
    </PublicLayout>
  );
};

export default ArticlesPage;
