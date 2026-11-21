// Validasi data: peta (jalan terhubung, posisi valid) dan bab (kartu, soal, palet karakter).
// Jalankan: node tools/validate.mjs
import { MAPS } from '../js/data/maps.js';
import { CHAPTERS } from '../js/data/chapters.js';
import { TILES } from '../js/data/tiles.js';
import { MAP_ORDER } from '../js/game/constants.js';
import { PALS } from '../js/engine/sprites.js';

let errors = 0;
const err = (m) => { errors++; console.error('GAGAL: ' + m); };
const walk = (m, x, y) => x >= 0 && y >= 0 && x < m.w && y < m.h && !TILES[m.tiles[y][x]].solid;

for (const id of MAP_ORDER) {
  const m = MAPS[id]; if (!m) { err('peta tidak ada: ' + id); continue; }
  for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) if (!TILES[m.tiles[y][x]]) err(`${id}: tile tidak dikenal di ${x},${y}: ${m.tiles[y][x]}`);
  const seen = new Set(); const q = [[...m.entry]]; seen.add(m.entry.join(','));
  if (!walk(m, ...m.entry)) err(`${id}: entry tidak bisa dilalui`);
  while (q.length) {
    const [x, y] = q.shift();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx; const ny = y + dy; const k = nx + ',' + ny;
      if (walk(m, nx, ny) && !seen.has(k)) { seen.add(k); q.push([nx, ny]); }
    }
  }
  const check = (name, p) => {
    if (!p) return;
    if (!walk(m, p[0], p[1])) err(`${id}: ${name} di ${p} berada di tile padat`);
    else if (!seen.has(p.join(','))) err(`${id}: ${name} di ${p} tidak terjangkau dari entry`);
  };
  Object.entries(m.spots).forEach(([k, v]) => (Array.isArray(v[0]) ? v.forEach((p, i) => check(k + i, p)) : check(k, v)));
  check('exit', m.exit); check('warp-kiri', [1, 10]);
  if (id !== 'gua') check('warp-kanan', [28, 10]);
  const all = Object.entries(m.spots).flatMap(([k, v]) => (Array.isArray(v[0]) ? v : [v]).map((p) => p.join(',')));
  if (new Set(all).size !== all.length) err(`${id}: ada dua entitas di posisi yang sama`);
}

for (const ch of CHAPTERS) {
  if (ch.cards.length !== 3) err(`${ch.id}: kartu harus 3`);
  if (ch.quiz.length !== 7) err(`${ch.id}: soal harus 7 (2 + 2 + 3)`);
  ch.quiz.forEach((q, i) => { if (q.o.length !== 4 || !(q.a >= 0 && q.a < 4) || !q.q || !q.e) err(`${ch.id}: soal ${i} tidak valid`); });
  const t = ch.citizen.task; if (t.options.length < 2 || !(t.answer >= 0 && t.answer < t.options.length)) err(`${ch.id}: tugas warga tidak valid`);
  for (const who of [ch.guide, ch.citizen, ch.talker, ch.guardian]) if (who.pal !== 'boss' && !PALS[who.pal]) err(`${ch.id}: palet karakter tidak ada: ${who.pal}`);
  if (!MAPS[ch.map]) err(`${ch.id}: peta ${ch.map} tidak ada`);
}
if (CHAPTERS.length !== MAP_ORDER.length) err('jumlah bab dan peta tidak sama');

if (errors) { console.error(`\n${errors} masalah ditemukan.`); process.exit(1); }
console.log(`OK: ${MAP_ORDER.length} peta dan ${CHAPTERS.length} bab valid (${CHAPTERS.reduce((n, c) => n + c.quiz.length, 0)} soal, ${CHAPTERS.length * 3} kartu).`);
