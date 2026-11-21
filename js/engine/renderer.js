import { TS } from '../game/constants.js';

export class Renderer {
  constructor(canvas, sprites) {
    this.cv = canvas; this.g = canvas.getContext('2d'); this.sp = sprites;
    this.cam = { x: 0, y: 0 }; this.W = 0; this.H = 0; this.scale = 2;
    addEventListener('resize', () => this.resize());
    this.resize();
  }
  resize() {
    const w = innerWidth; const h = innerHeight;
    const s = Math.min(5, Math.max(2, Math.floor(Math.min(w, h) / 165)));
    this.scale = s; this.W = Math.ceil(w / s); this.H = Math.ceil(h / s);
    this.cv.width = this.W; this.cv.height = this.H;
    this.cv.style.width = this.W * s + 'px'; this.cv.style.height = this.H * s + 'px';
    this.g.imageSmoothingEnabled = false;
  }
  follow(world, tx, ty, snap = false) {
    const mw = world.w * TS; const mh = world.h * TS;
    let x = tx - this.W / 2; let y = ty - this.H * 0.42;
    x = mw <= this.W ? (mw - this.W) / 2 : Math.max(0, Math.min(mw - this.W, x));
    y = mh <= this.H ? (mh - this.H) / 2 : Math.max(0, Math.min(mh - this.H, y));
    if (snap) { this.cam.x = Math.round(x); this.cam.y = Math.round(y); return; }
    this.cam.x += (x - this.cam.x) * 0.2; this.cam.y += (y - this.cam.y) * 0.2;
  }
  draw(world, ents, t, info = {}) {
    const g = this.g; const cam = this.cam; const cx0 = Math.round(cam.x); const cy0 = Math.round(cam.y);
    g.fillStyle = '#0b0a14'; g.fillRect(0, 0, this.W, this.H);
    const x0 = Math.max(0, Math.floor(cx0 / TS)); const y0 = Math.max(0, Math.floor(cy0 / TS));
    const x1 = Math.min(world.w - 1, Math.floor((cx0 + this.W) / TS)); const y1 = Math.min(world.h - 1, Math.floor((cy0 + this.H) / TS));
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const frames = this.sp.tiles[world.tiles[y][x]];
        const f = frames.length > 1 ? Math.floor(t * 1.6 + ((x + y) & 1) * 0.5) % frames.length : 0;
        g.drawImage(frames[f], x * TS - cx0, y * TS - cy0);
      }
    }
    const list = [...ents].sort((a, b) => a.ry - b.ry);
    for (const e of list) this.drawEnt(e, t, info, cx0, cy0);
    if (world.dark > 0) {
      const p = ents.find((e) => e.type === 'player');
      const px = p ? p.rx + 8 - cx0 : this.W / 2; const py = p ? p.ry + 8 - cy0 : this.H / 2;
      const grad = g.createRadialGradient(px, py, 14, px, py, 118);
      grad.addColorStop(0, 'rgba(8,6,16,0)'); grad.addColorStop(1, 'rgba(8,6,16,' + world.dark + ')');
      g.fillStyle = grad; g.fillRect(0, 0, this.W, this.H);
    }
  }
  drawEnt(e, t, info, camX, camY) {
    const g = this.g; const sp = this.sp; const cx = Math.round(e.rx - camX); const cy = Math.round(e.ry - camY);
    if (cx < -40 || cy < -40 || cx > this.W + 40 || cy > this.H + 40) return;
    const shadow = (w = 5) => { g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(cx + 8, cy + 14, w, 2, 0, 0, 7); g.fill(); };
    switch (e.type) {
      case 'player': case 'npc': {
        if (e.boss) {
          const bob = Math.sin(t * 2) * 2; g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(cx + 8, cy + 15, 12, 3, 0, 0, 7); g.fill();
          g.drawImage(sp.obj.boss, cx - 8, cy - 18 + bob); break;
        }
        shadow(); const fr = e.moving ? 1 + (Math.floor(t * 8) % 2) : 0;
        g.drawImage(sp.human(e.pal)[e.dir][fr], cx, cy - 2); break;
      }
      case 'hoax': {
        shadow();
        if (e.kind === 'ghost') g.drawImage(sp.obj.ghost, cx, cy - 3 + Math.sin(t * 3 + e.seed) * 2);
        else { const sq = Math.abs(Math.sin(t * 4 + e.seed)); g.drawImage(sp.slime(e.color), cx, cy - 1 - sq * 2); }
        break;
      }
      case 'chest': shadow(); g.drawImage(e.opened ? sp.obj.chestOpen : sp.obj.chest, cx, cy); break;
      case 'sign': shadow(4); g.drawImage(sp.obj.sign, cx, cy); break;
      case 'camp': g.drawImage(sp.obj.camp[Math.floor(t * 6) % 2], cx, cy); break;
      case 'heart': g.drawImage(sp.obj.heart, cx, cy - 1 - Math.abs(Math.sin(t * 3)) * 2); break;
      case 'warp': g.drawImage(sp.obj.portal[Math.floor(t * 4) % 2], cx, cy); break;
      case 'altar': {
        g.drawImage(sp.obj.altar, cx, cy);
        const n = info.shards || 0;
        for (let i = 0; i < n; i++) g.drawImage(sp.obj.shard, cx - 8 + i * 4, cy - 14 - Math.abs(Math.sin(t * 2 + i)) * 2, 8, 8);
        break;
      }
      default: break;
    }
    if (e.mark) {
      const my = cy - 5 - Math.abs(Math.sin(t * 5)) * 2;
      g.font = 'bold 9px monospace'; g.textAlign = 'center'; g.lineWidth = 2; g.strokeStyle = '#000';
      g.strokeText(e.mark, cx + 8, my); g.fillStyle = e.mark === '!' ? '#ffd54f' : '#80d8ff'; g.fillText(e.mark, cx + 8, my);
    }
  }
}
