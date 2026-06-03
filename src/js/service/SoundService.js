/**
 * SoundService
 * Generates all sound effects via Web Audio API — zero external files required.
 */
export class SoundService {
  constructor() {
    this._ctx = null;
    this._enabled = true;
  }

  _getCtx() {
    if (!this._ctx) {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this._ctx;
  }

  setEnabled(enabled) {
    this._enabled = enabled;
  }

  _play(frequency, type, duration, gain = 0.3, delay = 0) {
    if (!this._enabled) return;
    try {
      const ctx = this._getCtx();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
      gainNode.gain.setValueAtTime(gain, ctx.currentTime + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration + 0.05);
    } catch (_) {
      // Audio context may not be available
    }
  }

  playMove() {
    this._play(440, 'sine', 0.08, 0.2);
  }

  playWin() {
    // Ascending fanfare
    [523, 659, 784, 1047].forEach((freq, i) => {
      this._play(freq, 'triangle', 0.15, 0.35, i * 0.1);
    });
  }

  playDraw() {
    this._play(300, 'sawtooth', 0.3, 0.15);
    this._play(250, 'sawtooth', 0.3, 0.1, 0.2);
  }

  playError() {
    this._play(200, 'square', 0.1, 0.2);
  }

  playHover() {
    this._play(600, 'sine', 0.04, 0.05);
  }

  playClick() {
    this._play(800, 'sine', 0.06, 0.15);
  }
}
