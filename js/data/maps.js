// Peta dibangun lewat kode (bukan ASCII) supaya mudah diubah.
// Setiap peta: tiles (grid kunci tile), spots (posisi entitas), entry (tiba dari peta sebelumnya), exit (tiba dari peta berikutnya).
import { TILES } from './tiles.js';

export const W = 30;
export const H = 22;

function rng(seed) { let s = (seed | 0) || 123456789; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return (s >>> 0) / 4294967296; }; }

class MB {
  constructor(base) { this.t = Array.from({ length: H }, () => Array(W).fill(base)); this.res = new Set(); }
  in(x, y) { return x >= 0 && y >= 0 && x < W && y < H; }
  set(x, y, k) { if (this.in(x, y)) this.t[y][x] = k; }
  get(x, y) { return this.in(x, y) ? this.t[y][x] : null; }
  rect(x, y, w, h, k) { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) this.set(i, j, k); }
  carve(x, y, w, h, k) { this.rect(x, y, w, h, k); }
  ring(k) { this.rect(0, 0, W, 1, k); this.rect(0, H - 1, W, 1, k); this.rect(0, 0, 1, H, k); this.rect(W - 1, 0, 1, H, k); }
  hline(x1, x2, y, k) { this.rect(x1, y, x2 - x1 + 1, 1, k); }
  vline(x, y1, y2, k) { this.rect(x, y1, 1, y2 - y1 + 1, k); }
  reserve(spots) {
    for (const v of Object.values(spots)) {
      const list = Array.isArray(v[0]) ? v : [v];
      for (const [x, y] of list) for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) this.res.add((x + i) + ',' + (y + j));
    }
  }
  solidAt(x, y) { const k = this.get(x, y); return k === null || !!TILES[k].solid; }
  scatter(k, n, { on = ['grass'], seed = 1 } = {}) {
    const r = rng(seed); let placed = 0; let tries = 0;
    while (placed < n && tries < n * 40) {
      tries++;
      const x = 1 + Math.floor(r() * (W - 2)); const y = 1 + Math.floor(r() * (H - 2));
      if (!on.includes(this.get(x, y)) || this.res.has(x + ',' + y)) continue;
      if (TILES[k].solid) { // blok padat hanya boleh berdiri sendiri agar tidak menutup jalan
        let ok = true;
        for (let j = -1; j <= 1 && ok; j++) for (let i = -1; i <= 1; i++) if ((i || j) && this.solidAt(x + i, y + j)) { ok = false; break; }
        if (!ok) continue;
      }
      this.set(x, y, k); placed++;
    }
  }
  house(x, y, w, h, { roof = 'roof' } = {}) {
    this.rect(x, y, w, h - 1, roof); this.rect(x, y + h - 1, w, 1, 'woodwall');
    const dx = x + Math.floor(w / 2); this.set(dx, y + h - 1, 'door'); this.set(dx, y + h, 'path');
  }
  sprinkle(types, prob, seed) { // batu yang menempel lantai diganti bijih / lava
    const r = rng(seed); const cells = [];
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      if (this.get(x, y) !== 'stone' || this.res.has(x + ',' + y)) continue;
      const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const k = this.get(x + dx, y + dy); return k && !TILES[k].solid; });
      if (near && r() < prob) cells.push([x, y]);
    }
    for (const [x, y] of cells) this.set(x, y, types[Math.floor(r() * types.length)]);
  }
  torches(rows, xs) { for (const y of rows) for (const x of xs) if (this.get(x, y) === 'stone' && !this.res.has(x + ',' + y)) this.set(x, y, 'torchwall'); }
}

const ENTRY = [3, 10];
const EXIT = [27, 10];
const WARP = [28, 10];

function desa() {
  const spots = { guide: [8, 9], sign: [3, 9], camp: [10, 9], citizen: [20, 8], talker: [10, 12], chest: [25, 4], hoax1: [21, 13], hoax2: [9, 18], guardian: [26, 9], hearts: [[16, 6], [2, 18]] };
  const m = new MB('grass'); m.reserve({ ...spots, entry: ENTRY, exit: EXIT, warp: WARP });
  m.ring('tree');
  m.rect(13, 1, 2, H - 2, 'water');
  m.rect(1, 10, 28, 2, 'path'); m.rect(13, 10, 2, 2, 'bridge');
  m.house(4, 2, 5, 4); m.vline(6, 6, 9, 'path');
  m.house(17, 2, 5, 4); m.vline(19, 6, 9, 'path');
  m.house(3, 14, 5, 4); m.house(23, 14, 5, 4);
  m.rect(9, 14, 4, 1, 'fence'); m.rect(16, 14, 1, 3, 'fence');
  m.scatter('flower', 50, { seed: 3 }); m.scatter('bush', 12, { seed: 4 }); m.scatter('tree', 28, { seed: 5 });
  return { id: 'desa', tiles: m.t, spots, entry: ENTRY, exit: EXIT, dark: 0 };
}

