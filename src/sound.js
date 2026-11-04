// Short tones made in the browser (no audio files).
let ctx = null;

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, start, dur, type = 'sine', vol = 0.18) {
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sound = {
  unlock() { ac(); },
  tap() { tone(660, 0, 0.08, 'triangle', 0.12); },
  right() { tone(523.25, 0, 0.14, 'triangle'); tone(783.99, 0.1, 0.22, 'triangle'); },
  wrong() { tone(220, 0, 0.18, 'square', 0.08); tone(165, 0.14, 0.26, 'square', 0.08); },
  place() { tone(880, 0, 0.1, 'sine', 0.14); },
  fanfare() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.11, 0.32, 'triangle', 0.2));
  },
  end() {
    [783.99, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.14, 0.3, 'triangle', 0.16));
  },
};
