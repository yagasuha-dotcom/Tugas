// Pabrik sprite pixel art: semua gambar dibuat lewat kode (tanpa file gambar).
import { TS } from '../game/constants.js';
import { TILES } from '../data/tiles.js';

const mk = (w = TS, h = TS) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
function rng(seed) { let s = (seed | 0) || 123456789; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return (s >>> 0) / 4294967296; }; }
const px = (g, c, x, y, w = 1, h = 1) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
function noise(g, cols, seed) {
  const r = rng(seed * 7919 + 13);
  for (let y = 0; y < TS; y++) for (let x = 0; x < TS; x++) { const v = r(); px(g, v < 0.16 ? cols[1] : v > 0.86 ? cols[2] : cols[0], x, y); }
}
function art(rows, pal) {
  const c = mk(); const g = c.getContext('2d');
  rows.forEach((row, y) => { const r = row.padEnd(TS, '.'); for (let x = 0; x < TS; x++) { const ch = r[x]; if (ch !== '.' && pal[ch]) px(g, pal[ch], x, y); } });
  return c;
}
const flip = (c) => { const n = mk(); const g = n.getContext('2d'); g.translate(TS, 0); g.scale(-1, 1); g.drawImage(c, 0, 0); return n; };
const scaled = (c, s) => { const n = mk(c.width * s, c.height * s); const g = n.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(c, 0, 0, n.width, n.height); return n; };
const shade = (hex, a) => {
  const n = parseInt(hex.slice(1), 16); const cl = (v) => Math.max(0, Math.min(255, v));
  return '#' + [cl((n >> 16) + a), cl(((n >> 8) & 255) + a), cl((n & 255) + a)].map((v) => v.toString(16).padStart(2, '0')).join('');
};

// ---------- TILE ----------
const stall = (c) => (g) => {
  P.sand(g);
  for (let x = 0; x < TS; x += 4) { px(g, c, x, 1, 2, 6); px(g, '#f4f4f4', x + 2, 1, 2, 6); }
  px(g, '#7a4a22', 1, 7, 14, 1); px(g, '#a8743a', 1, 8, 14, 5); px(g, '#6b4423', 1, 13, 14, 1);
  [['#ff5252', 3], ['#ffeb3b', 7], ['#66bb6a', 11]].forEach(([col, x]) => px(g, col, x, 8, 3, 2));
};
const roofP = (base, dark, light) => (g) => {
  px(g, base, 0, 0, 16, 16);
  for (let y = 0; y < 16; y += 4) { px(g, dark, 0, y + 3, 16, 1); const off = (y / 4) % 2 ? 0 : 4; for (let x = off; x < 16; x += 8) px(g, dark, x, y, 1, 3); }
  px(g, light, 0, 0, 16, 1);
};
const ore = (c) => (g) => {
  P.stone(g);
  for (const [x, y] of [[3, 3], [9, 2], [6, 8], [11, 10], [2, 11]]) { px(g, c, x, y, 3, 2); px(g, c, x + 1, Math.max(0, y - 1), 1, 1); }
};

