// VibeTalk monetization — Monetag Vignette before 2nd video call only.
// In-Page Push (IPP) loads globally from index.html (zone 11224657).
// AdSense manual units load only via AdBanner.js in 5 fixed placements.

const VIGNETTE_ZONE = '11224651';
const VIGNETTE_SRC = 'https://n6wxm.com/vignette.min.js';

let vignetteInjected = false;

const injectVignetteScript = () => {
  if (vignetteInjected || typeof document === 'undefined') return;
  if (document.querySelector(`script[data-zone="${VIGNETTE_ZONE}"]`)) {
    vignetteInjected = true;
    return;
  }
  const script = document.createElement('script');
  script.dataset.zone = VIGNETTE_ZONE;
  script.src = VIGNETTE_SRC;
  script.async = true;
  (document.body || document.documentElement).appendChild(script);
  vignetteInjected = true;
};

/** Before 2nd+ video call — Monetag Vignette Banner (overlay, closable). */
export const showAdBeforeCall = (callback) => {
  try {
    injectVignetteScript();
    setTimeout(() => {
      if (typeof callback === 'function') callback();
    }, 600);
  } catch {
    if (typeof callback === 'function') callback();
  }
};

export const initializeAds = () => {
  /* IPP tag is in index.html; nothing else to init here. */
};

export default {
  showAdBeforeCall,
  initializeAds,
};