function kampung() {
  const spots = { guide: [12, 8], sign: [3, 9], camp: [7, 9], citizen: [20, 8], talker: [9, 12], chest: [14, 16], hoax1: [18, 13], hoax2: [10, 18], guardian: [26, 9], hearts: [[8, 15], [27, 8]] };
  const m = new MB('grass'); m.reserve({ ...spots, entry: ENTRY, exit: EXIT, warp: WARP });
  m.ring('tree');
  m.rect(1, 10, 28, 2, 'path');
  m.rect(10, 1, 10, 3, 'roofblue'); m.rect(10, 4, 10, 2, 'brick'); m.set(14, 5, 'door'); m.set(15, 5, 'door');
  m.rect(8, 6, 14, 4, 'stonefloor'); m.rect(14, 6, 2, 4, 'carpet');
  m.house(2, 2, 5, 4); m.vline(4, 6, 9, 'path');
  m.house(23, 2, 5, 4); m.vline(25, 6, 9, 'path');
  m.house(3, 14, 5, 4); m.house(22, 14, 5, 4);
  m.rect(12, 14, 6, 4, 'sand');
  m.scatter('flower', 40, { seed: 6 }); m.scatter('bush', 10, { seed: 7 }); m.scatter('tree', 22, { seed: 8 });
  return { id: 'kampung', tiles: m.t, spots, entry: ENTRY, exit: EXIT, dark: 0 };
}

function pasar() {
  const spots = { guide: [9, 9], sign: [3, 9], camp: [5, 9], citizen: [17, 12], talker: [22, 12], chest: [27, 6], hoax1: [8, 13], hoax2: [24, 17], guardian: [26, 9], hearts: [[5, 13], [22, 7]] };
  const m = new MB('sand'); m.reserve({ ...spots, entry: ENTRY, exit: EXIT, warp: WARP });
  m.ring('brick');
  m.rect(1, 10, 28, 2, 'path'); m.rect(10, 8, 10, 6, 'path');
  const row = (y, xs, k) => xs.forEach((x) => m.set(x, y, k));
  row(4, [3, 4], 'stall_red'); row(4, [6, 7], 'stall_blue'); row(4, [9, 10], 'stall_green');
  row(4, [20, 21], 'stall_red'); row(4, [23, 24], 'stall_blue'); row(4, [26, 27], 'stall_green');
  row(15, [3, 4], 'stall_green'); row(15, [6, 7], 'stall_red'); row(15, [22, 23], 'stall_blue'); row(15, [25, 26], 'stall_green');
  m.rect(12, 1, 6, 2, 'roofblue'); m.rect(12, 3, 6, 2, 'brick'); m.set(14, 4, 'door'); m.set(15, 4, 'door'); m.rect(14, 5, 2, 3, 'path');
  m.house(12, 15, 6, 4);
  m.scatter('crate', 9, { on: ['sand'], seed: 9 });
  return { id: 'pasar', tiles: m.t, spots, entry: ENTRY, exit: EXIT, dark: 0 };
}

function tambang() {
  const spots = { guide: [8, 11], sign: [3, 11], camp: [6, 10], citizen: [9, 16], talker: [7, 6], chest: [22, 5], hoax1: [18, 10], hoax2: [20, 15], guardian: [26, 11], hearts: [[12, 16], [16, 6]] };
  const m = new MB('stone'); m.reserve({ ...spots, entry: ENTRY, exit: EXIT, warp: WARP });
  m.carve(1, 10, 28, 2, 'cave'); m.carve(2, 5, 25, 2, 'plank'); m.carve(3, 15, 25, 2, 'cave');
  for (const x of [4, 14, 25]) m.carve(x, 5, 1, 12, 'ladder');
  m.set(12, 5, 'gold'); m.set(13, 5, 'gold');
  m.rect(20, 16, 3, 1, 'water');
  m.sprinkle(['ore_coal', 'ore_coal', 'ore_coal', 'ore_gold', 'ore_gold', 'ore_dia'], 0.16, 5);
  m.torches([9], [8, 11, 18, 23]); m.torches([4], [8, 18, 22]); m.torches([14], [7, 12, 19]);
  return { id: 'tambang', tiles: m.t, spots, entry: ENTRY, exit: EXIT, dark: 0.6 };
}

function gua() {
  const spots = { guide: [6, 11], sign: [3, 11], camp: [5, 9], citizen: [6, 16], talker: [26, 16], chest: [3, 4], hoax1: [14, 9], hoax2: [9, 17], guardian: [24, 10], altar: [28, 10], hearts: [[12, 9], [26, 14]] };
  const m = new MB('stone'); m.reserve({ ...spots, entry: ENTRY, exit: EXIT });
  m.rect(11, 2, 9, 5, 'lava');
  m.carve(1, 10, 28, 2, 'nether');
  m.carve(2, 3, 7, 5, 'nether'); m.carve(4, 8, 2, 2, 'nether');
  m.carve(10, 8, 11, 2, 'nether');
  m.carve(4, 14, 9, 5, 'nether'); m.carve(7, 12, 2, 2, 'nether');
  m.carve(13, 15, 2, 3, 'nether');
  m.rect(15, 14, 9, 5, 'lava'); m.hline(15, 23, 16, 'bridge');
  m.carve(24, 14, 4, 5, 'nether'); m.carve(26, 12, 1, 2, 'nether');
  m.carve(21, 7, 7, 6, 'nether');
  m.sprinkle(['ore_gold', 'ore_dia', 'ore_gold'], 0.1, 7);
  m.sprinkle(['lava'], 0.07, 9);
  m.torches([9, 13], [3, 8, 12, 19]);
  return { id: 'gua', tiles: m.t, spots, entry: ENTRY, exit: EXIT, dark: 0.7 };
}

export const MAPS = { desa: desa(), kampung: kampung(), pasar: pasar(), tambang: tambang(), gua: gua() };
for (const m of Object.values(MAPS)) { m.w = W; m.h = H; }
