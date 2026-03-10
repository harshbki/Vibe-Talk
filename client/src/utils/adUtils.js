// Monetag and Adsterra Ad Utilities for VibeTalk
// 
// AD PLACEMENTS SUMMARY:
// 1. Landing Page - Monetag Popunder (auto from index.html script)
// 2. "Find Match" Button Click - Monetag Popunder (showPopunder)
// 3. Before 2nd Video Call - Monetag Interstitial (showAdBeforeCall)
// 4. Chat Window Bottom - Adsterra Social Bar (auto from index.html script)
// 5. UsersList Page - Adsterra Banner Ad (container in UsersList)
//
// Replace zone IDs with your real ones from Monetag/Adsterra dashboards.

const getMonetagZoneId = () => {
  const meta = document.querySelector('meta[name="monetag"]');
  return meta?.content || '';
};

const getPopunderUrl = () => {
  // Optional explicit URL if user provides one from Monetag dashboard
  return process.env.REACT_APP_MONETAG_POPUNDER_URL || '';
};

// Track if popunder has been shown this session
let popunderShown = false;

/**
 * 1. Show Monetag Popunder Ad
 * Used on: "Find Match" button, first user interaction
 */
export const showPopunder = () => {
  if (popunderShown) return;
  
  try {
    const zoneId = getMonetagZoneId();

    // Monetag's tag.min.js script handles popunder automatically on user click
    // We can also manually trigger via window.open as fallback
    if (window.monetag && window.monetag.showPopunder) {
      window.monetag.showPopunder();
      popunderShown = true;
      return;
    }

    // Some Monetag integrations expose a global invoke function.
    if (window.show_9722658) {
      window.show_9722658();
      popunderShown = true;
      return;
    }

    // Final fallback: open provided popunder URL if available.
    const popunderUrl = getPopunderUrl();
    if (popunderUrl) {
      window.open(popunderUrl, '_blank', 'noopener,noreferrer');
      popunderShown = true;
      return;
    }

    console.log('Monetag popunder trigger not available. Zone:', zoneId || 'not set');
  } catch (e) {
    console.log('Popunder blocked or not loaded');
  }
};

/**
 * 2. Show Ad Before Video Call (2nd call onwards)
 * Used on: VideoCall component initiateCall() 
 * @param {Function} callback - Function to call after ad
 */
export const showAdBeforeCall = (callback) => {
  try {
    // Try Monetag interstitial
    if (window.monetag && window.monetag.showInterstitial) {
      window.monetag.showInterstitial(() => {
        callback();
      });
      return;
    }
    
    // Fallback: show popunder + delay + continue
    showPopunder();
    setTimeout(() => {
      callback();
    }, 1500);
    
  } catch (e) {
    console.log('Ad error:', e);
    callback(); // Don't block the call if ad fails
  }
};

/**
 * 3. Trigger ad on any user interaction (Find Match, chat start)
 * Randomly picks between popunder strategies
 */
export const triggerAdOnInteraction = () => {
  showPopunder();
};

/**
 * 4. Show reward ad for premium features
 * @param {Function} onComplete - Callback when user finishes
 */
export const showRewardAd = (onComplete) => {
  try {
    if (window.monetag && window.monetag.showReward) {
      window.monetag.showReward(onComplete);
      return;
    }
    // Fallback
    showPopunder();
    setTimeout(() => {
      onComplete();
    }, 2000);
  } catch (e) {
    console.log('Reward ad error:', e);
    onComplete();
  }
};

/**
 * Initialize ads on app load
 */
export const initializeAds = () => {
  console.log('VibeTalk Ads initialized - Zone:', getMonetagZoneId() || 'not set');
};

export default {
  showPopunder,
  showAdBeforeCall,
  triggerAdOnInteraction,
  showRewardAd,
  initializeAds
};
