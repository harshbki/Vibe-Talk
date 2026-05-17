// Sound utilities — notification beep + call ringing

let notificationAudio = null;
let ringingInterval = null;
let ringingAudioContext = null;
let ringingOscillator = null;

const getNotificationAudio = () => {
  if (!notificationAudio) {
    notificationAudio = new Audio('/notification.mp3');
    notificationAudio.volume = 0.75;
  }
  return notificationAudio;
};

export const initSounds = () => {
  try {
    const audio = getNotificationAudio();
    audio.load();
  } catch (error) {
    console.error('initSounds error:', error);
  }
};

export const playNotificationSound = () => {
  try {
    const audio = getNotificationAudio();
    const clone = audio.cloneNode();
    clone.volume = 0.75;
    clone.play().catch(() => {
      playBeepFallback();
    });
  } catch (error) {
    playBeepFallback();
  }
};

const playBeepFallback = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.value = 0.2;
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (error) {
    console.error('Beep fallback error:', error);
  }
};

export const playRingingSound = () => {
  try {
    stopRingingSound();
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = 440;
    gain.gain.value = 0.25;
    osc.start();
    ringingAudioContext = ctx;
    ringingOscillator = osc;
    let high = false;
    ringingInterval = setInterval(() => {
      if (ringingOscillator) {
        ringingOscillator.frequency.value = high ? 523 : 440;
        high = !high;
      }
    }, 450);
  } catch (error) {
    console.error('Ringing sound error:', error);
    playNotificationSound();
  }
};

export const stopRingingSound = () => {
  try {
    if (ringingInterval) {
      clearInterval(ringingInterval);
      ringingInterval = null;
    }
    if (ringingOscillator) {
      ringingOscillator.stop();
      ringingOscillator = null;
    }
    if (ringingAudioContext) {
      ringingAudioContext.close().catch(() => {});
      ringingAudioContext = null;
    }
  } catch (error) {
    console.error('Stop ringing error:', error);
  }
};

export const vibrate = (pattern = [200, 100, 200]) => {
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
