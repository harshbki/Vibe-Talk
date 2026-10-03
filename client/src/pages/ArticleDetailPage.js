import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import AdBanner from '../components/AdBanner';
import { getArticleBySlug } from '../api';
import publicArticles from '../data/publicArticles';

const setArticleMeta = (article, slug) => {
  const canonical = document.head.querySelector('link[rel="canonical"]');
  const description = article.excerpt || `Read ${article.title} on Vibe Talk.`;
  document.title = `${article.title} — Vibe Talk`;
  if (canonical) canonical.setAttribute('href', `https://vibetalk.me/articles/${slug}`);
  const descriptionMeta = document.head.querySelector('meta[name="description"]');
  if (descriptionMeta) descriptionMeta.setAttribute('content', description);
  const ogUrl = document.head.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', `https://vibetalk.me/articles/${slug}`);
  const ogTitle = document.head.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', `${article.title} — Vibe Talk`);
  const ogDescription = document.head.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute('content', description);
  const twitterTitle = document.head.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) twitterTitle.setAttribute('content', `${article.title} — Vibe Talk`);
  const twitterDescription = document.head.querySelector('meta[name="twitter:description"]');
  if (twitterDescription) twitterDescription.setAttribute('content', description);
};

const setArticleNotFoundMeta = () => {
  document.title = 'Article Not Found — Vibe Talk';
  const robots = document.head.querySelector('meta[name="robots"]');
  if (robots) robots.setAttribute('content', 'noindex, nofollow');
};

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(false);
    const loadArticle = async () => {
      try {
        let data;
        try {
          data = await getArticleBySlug(slug);
        } catch (requestError) {
          data = publicArticles.find((item) => item.slug === slug);
          if (!data) throw requestError;
        }
        if (!active) return;
        setArticle(data);
        setArticleMeta(data, slug);
      } catch (requestError) {
        if (active) {
          console.error('Article load error:', requestError);
          setArticleNotFoundMeta();
          setError(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadArticle();
    return () => {
      active = false;
    };
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
            <div className="mt-10 pt-8 border-t border-base-200">
              <AdBanner slot="public-inline" className="min-h-[90px]" />
            </div>
          </>
        )}
      </article>
    </PublicLayout>
  );
};

export default ArticleDetailPage;
