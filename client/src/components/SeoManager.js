import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://vibetalk.me';
const DEFAULT_TITLE = 'Vibe Talk — Free Random Chat, Video Call & Meet Strangers Online';
const DEFAULT_DESCRIPTION =
  'Vibe Talk is a free browser-based platform for random chat, text chat, video calls, groups, and meeting new people online.';

const SEO_BY_PATH = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    robots: 'index, follow',
  },
  '/about': {
    title: 'About Vibe Talk — Free Random Chat & Groups',
    description:
      'Learn how Vibe Talk helps people meet new friends through guest chat, random matching, video calls, direct messages, and interest-based groups.',
  },
  '/privacy': {
    title: 'Privacy Policy — Vibe Talk',
    description: 'Read how Vibe Talk handles account, chat, media, and website information.',
  },
  '/legal': {
    title: 'Terms & Conditions — Vibe Talk',
    description: 'Read the terms for using Vibe Talk chat, groups, profiles, and video features.',
  },
  '/safety': {
    title: 'Safety Center — Vibe Talk',
    description: 'Practical safety guidance for chatting with strangers and using video chat on Vibe Talk.',
  },
  '/community-guidelines': {
    title: 'Community Guidelines — Vibe Talk',
    description: 'Review Vibe Talk guidelines for respectful, friendly, and safe conversations.',
  },
  '/cookies': {
    title: 'Cookies Policy — Vibe Talk',
    description: 'Learn how Vibe Talk uses cookies and similar technologies.',
  },
  '/contact': {
    title: 'Contact Vibe Talk',
    description: 'Find contact details for Vibe Talk support and safety questions.',
  },
  '/articles': {
    title: 'Articles & Chat Tips — Vibe Talk',
    description: 'Read practical guides about online conversation, meeting people, and safer chat.',
  },
};

const PRIVATE_PREFIXES = [
  '/start',
  '/login',
  '/admin',
  '/chat',
  '/users',
  '/match',
  '/profile',
  '/settings',
  '/groups',
  '/group',
  '/user',
];

const setMeta = (selector, attribute, value) => {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
};

const setCanonical = (url) => {
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
};

const SeoManager = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const isPrivate = PRIVATE_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
    const metadata = SEO_BY_PATH[pathname] || {
      title: pathname.startsWith('/articles/') ? 'Article — Vibe Talk' : DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      robots: isPrivate ? 'noindex, nofollow' : 'index, follow',
    };
    const canonicalPath = SEO_BY_PATH[pathname]
      ? pathname
      : pathname.startsWith('/articles/')
        ? pathname
        : '/';
    const canonicalUrl = `${SITE_URL}${canonicalPath === '/' ? '/' : canonicalPath}`;

    document.title = metadata.title;
    setMeta('meta[name="description"]', 'content', metadata.description);
    setMeta('meta[name="robots"]', 'content', metadata.robots || 'index, follow');
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[property="og:title"]', 'content', metadata.title);
    setMeta('meta[property="og:description"]', 'content', metadata.description);
    setMeta('meta[name="twitter:title"]', 'content', metadata.title);
    setMeta('meta[name="twitter:description"]', 'content', metadata.description);
    setCanonical(canonicalUrl);
  }, [pathname]);

  return null;
};

export default SeoManager;
