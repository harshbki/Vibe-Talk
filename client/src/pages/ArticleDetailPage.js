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

  // Inject Article & BreadcrumbList JSON-LD
  let script = document.getElementById('article-structured-data');
  if (!script) {
    script = document.createElement('script');
    script.id = 'article-structured-data';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: article.title,
        description: description,
        datePublished: article.createdAt || '2026-10-03T00:00:00.000Z',
        author: {
          '@type': 'Organization',
          name: 'VibeTalk Safety & Editorial Team',
          url: 'https://vibetalk.me/about',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Vibe Talk',
          url: 'https://vibetalk.me/',
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://vibetalk.me/articles/${slug}`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://vibetalk.me/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Articles',
            item: 'https://vibetalk.me/articles',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title,
            item: `https://vibetalk.me/articles/${slug}`,
          },
        ],
      },
    ],
  };
  script.textContent = JSON.stringify(structuredData);
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
  const [copied, setCopied] = useState(false);

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get 3 related articles
  const relatedArticles = publicArticles
    .filter((a) => a.slug !== slug)
    .slice(0, 3);

  // Approximate reading time
  const readingTime = article?.body
    ? Math.max(1, Math.ceil(article.body.split(/\s+/).length / 200))
    : 3;

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-base-content/60 mb-6 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>›</span>
          <Link to="/articles" className="hover:text-primary transition-colors">Articles</Link>
          <span>›</span>
          <span className="text-base-content font-medium truncate max-w-xs">{article?.title || 'Article'}</span>
        </nav>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : error || !article ? (
          <div className="text-center py-16 space-y-4">
            <h1 className="text-2xl font-bold">Article Not Found</h1>
            <p className="text-base-content/60">The guide you are looking for may have been moved or updated.</p>
            <Link to="/articles" className="btn btn-primary btn-sm">
              &larr; Return to All Articles
            </Link>
          </div>
        ) : (
          <article>
            {/* Article Header */}
            <header className="mb-8 border-b border-base-200 pb-6">
              <div className="flex items-center gap-3 text-xs text-base-content/60 mb-3 flex-wrap">
                <span className="badge badge-primary badge-sm font-semibold">Verified Guide</span>
                <span>•</span>
                <span>⏱️ {readingTime} min read</span>
                <span>•</span>
                <time dateTime={article.createdAt || '2026-10-03'}>
                  {new Date(article.createdAt || '2026-10-03').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-base-content leading-tight mb-4">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="text-base sm:text-lg text-base-content/75 leading-relaxed font-normal">
                  {article.excerpt}
                </p>
              )}

              {/* Author & Share Bar */}
              <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-base-200/60 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    VT
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-tight">VibeTalk Editorial &amp; Safety Team</p>
                    <p className="text-xs text-base-content/50">Reviewed for Community Wellbeing</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="btn btn-ghost btn-sm text-xs gap-1.5"
                >
                  {copied ? '✓ Copied!' : '🔗 Share Link'}
                </button>
              </div>
            </header>

            {/* Main Article Body */}
            <div className="prose prose-base sm:prose-lg max-w-none text-base-content/85 leading-relaxed whitespace-pre-wrap space-y-4">
              {article.body}
            </div>

            {/* In-content Clean Ad Slot */}
            <div className="my-10 pt-6 border-t border-base-200 flex justify-center">
              <AdBanner slot="public-inline" />
            </div>

            {/* Safety Reminder Card */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 my-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-base-content">Ready to try safe online chat?</h3>
                <p className="text-xs sm:text-sm text-base-content/70 mt-1">
                  Chat with friendly strangers worldwide in 5 seconds without registration.
                </p>
              </div>
              <Link to="/start" className="btn btn-primary btn-sm sm:btn-md shrink-0">
                Start Chatting &rarr;
              </Link>
            </div>

            {/* Related Articles Section */}
            {relatedArticles.length > 0 && (
              <section className="mt-14 pt-8 border-t border-base-200">
                <h2 className="text-xl font-extrabold text-base-content mb-6">Related Guides &amp; Tips</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {relatedArticles.map((rel) => (
                    <Link
                      key={rel._id || rel.slug}
                      to={`/articles/${rel.slug}`}
                      className="card bg-base-100 border border-base-200 hover:border-primary/50 hover:shadow-md transition-all p-4 rounded-xl flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="font-bold text-sm text-base-content hover:text-primary leading-snug line-clamp-2">
                          {rel.title}
                        </h3>
                        {rel.excerpt && (
                          <p className="text-xs text-base-content/60 line-clamp-2 mt-2 leading-relaxed">
                            {rel.excerpt}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-primary mt-4 inline-block">
                        Read Guide &rarr;
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>
        )}
      </div>
    </PublicLayout>
  );
};

export default ArticleDetailPage;