const P = {
  grass: (g) => noise(g, ['#5aa63a', '#4d9531', '#6cb84a'], 1),
  flower: (g) => {
    P.grass(g);
    [[3, 4, '#ff5252'], [10, 10, '#ffeb3b'], [11, 3, '#ffffff']].forEach(([x, y, c]) => {
      px(g, c, x + 1, y); px(g, c, x, y + 1); px(g, c, x + 2, y + 1); px(g, c, x + 1, y + 2); px(g, '#fff176', x + 1, y + 1);
    });
  },
  path: (g) => noise(g, ['#9c6d42', '#8b5e35', '#ad7d50'], 3),
  sand: (g) => noise(g, ['#e3d08e', '#d6c27b', '#efe0a6'], 4),
  plank: (g) => {
    noise(g, ['#bd8a55', '#b48050', '#c8955f'], 5);
    for (const y of [3, 7, 11, 15]) px(g, '#8f6234', 0, y, 16, 1);
    for (const [x, y] of [[5, 0], [11, 4], [3, 8], [9, 12]]) px(g, '#8f6234', x, y, 1, 3);
  },
  stonefloor: (g) => {
    noise(g, ['#9a9aa4', '#90909a', '#a6a6b0'], 6);
    px(g, '#74747e', 7, 0, 1, 16); px(g, '#74747e', 15, 0, 1, 16); px(g, '#74747e', 0, 7, 16, 1); px(g, '#74747e', 0, 15, 16, 1);
  },
  carpet: (g) => {
    px(g, '#a33a44', 0, 0, 16, 16); px(g, '#e0b84a', 1, 0, 1, 16); px(g, '#e0b84a', 14, 0, 1, 16);
    px(g, '#8a2f38', 4, 0, 1, 16); px(g, '#8a2f38', 11, 0, 1, 16);
  },
  cave: (g) => noise(g, ['#3b3b4d', '#33333f', '#46465c'], 7),
  nether: (g) => noise(g, ['#7b2b2e', '#6a2226', '#8f3a3d'], 8),
  bridge: (g) => {
    px(g, '#9a6a3a', 0, 0, 16, 16); for (const y of [3, 7, 11]) px(g, '#6f4a24', 0, y, 16, 1);
    px(g, '#5a3a1a', 0, 0, 16, 1); px(g, '#5a3a1a', 0, 15, 16, 1);
  },
  door: (g) => {
    px(g, '#6b4423', 0, 0, 16, 16); px(g, '#8a5a2b', 2, 1, 12, 14); px(g, '#6b4423', 7, 1, 1, 14);
    px(g, '#ffd54f', 10, 8, 2, 2); px(g, '#4a2f1a', 2, 1, 12, 1);
  },
  ladder: (g) => {
    P.cave(g); px(g, '#8a5a2b', 4, 0, 2, 16); px(g, '#8a5a2b', 10, 0, 2, 16);
    for (let y = 1; y < 16; y += 4) px(g, '#b07a40', 6, y, 4, 2);
  },
  water: (g, f) => {
    noise(g, ['#2f6fd8', '#2a64c8', '#3a7ae8'], 10);
    px(g, '#6aa5f8', 2 + f * 5, 3, 6, 1); px(g, '#6aa5f8', 8 - f * 5, 10, 5, 1); px(g, '#6aa5f8', 1 + f * 6, 14, 4, 1);
  },
  lava: (g, f) => {
    noise(g, ['#e8561b', '#d13f10', '#ff8a28'], 11);
    px(g, '#ffd24a', 2 + f * 4, 3, 4, 2); px(g, '#ffd24a', 9 - f * 3, 9, 5, 2); px(g, '#ffd24a', 4 + f * 5, 13, 3, 1);
  },
  tree: (g) => {
    P.grass(g); px(g, '#6d4526', 6, 9, 4, 7); px(g, '#5a371c', 6, 9, 1, 7);
    px(g, '#2e7d32', 1, 1, 14, 10); px(g, '#43a047', 2, 2, 5, 3); px(g, '#43a047', 9, 5, 4, 3);
    px(g, '#1b5e20', 1, 9, 14, 2); px(g, '#1b5e20', 10, 2, 3, 2); px(g, '#66bb6a', 3, 3, 2, 1);
  },
  bush: (g) => {
    P.grass(g); px(g, '#2e8b3a', 2, 5, 12, 9); px(g, '#3fa64d', 3, 4, 10, 3); px(g, '#66bb6a', 4, 6, 3, 2);
    px(g, '#1f6b2b', 2, 12, 12, 2); px(g, '#e53935', 9, 8, 2, 2);
  },
  fence: (g) => {
    P.grass(g); px(g, '#a8743a', 0, 5, 16, 2); px(g, '#a8743a', 0, 10, 16, 2);
    px(g, '#8d5a2b', 2, 3, 3, 12); px(g, '#8d5a2b', 11, 3, 3, 12); px(g, '#c18a4c', 2, 3, 3, 1); px(g, '#c18a4c', 11, 3, 3, 1);
  },
  woodwall: (g) => {
    px(g, '#8a5a2b', 0, 0, 16, 16);
    for (const x of [3, 7, 11, 15]) px(g, '#6b4423', x, 0, 1, 16);
    for (const x of [1, 5, 9, 13]) px(g, '#a06a35', x, 0, 1, 16);
  },
  roof: roofP('#b33a2b', '#8a2b20', '#cf5440'),
  roofblue: roofP('#3a5fa8', '#2b4682', '#5a82c8'),
  brick: (g) => {
    px(g, '#9a9aa4', 0, 0, 16, 16);
    for (let y = 0; y < 16; y += 4) { px(g, '#62626c', 0, y + 3, 16, 1); const off = (y / 4) % 2 ? 0 : 4; for (let x = off; x < 16; x += 8) px(g, '#62626c', x, y, 1, 3); }
  },
  stone: (g) => {
    noise(g, ['#808088', '#72727a', '#919199'], 9);
    px(g, '#5c5c64', 0, 15, 16, 1); px(g, '#5c5c64', 15, 0, 1, 16); px(g, '#a8a8b0', 0, 0, 16, 1); px(g, '#a8a8b0', 0, 0, 1, 16);
  },
  ore_coal: ore('#1c1c1c'),
  ore_gold: ore('#f9c935'),
  ore_dia: ore('#4fe3e3'),
  torchwall: (g, f) => {
    P.stone(g); px(g, '#7a4a22', 7, 6, 2, 7); px(g, '#ff9800', 6, 3 + f, 4, 4); px(g, '#ffeb3b', 7, 4 + f, 2, 2);
  },
  stall_red: stall('#d84343'),
  stall_blue: stall('#3a6fd8'),
  stall_green: stall('#3aa65a'),
  crate: (g) => {
    px(g, '#a8743a', 0, 0, 16, 16); px(g, '#6b4423', 0, 0, 16, 2); px(g, '#6b4423', 0, 14, 16, 2);
    px(g, '#6b4423', 0, 0, 2, 16); px(g, '#6b4423', 14, 0, 2, 16);
    for (let i = 2; i < 14; i++) { px(g, '#8d5a2b', i, i); px(g, '#8d5a2b', 15 - i, i); }
  },
  gold: (g) => {
    px(g, '#f4c430', 0, 0, 16, 16); px(g, '#fff176', 1, 1, 6, 2); px(g, '#fff176', 1, 1, 2, 6);
    px(g, '#c9971c', 0, 15, 16, 1); px(g, '#c9971c', 15, 0, 1, 16); px(g, '#e0a820', 8, 8, 6, 6);
  },
  obsidian: (g) => noise(g, ['#1a1030', '#120a24', '#2b1b4a'], 12),
};

