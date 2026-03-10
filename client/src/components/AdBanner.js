import React, { useEffect, useRef, useState } from 'react';

const ADSENSE_CLIENT_ID = process.env.REACT_APP_ADSENSE_CLIENT_ID || 'ca-pub-5149550826483446';
const MONETAG_ZONE = process.env.REACT_APP_MONETAG_ZONE_ID || 'd965e1389aae19ff5ef25da9cdc7aff3';

// Map placement keys to AdSense slot IDs (from client/.env)
const SLOT_MAP = {
  'chat-sidebar': process.env.REACT_APP_ADSENSE_SLOT_CHAT_SIDEBAR,
  'users-list-bottom': process.env.REACT_APP_ADSENSE_SLOT_USERS_LIST_BOTTOM,
  'group-chat-top': process.env.REACT_APP_ADSENSE_SLOT_GROUP_CHAT_TOP,
  'profile-bottom': process.env.REACT_APP_ADSENSE_SLOT_PROFILE_BOTTOM,
  'random-match-inline': process.env.REACT_APP_ADSENSE_SLOT_RANDOM_MATCH_INLINE
};

const resolveSlot = (slot) => SLOT_MAP[slot] || null;

const isLocalhost = () => {
  const h = window.location.hostname;
  return h === 'localhost' || h === '127.0.0.1' || h.startsWith('192.168.');
};

// Monetag SmartLink banner — shows a native-looking banner from Monetag
const MonetagBanner = ({ placement }) => {
  const containerRef = useRef(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !containerRef.current || !MONETAG_ZONE) return;
    loaded.current = true;
    try {
      const script = document.createElement('script');
      script.src = `https://iclickcdn.com/tag.min.js`;
      script.setAttribute('data-zone', MONETAG_ZONE);
      script.async = true;
      containerRef.current.appendChild(script);
    } catch (e) {
      // Monetag script blocked or failed — ignore
    }
  }, [placement]);

  return <div ref={containerRef} />;
};

const AdBanner = ({ slot = '', format = 'auto', className = '' }) => {
  const adRef = useRef(null);
  const pushed = useRef(false);
  const [adsenseFailed, setAdsenseFailed] = useState(false);
  const resolvedSlot = resolveSlot(slot);
  const local = isLocalhost();

  // Try loading AdSense ad if slot is configured
  useEffect(() => {
    if (pushed.current || !resolvedSlot) return;
    try {
      if (window.adsbygoogle && adRef.current) {
        window.adsbygoogle.push({});
        pushed.current = true;
      }
    } catch (e) {
      setAdsenseFailed(true);
    }
  }, [resolvedSlot]);

  // Dev/localhost: show placeholder so you can see where ads will appear
  if (local) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-base-200 border-2 border-dashed border-base-300 rounded-lg p-3 text-center">
          <p className="text-xs font-semibold text-base-content/40 flex items-center justify-center gap-2">
            📢 Ad Space — <span className="badge badge-ghost badge-xs">{slot || 'banner'}</span>
          </p>
          <p className="text-[10px] text-base-content/30 mt-1">
            Monetag + AdSense ads will appear here on your live deployed domain
          </p>
        </div>
      </div>
    );
  }

  // Production: show AdSense if slot available, otherwise Monetag banner
  if (resolvedSlot && !adsenseFailed) {
    return (
      <div className={`w-full overflow-hidden ${className}`}>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={resolvedSlot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Fallback: Monetag native banner
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <MonetagBanner placement={slot} />
    </div>
  );
};

export default AdBanner;
