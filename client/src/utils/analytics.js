const GA_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

export const initAnalytics = () => {
  if (!GA_ID || typeof window === 'undefined') return;

  if (window.gtag) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { send_page_view: false });
};

export const trackPageView = (path) => {
  if (!GA_ID || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title,
  });
};
