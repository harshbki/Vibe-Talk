import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { getArticleBySlug } from '../api';
import { useSeoMeta } from '../utils/seo';

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useSeoMeta({
    title: article ? `${article.title} — Vibe Talk` : 'Article — Vibe Talk',
    description:
      article?.excerpt ||
      'Read this Vibe Talk article for practical tips on safer and better online conversations.',
    canonicalPath: `/articles/${slug}`,
  });

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await getArticleBySlug(slug);
        setArticle(data);
      } catch (fetchError) {
        console.error('Fetch article error:', fetchError);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  return (
    <PublicLayout>
      <article className="max-w-3xl mx-auto px-4 py-12">
        <Link to="/articles" className="text-sm text-primary hover:underline mb-6 inline-block">
          ← All articles
        </Link>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : error || !article ? (
          <p className="text-center text-base-content/60">Article not found.</p>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold mb-2">{article.title}</h1>
            <p className="text-xs text-base-content/40 mb-8">
              {new Date(article.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            {article.excerpt && (
              <p className="text-lg text-base-content/70 mb-6 font-medium">{article.excerpt}</p>
            )}
            <div className="prose prose-sm max-w-none text-base-content/85 whitespace-pre-wrap leading-relaxed">
              {article.body}
            </div>
          </>
        )}
      </article>
    </PublicLayout>
  );
};

export default ArticleDetailPage;
