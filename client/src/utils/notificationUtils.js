// Browser Notification Utilities for VibeTalk


let swRegistration = null;
let notificationAudio = null;

export const playNotificationSound = () => {
  try {
    if (!notificationAudio) {
      notificationAudio = new Audio('/notification.mp3');
      notificationAudio.volume = 0.7;
    }
    // Always clone to allow overlapping sounds
    const sound = notificationAudio.cloneNode();
    sound.play().catch(() => {});
  } catch {}
};

/**
 * Register the service worker and request notification permission
 */
export const initNotifications = async () => {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    swRegistration = await navigator.serviceWorker.register('/serviceWorker.js');

    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    return Notification.permission === 'granted';
  } catch (error) {
    console.error('Notification init error:', error);
    return false;
  }
};

/**
 * Show a browser notification for an incoming message.
 * Uses the service worker registration so it works even when the tab is in the background.
 *
 * @param {string} senderName - Nickname of the sender
 * @param {string} messagePreview - Short preview of the message body
 * @param {string} [tag] - Notification tag to collapse duplicates per sender
 */
export const showMessageNotification = (senderName, messagePreview, tag) => {
  if (Notification.permission !== 'granted') return;

  const title = `${senderName} sent a message`;
  const options = {
    body: messagePreview || 'New message',
    icon: '/logo192.png',
    badge: '/logo192.png',
    tag: tag || `msg-${senderName}`,
    renotify: true
  };

  playNotificationSound();
  if (swRegistration) {
    swRegistration.showNotification(title, options);
  } else {
    // Fallback to basic Notification API
    new Notification(title, options);
  }
};

/**
 * Show a browser notification for a match event.
 */
export const showMatchNotification = (partnerName) => {
  if (Notification.permission !== 'granted') return;

  const title = "It's a Match! 🎉";
  const options = {
    body: `You matched with ${partnerName}`,
    icon: '/logo192.png',
    badge: '/logo192.png',
    tag: 'match-notification',
    renotify: true
  };

  playNotificationSound();
  if (swRegistration) {
    swRegistration.showNotification(title, options);
  } else {
    new Notification(title, options);
  }
};