// ---------- KARAKTER ----------
export const PALS = {
  look0: { H: '#4a2f1b', S: '#e9b58b', E: '#2a3a8a', B: '#2fa4b8', P: '#3a3fa6', O: '#4a4a55' },
  look1: { H: '#2b1a12', S: '#f0c09a', E: '#222222', B: '#e8588a', P: '#5b4a9a', O: '#4a4a55' },
  look2: { H: '#f2cf5f', S: '#e9b58b', E: '#2a6a2a', B: '#4cae4c', P: '#6a4a2a', O: '#4a4a55' },
  look3: { H: '#161616', S: '#8f5d3d', E: '#111111', B: '#f08a24', P: '#2d2d3a', O: '#4a4a55' },
  elder: { H: '#ececec', S: '#e0a878', E: '#333333', B: '#8a5ac8', P: '#6a3fa8', O: '#3a2a4a' },
  ibu: { H: '#3a2415', S: '#e0a878', E: '#222222', B: '#d8504a', P: '#7a4a3a', O: '#3a3a3a' },
  pak: { H: '#2a2a2a', S: '#c88f5e', E: '#222222', B: '#5a8a3a', P: '#3a4a5a', O: '#3a3a3a' },
  guru: { H: '#5a3a22', S: '#e0a878', E: '#222222', B: '#2f7fbf', P: '#2a2a3a', O: '#3a3a3a' },
  kepsek: { H: '#8a8a8a', S: '#e0a878', E: '#222222', B: '#3a3a52', P: '#2a2a3a', O: '#222222' },
  anak: { H: '#1b1b1b', S: '#e9b58b', E: '#222222', B: '#f2c230', P: '#3a6fd8', O: '#4a4a55' },
  pemuda: { H: '#7a4a22', S: '#d9a577', E: '#222222', B: '#7a5ac8', P: '#2f4a6a', O: '#3a3a3a' },
  pedagang: { H: '#222222', S: '#b97a4f', E: '#222222', B: '#e0a030', P: '#7a3a2a', O: '#3a3a3a' },
  penambang: { H: '#ffd54f', S: '#c88f5e', E: '#222222', B: '#6a6a78', P: '#3a3a4a', O: '#2a2a2a' },
  guard: { H: '#8a8a98', S: '#e0a878', E: '#222222', B: '#a8a8b8', P: '#6a6a7a', O: '#d4a73a' },
};

