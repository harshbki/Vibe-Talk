// Sound utility functions for notifications and calls

let notificationSound = null;
let ringingSound = null;

// Initialize sounds
export const initSounds = () => {
  // Notification sound - simple beep using Web Audio API
  notificationSound = createBeepSound(800, 0.1, 0.2); // 800Hz, 0.1s duration
  
  // Ringing sound - repeating tone
  ringingSound = createRingingTone();
};

// Create a beep sound using Web Audio API
const createBeepSound = (frequency, duration, volume = 0.3) => {
  return () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };
};

// Create ringing tone
const createRingingTone = () => {
  let audioContext = null;
  let oscillator = null;
  let gainNode = null;
  let isPlaying = false;

  return {
    start: () => {
      if (isPlaying) return;
      
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      oscillator = audioContext.createOscillator();
      gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Ringing pattern: 440Hz and 880Hz alternating
      oscillator.frequency.value = 440;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;

      oscillator.start();
      isPlaying = true;

      // Create ringing pattern
      let toggle = true;
      const interval = setInterval(() => {
        if (!isPlaying) {
          clearInterval(interval);
          return;
        }
        oscillator.frequency.value = toggle ? 880 : 440;
        toggle = !toggle;
      }, 400);
    },
    stop: () => {
      if (!isPlaying || !oscillator) return;
      
      try {
        oscillator.stop();
        audioContext.close();
      } catch (e) {
        console.log('Error stopping ring:', e);
      }
      
      isPlaying = false;
      oscillator = null;
      gainNode = null;
      audioContext = null;
    },
    isPlaying: () => isPlaying
  };
};

// Play notification sound
export const playNotificationSound = () => {
  try {
    if (!notificationSound) initSounds();
    notificationSound();
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

// Play ringing sound
let ringingInstance = null;
export const playRingingSound = () => {
  try {
    if (!ringingSound) initSounds();
    if (!ringingInstance) {
      ringingInstance = createRingingTone();
    }
    if (!ringingInstance.isPlaying()) {
      ringingInstance.start();
    }
  } catch (error) {
    console.error('Error playing ringing sound:', error);
  }
};

// Stop ringing sound
export const stopRingingSound = () => {
  try {
    if (ringingInstance && ringingInstance.isPlaying()) {
      ringingInstance.stop();
    }
  } catch (error) {
    console.error('Error stopping ringing sound:', error);
  }
};

// Vibrate on mobile (if supported)
export const vibrate = (pattern = [200]) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

export default {
  initSounds,
  playNotificationSound,
  playRingingSound,
  stopRingingSound,
  vibrate
};
