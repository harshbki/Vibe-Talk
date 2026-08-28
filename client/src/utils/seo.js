import { useEffect } from 'react';

const SITE_URL = 'https://vibetalk.me';

const upsertMeta = (selector, attrs) => {
  let meta = document.head.querySelector(selector);
  if (!meta) {
    meta = document.createElement('meta');
    document.head.appendChild(meta);
  }
  Object.entries(attrs).forEach(([key, value]) => {
    meta.setAttribute(key, value);
  });
};

const upsertCanonical = (url) => {
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
};

const buildAbsoluteUrl = (pathOrUrl) => {
  if (!pathOrUrl) return SITE_URL;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
};

export const useSeoMeta = ({
  title,
  description,
  canonicalPath = '/',
  robots = 'index,follow',
  ogType = 'website',
}) => {
  useEffect(() => {
    const absoluteUrl = buildAbsoluteUrl(canonicalPath);
    const resolvedTitle = title || 'Vibe Talk — Free Random Chat & Video Call';
    const resolvedDescription =
      description ||
      'Vibe Talk is a free random chat platform with guest chat, video calls, and interest-based groups.';

    document.title = resolvedTitle;
    upsertMeta('meta[name="description"]', { name: 'description', content: resolvedDescription });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robots });

    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: ogType });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: absoluteUrl });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: resolvedTitle });
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: resolvedDescription,
    });

    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: resolvedTitle });
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: resolvedDescription,
    });

    upsertCanonical(absoluteUrl);
  }, [canonicalPath, description, ogType, robots, title]);
};