const HUM = {
  down: [
    '................', '....HHHHHHHH....', '....HHHHHHHH....', '....HSSSSSSH....', '....SESSSSES....', '....SSSSSSSS....',
    '.....SSSSSS.....', '...ABBBBBBBBA...', '...ABBBBBBBBA...', '...ABBBBBBBBA...', '...ABBBBBBBBA...',
    '....PPPPPPPP....', '....PPPPPPPP....', '....PPP..PPP....', '....PPP..PPP....', '....OOO..OOO....',
  ],
  up: [
    '................', '....HHHHHHHH....', '....HHHHHHHH....', '....HHHHHHHH....', '....HHHHHHHH....', '....HHHHHHHH....',
    '.....SSSSSS.....', '...ABBBBBBBBA...', '...ABBBBBBBBA...', '...ABBBBBBBBA...', '...ABBBBBBBBA...',
    '....PPPPPPPP....', '....PPPPPPPP....', '....PPP..PPP....', '....PPP..PPP....', '....OOO..OOO....',
  ],
  side: [
    '................', '....HHHHHHHH....', '....HHHHHHHH....', '....HHHSSSSS....', '....HHHSSSES....', '....HHHSSSSS....',
    '.....HSSSSS.....', '.....BBBBBB.....', '.....BBAABB.....', '.....BBAABB.....', '.....BBAABB.....',
    '.....PPPPPP.....', '.....PPPPPP.....', '.....PPPPPP.....', '.....PP..PP.....', '.....OO..OO.....',
  ],
};
function tweak(rows, f, kind) {
  const r = rows.slice();
  if (kind === 's') {
    if (f === 1) { r[13] = '.....PPPPPP.....'; r[14] = '....PP....PP....'; r[15] = '....OO....OO....'; }
    if (f === 2) { r[14] = '......PPPP......'; r[15] = '......OOOO......'; }
  } else {
    if (f === 1) r[15] = '.........OOO....';
    if (f === 2) r[15] = '....OOO.........';
  }
  return r;
}
function humanSheet(name) {
  const base = PALS[name] || PALS.look0; const pal = { ...base, A: base.S };
  const frames = (rows, kind) => [0, 1, 2].map((f) => art(tweak(rows, f, kind), pal));
  const sheet = { down: frames(HUM.down, 'v'), up: frames(HUM.up, 'v'), right: frames(HUM.side, 's') };
  sheet.left = sheet.right.map(flip);
  return sheet;
}

// ---------- OBJEK & MUSUH ----------
const SLIME = [
  '................', '................', '................', '................', '....GGGGGGGG....', '...GGGGGGGGGG...',
  '..GGLLGGGGGGGG..', '..GGLGGGGGGGGG..', '..GGGGWWGGWWGG..', '..GGGGWKGGWKGG..', '..GGGGGGGGGGGG..',
  '..GGGGGKKGGGGG..', '..GGGGGGGGGGGG..', '...GGGGGGGGGG...',
];
const GHOST = [
  '................', '....WWWWWWWW....', '...WWWWWWWWWW...', '..WWWWWWWWWWWW..', '..WWKKWWWWKKWW..', '..WWKKWWWWKKWW..',
  '..WWWWWKKWWWWW..', '..WWWWKKKKWWWW..', '..WWWWKKKKWWWW..', '..WWWWWWWWWWWW..', '..WWWWWWWWWWWW..',
  '..WWWWWWWWWWWW..', '..WW.WWW.WW.WW..', '..W...W..W...W..',
];
const CHEST = [
  '', '', '', '..DDDDDDDDDDDD..', '.DBBBBBBBBBBBBD.', '.DBBBBBBBBBBBBD.', '.DBBBBBBBBBBBBD.',
  '.DDDDDDGGDDDDDD.', '.DBBBBBGGBBBBBD.', '.DBBBBBBBBBBBBD.', '.DBBBBBBBBBBBBD.', '.DDDDDDDDDDDDDD.',
];
const CHEST_OPEN = [
  '', '..DDDDDDDDDDDD..', '.DBBBBBBBBBBBBD.', '.DBBBBBBBBBBBBD.', '.DDDDDDDDDDDDDD.', '.DKKKKKKKKKKKKD.',
  '.DKKKKKKKKKKKKD.', '.DBBBBBBBBBBBBD.', '.DBBBBBBBBBBBBD.', '.DBBBBBBBBBBBBD.', '.DDDDDDDDDDDDDD.',
];
const SIGN = [
  '', '', '...DDDDDDDDDD...', '...DBBBBBBBBD...', '...DBKKKKKKBD...', '...DBBBBBBBBD...', '...DBKKKKKBBD...',
  '...DDDDDDDDDD...', '.......DD.......', '.......DD.......', '.......DD.......', '.......DD.......', '.......DD.......', '.......DD.......',
];
const CARD = [
  '', '', '....DDDDDDDD....', '....DWWWWWWD....', '....DWWGGWWD....', '....DWGGGGWD....', '....DWWGGWWD....',
  '....DWKKKKWD....', '....DWWWWWWD....', '....DWKKKKWD....', '....DWWWWWWD....', '....DDDDDDDD....',
];
const SHARD = [
  '', '.......CC.......', '......CCCC......', '.....CCLCCC.....', '....CCLLCCCC....', '...CCLLCCCCCC...',
  '...CCLCCCCCCC...', '....CCCCCCCC....', '....CCCCCCCC....', '.....CCCCCC.....', '......CCCC......', '.......CC.......',
];
const HEART = [
  '', '', '...RRRR..RRRR...', '..RRRRRRRRRRRR..', '..RRLLRRRRRRRR..', '..RRLRRRRRRRRR..', '..RRRRRRRRRRRR..',
  '...RRRRRRRRRR...', '....RRRRRRRR....', '.....RRRRRR.....', '......RRRR......', '.......RR.......',
];

