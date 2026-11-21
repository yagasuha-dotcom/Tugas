import { TS, MAP_ORDER } from './constants.js';
import { MAPS } from '../data/maps.js';
import { chapterByMap } from '../data/chapters.js';
import { TILES } from '../data/tiles.js';

// Satu peta aktif beserta seluruh entitasnya.
export class World {
  constructor(id, state) {
    const d = MAPS[id];
    this.id = id; this.def = d; this.w = d.w; this.h = d.h; this.tiles = d.tiles; this.dark = d.dark || 0;
    this.ch = chapterByMap(id); this.ents = [];
    this.build(state);
  }
  add(e) { e.rx = e.x * TS; e.ry = e.y * TS; e.dir = e.dir || 'down'; this.ents.push(e); return e; }
  remove(e) { this.ents = this.ents.filter((x) => x !== e); }
  build(state) {
    const S = this.def.spots; const ch = this.ch; const f = state.flags; const cid = ch.id;
    const at = (k) => ({ x: S[k][0], y: S[k][1] });
    if (S.guide) this.add({ type: 'npc', role: 'guide', ...at('guide'), pal: ch.guide.pal, name: ch.guide.name, solid: true });
    if (S.citizen) this.add({ type: 'npc', role: 'citizen', ...at('citizen'), pal: ch.citizen.pal, name: ch.citizen.name, solid: true });
    if (S.talker) this.add({ type: 'npc', role: 'talker', ...at('talker'), pal: ch.talker.pal, name: ch.talker.name, solid: true });
    if (S.sign) this.add({ type: 'sign', ...at('sign'), solid: true });
    if (S.camp) this.add({ type: 'camp', ...at('camp'), solid: true });
    if (S.chest) this.add({ type: 'chest', ...at('chest'), opened: !!f[cid + '.chest'], solid: true });
    for (const k of ['hoax1', 'hoax2']) {
      if (S[k] && !f[cid + '.' + k]) this.add({ type: 'hoax', key: k, ...at(k), home: [...S[k]], name: ch.hoax.name, kind: ch.hoax.kind, color: ch.hoax.color, solid: true, seed: Math.random() * 6 });
    }
    if (S.guardian && !f[cid + '.guardian']) {
      this.add({ type: 'npc', role: 'guardian', ...at('guardian'), pal: ch.guardian.pal, name: ch.guardian.name, solid: true, boss: ch.guardian.pal === 'boss' });
    }
    if (S.altar) this.add({ type: 'altar', ...at('altar'), solid: true });
    (S.hearts || []).forEach(([x, y], i) => { const key = this.id + '.heart' + i; if (!f[key]) this.add({ type: 'heart', key, x, y, solid: false }); });
    const idx = MAP_ORDER.indexOf(this.id);
    if (idx > 0) this.add({ type: 'warp', dir: 'back', to: MAP_ORDER[idx - 1], x: 1, y: 10, solid: false });
    if (idx < MAP_ORDER.length - 1) this.add({ type: 'warp', dir: 'next', to: MAP_ORDER[idx + 1], x: 28, y: 10, solid: false });
  }
  solidTile(x, y) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return true;
    return !!TILES[this.tiles[y][x]].solid;
  }
  entAt(x, y, ignore) { return this.ents.find((e) => e !== ignore && e.solid && e.x === x && e.y === y); }
  anyEntAt(x, y, ignore) { return this.ents.find((e) => e !== ignore && e.x === x && e.y === y); }
  warpAt(x, y) { return this.ents.find((e) => e.type === 'warp' && e.x === x && e.y === y); }
  blocked(x, y, ignore) { return this.solidTile(x, y) || !!this.entAt(x, y, ignore); }
}
