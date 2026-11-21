// Input: keyboard + tombol layar sentuh (D-pad dan tombol A).
export class Input {
  constructor() {
    this.held = []; this.act = false; this.menu = false;
    const keys = { ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down', ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' };
    addEventListener('keydown', (e) => {
      if (e.target && e.target.tagName === 'INPUT') return;
      const d = keys[e.key];
      if (d) { if (!this.held.includes(d)) this.held.push(d); e.preventDefault(); }
      else if ([' ', 'Enter', 'z', 'Z', 'e', 'E'].includes(e.key)) { if (!e.repeat) this.act = true; }
      else if (e.key === 'Escape' || e.key === 'm' || e.key === 'M') { if (!e.repeat) this.menu = true; }
    });
    addEventListener('keyup', (e) => { const d = keys[e.key]; if (d) this.held = this.held.filter((x) => x !== d); });
    addEventListener('blur', () => { this.held = []; });
    document.querySelectorAll('[data-dir]').forEach((b) => {
      const d = b.dataset.dir;
      const up = () => { this.held = this.held.filter((x) => x !== d); b.classList.remove('on'); };
      b.addEventListener('pointerdown', (e) => { e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch { /* abaikan */ } if (!this.held.includes(d)) this.held.push(d); b.classList.add('on'); });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => b.addEventListener(ev, up));
    });
    const a = document.querySelector('[data-act]');
    if (a) {
      a.addEventListener('pointerdown', (e) => { e.preventDefault(); this.act = true; a.classList.add('on'); });
      ['pointerup', 'pointercancel'].forEach((ev) => a.addEventListener(ev, () => a.classList.remove('on')));
    }
  }
  dir() { return this.held.length ? this.held[this.held.length - 1] : null; }
  takeAct() { const a = this.act; this.act = false; return a; }
  takeMenu() { const m = this.menu; this.menu = false; return m; }
  flush() { this.act = false; this.menu = false; }
}
