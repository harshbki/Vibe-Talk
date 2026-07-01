import React, { useEffect, useRef, useState } from 'react';

const ADSENSE_CLIENT_ID = process.env.REACT_APP_ADSENSE_CLIENT_ID || 'ca-pub-5149550826483446';

// Manual AdSense units only — one slot per placement (see master ad table)
const SLOT_DEFAULTS = {
  'chat-sidebar': '3906615674',
  'random-match-inline': '3628542402',
  'group-chat-top': '6888002231',
  'users-list-bottom': '6352156478',
  'profile-bottom': '8184534352',
};

const SLOT_MAP = {
  'chat-sidebar': process.env.REACT_APP_ADSENSE_SLOT_CHAT_SIDEBAR,
  'users-list-bottom': process.env.REACT_APP_ADSENSE_SLOT_USERS_LIST_BOTTOM,
  'group-chat-top': process.env.REACT_APP_ADSENSE_SLOT_GROUP_CHAT_TOP,
  'profile-bottom': process.env.REACT_APP_ADSENSE_SLOT_PROFILE_BOTTOM,
  'random-match-inline': process.env.REACT_APP_ADSENSE_SLOT_RANDOM_MATCH_INLINE,
};

const resolveSlot = (slot) => SLOT_MAP[slot] || SLOT_DEFAULTS[slot] || null;

const isLocalhost = () => {
  const h = window.location.hostname;
  return h === 'localhost' || h === '127.0.0.1' || h.startsWith('192.168.');
};

const AdBanner = ({ slot = '', format = 'auto', className = '' }) => {
  const adRef = useRef(null);
  const pushed = useRef(false);
  const [failed, setFailed] = useState(false);
  const resolvedSlot = resolveSlot(slot);
  const local = isLocalhost();

  useEffect(() => {
    if (pushed.current || !resolvedSlot || failed) return;
    try {
      if (window.adsbygoogle && adRef.current) {
        window.adsbygoogle.push({});
        pushed.current = true;
      }
    } catch {
      setFailed(true);
    }
  }, [resolvedSlot, failed]);

  if (!resolvedSlot) return null;

  if (local) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-base-200 border-2 border-dashed border-base-300 rounded-lg p-3 text-center">
          <p className="text-xs font-semibold text-base-content/40">
            AdSense — <span className="badge badge-ghost badge-xs">{slot}</span>
          </p>
        </div>
      </div>
    );
  }

  if (failed) return null;

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
};

export default AdBanner;
