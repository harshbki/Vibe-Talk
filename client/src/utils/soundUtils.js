// Sound utilities — notification beep + call ringing

let notificationAudio = null;
let ringingInterval = null;
let ringingAudioContext = null;
let ringingOscillators = [];

/** Respects Settings → Message sounds (localStorage vt_chatSound). */
export const isChatSoundEnabled = () => localStorage.getItem('vt_chatSound') !== 'false';

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
  if (!isChatSoundEnabled()) return;
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
  if (!isChatSoundEnabled()) return;
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

/** Classic two-tone phone ring (440 Hz + 480 Hz alternating). */
export const playRingingSound = () => {
  try {
    stopRingingSound();
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const gain = ctx.createGain();
    gain.gain.value = 0.22;
    gain.connect(ctx.destination);

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.value = 440;
    osc2.frequency.value = 480;
    osc1.connect(gain);
    osc2.connect(gain);
    osc1.start();
    osc2.start();

    ringingAudioContext = ctx;
    ringingOscillators = [osc1, osc2];

    let ringOn = true;
    const pulse = () => {
      if (!ringingAudioContext) return;
      const t = ringingAudioContext.currentTime;
      gain.gain.cancelScheduledValues(t);
      gain.gain.setValueAtTime(ringOn ? 0.22 : 0.02, t);
      ringOn = !ringOn;
    };
    pulse();
    ringingInterval = setInterval(pulse, 1000);
  } catch (error) {
    console.error('Ringing sound error:', error);
    if (isChatSoundEnabled()) playNotificationSound();
  }
};

export const stopRingingSound = () => {
  try {
    if (ringingInterval) {
      clearInterval(ringingInterval);
      ringingInterval = null;
    }
    ringingOscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        /* already stopped */
      }
    });
    ringingOscillators = [];
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
  isChatSoundEnabled,
  playNotificationSound,
  playRingingSound,
  stopRingingSound,
  vibrate,
};
