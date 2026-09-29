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

/** Before 2nd+ video call — DISABLED for AdSense compliance */
export const showAdBeforeCall = (callback) => {
  // DISABLED: Monetag vignette conflicts with Google AdSense policy
  if (typeof callback === 'function') callback();
};

export const initializeAds = () => {
  /* IPP tag is in index.html; nothing else to init here. */
};

export default {
  showAdBeforeCall,
  initializeAds,
};
