/**
 * ====================================================================
 * AUDIO MODULE
 * ====================================================================
 * Sounds are synthesized on the fly with the Web Audio API, so the app
 * works instantly with zero asset files / zero loading.
 *
 * 🔁 WANT TO USE YOUR OWN MP3/WAV FILES INSTEAD?
 * Replace the body of each exported function with something like:
 *
 *   const sfxCorrect = new Audio("assets/sounds/correct.mp3");
 *   export function playCorrect() { sfxCorrect.currentTime = 0; sfxCorrect.play(); }
 *
 * Just drop your files in an `assets/sounds/` folder and point to them.
 * ====================================================================
 */

// Lazily created so the browser doesn't block on AudioContext before
// the user has interacted with the page (autoplay policies).
let audioCtx = null;
function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

/**
 * Plays a simple tone.
 * @param {number} freq - frequency in Hz
 * @param {number} duration - in seconds
 * @param {string} type - oscillator waveform
 * @param {number} startGain - initial volume (0-1)
 */
function tone(freq, duration, type = "sine", startGain = 0.18) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(startGain, ctx.currentTime);
  // Exponential fade-out so the tone doesn't click when it stops
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
}

/** Cheerful ascending two-note chime for a correct answer */
export function playCorrect() {
  tone(523.25, 0.12, "triangle"); // C5
  setTimeout(() => tone(783.99, 0.18, "triangle"), 90); // G5
}

/** Low descending buzz for a wrong answer / timeout */
export function playWrong() {
  tone(220, 0.1, "sawtooth", 0.15); // A3
  setTimeout(() => tone(160, 0.22, "sawtooth", 0.15), 80);
}

/** Soft tick for the last few seconds of the countdown */
export function playTick() {
  tone(880, 0.05, "square", 0.06);
}

/** Bright flourish used once when the lifeline is activated */
export function playLifeline() {
  tone(660, 0.08, "sine", 0.12);
  setTimeout(() => tone(990, 0.12, "sine", 0.12), 70);
}
