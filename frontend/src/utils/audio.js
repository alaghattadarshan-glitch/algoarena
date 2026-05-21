const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export const playNote = (frequency, type = 'sine', duration = 0.05, volume = 0.05) => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.value = frequency;
  
  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

export const playTone = (value, maxVal, enabled) => {
  if (!enabled) return;
  const minFreq = 150;
  const maxFreq = 1200;
  const freq = minFreq + (value / maxVal) * (maxFreq - minFreq);
  // Using 'triangle' or 'sine' for futuristic sound
  playNote(freq, 'triangle');
};

export const playFinishSound = (enabled) => {
  if (!enabled) return;
  playNote(600, 'sine', 0.1, 0.1);
  setTimeout(() => playNote(800, 'sine', 0.2, 0.1), 100);
  setTimeout(() => playNote(1200, 'sine', 0.4, 0.1), 200);
};