export function buildSprites() {
  const tiles = {};
  for (const k of Object.keys(TILES)) {
    if (!P[k]) throw new Error('Painter tile belum ada: ' + k);
    const n = TILES[k].anim || 1; tiles[k] = [];
    for (let f = 0; f < n; f++) { const c = mk(); P[k](c.getContext('2d'), f); tiles[k].push(c); }
  }
  const cache = {}; const slimes = {};
  const objPal = { D: '#4a2f1a', B: '#a8743a', G: '#ffd54f', K: '#15101e', W: '#f6efd2', C: '#43e0e0', L: '#c9ffff', R: '#e53935' };
  const portal = [0, 1].map((f) => {
    const c = mk(); const g = c.getContext('2d'); noise(g, ['#1a1030', '#120a24', '#2b1b4a'], 12);
    const inner = mk(); noise(inner.getContext('2d'), ['#c04fd8', '#8a2fa8', '#e07af0'], 20 + f);
    g.drawImage(inner, 3, 1, 10, 14, 3, 1, 10, 14); return c;
  });
  const camp = [0, 1].map((f) => {
    const c = mk(); const g = c.getContext('2d');
    px(g, '#5a3a1a', 2, 12, 12, 2); px(g, '#7a4a22', 4, 10, 8, 2);
    px(g, '#ff7a1a', 5, 5 - f, 6, 6 + f); px(g, '#ffc83d', 6, 6 - f, 4, 4 + f); px(g, '#fff3a0', 7, 8 - f, 2, 2); return c;
  });
  const altar = mk(); P.gold(altar.getContext('2d'), 0);
  const ghostC = art(GHOST, { W: '#f0f0f6', K: '#2a2a2a' });
  const boss = scaled(art(GHOST, { W: '#e8685a', K: '#2a0a0a' }), 2);
  const obj = {
    chest: art(CHEST, objPal), chestOpen: art(CHEST_OPEN, objPal), sign: art(SIGN, objPal), card: art(CARD, objPal),
    shard: art(SHARD, objPal), heart: art(HEART, objPal), ghost: ghostC, boss, portal, camp, altar,
  };
  const url = (c, s = 1) => scaled(c, s).toDataURL();
  const grayPal = { ...objPal, R: '#4a4458', L: '#6a6478', C: '#4a4458' };
  return {
    tiles, obj,
    human(name) { return cache[name] || (cache[name] = humanSheet(name)); },
    slime(color) {
      if (!slimes[color]) slimes[color] = art(SLIME, { G: color, L: shade(color, 70), W: '#ffffff', K: '#1b1b1b' });
      return slimes[color];
    },
    portrait(name) { return name === 'boss' ? scaled(ghostC, 1) : this.human(name).down[0]; },
    url,
    icons: {
      heart: url(obj.heart, 2), heartEmpty: url(art(HEART, grayPal), 2),
      shard: url(obj.shard, 2), shardEmpty: url(art(SHARD, grayPal), 2),
    },
  };
}
