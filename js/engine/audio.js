// Suara 8-bit sederhana lewat WebAudio (tanpa file audio).
const SC = (root) => [1, 1.2, 1.333, 1.5, 1.8, 2].map((r) => root * r);
const SCALES = [SC(196), SC(220), SC(174.6), SC(233), SC(164.8)];
const PATTERN = [0, 2, 4, 2, 3, 5, 4, 2, 0, 2, 4, 5, 3, 2, 1, 2];

export const audio = {
  ctx: null, on: true, chapter: 0, timer: null, step: 0,
  init() {
    if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return; } }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.startMusic();
  },
  tone(freq, dur = 0.08, type = 'square', vol = 0.04, delay = 0) {
    if (!this.ctx || !this.on) return;
    const t = this.ctx.currentTime + delay; const o = this.ctx.createOscillator(); const g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.ctx.destination); o.start(t); o.stop(t + dur + 0.02);
  },
  sfx(name) {
    const seq = {
      step: [[110, 0.04, 'triangle', 0.03]], talk: [[330, 0.05]], ok: [[523, 0.09], [659, 0.09, 'square', 0.04, 0.09], [784, 0.14, 'square', 0.04, 0.18]],
      bad: [[220, 0.12, 'sawtooth'], [150, 0.2, 'sawtooth', 0.04, 0.1]], hit: [[180, 0.1, 'sawtooth'], [120, 0.15, 'sawtooth', 0.04, 0.08]],
      card: [[659, 0.08], [784, 0.08, 'square', 0.04, 0.08], [988, 0.18, 'square', 0.04, 0.16]],
      shard: [[523, 0.1], [659, 0.1, 'square', 0.04, 0.1], [784, 0.1, 'square', 0.04, 0.2], [1046, 0.3, 'square', 0.05, 0.3]],
      warp: [[300, 0.1, 'triangle'], [450, 0.1, 'triangle', 0.04, 0.1], [600, 0.2, 'triangle', 0.04, 0.2]],
    }[name] || [];
    seq.forEach(([f, d, t, v, dl]) => this.tone(f, d, t, v, dl));
  },
  setChapter(n) { this.chapter = Math.max(0, n - 1); },
  startMusic() {
    if (this.timer || !this.ctx) return;
    this.timer = setInterval(() => {
      if (!this.on || !this.ctx || this.ctx.state !== 'running') return;
      const sc = SCALES[this.chapter % SCALES.length]; const i = this.step++;
      this.tone(sc[PATTERN[i % PATTERN.length]], 0.2, 'triangle', 0.03);
      if (i % 4 === 0) this.tone(sc[0] / 2, 0.45, 'sine', 0.05);
    }, 260);
  },
  toggle() { this.on = !this.on; return this.on; },
};
