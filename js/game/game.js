import { TS, DIRS, OPPOSITE, SPEED, MAX_HEARTS } from './constants.js';
import { MAPS } from '../data/maps.js';
import { CHAPTERS } from '../data/chapters.js';
import { STORY } from '../data/story.js';
import { buildSprites } from '../engine/sprites.js';
import { Renderer } from '../engine/renderer.js';
import { Input } from '../engine/input.js';
import { audio } from '../engine/audio.js';
import { UI } from './ui.js';
import { World } from './world.js';
import { newState, saveState, loadState, hasSave, clearSave } from './state.js';
import { objectives, nextObjective, activeChapter } from './quests.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class Game {
  constructor() {
    this.sp = buildSprites();
    this.r = new Renderer(document.getElementById('game'), this.sp);
    this.input = new Input();
    this.ui = new UI(this.sp, audio);
    this.touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (this.touch) document.body.classList.add('touch');
    this.mode = 'title'; this.t = 0; this.last = 0; this.stepN = 0;
    this.state = newState(); this.world = null; this.player = null;
    this.frame = this.frame.bind(this);
    document.getElementById('btn-quest').onclick = () => this.openQuests();
    document.getElementById('btn-journal').onclick = () => this.openJournal();
    document.getElementById('btn-menu').onclick = () => this.openMenu();
  }

  async run() {
    requestAnimationFrame(this.frame);
    await this.toTitle();
  }

  // ---------- alur judul & mulai ----------
  async toTitle() {
    this.mode = 'title'; this.player = null; this.state = newState();
    this.world = new World('desa', this.state);
    this.ui.showHud(false, this.touch);
    const c = await this.ui.title({ hasSave: hasSave() });
    audio.init();
    if (c.mode === 'new') {
      clearSave();
      this.state = newState(c.name, c.look);
      await this.ui.story(STORY.intro.map((s) => this.fmt(s)));
      await this.enterMap('desa', MAPS.desa.entry);
      this.ui.toast(this.touch ? 'D-pad untuk jalan, tombol A untuk bicara' : 'Panah/WASD jalan, Spasi/Enter bicara, Esc menu');
    } else {
      this.state = loadState() || newState();
      const p = this.state.pos;
      await this.enterMap(p.map, [p.x, p.y]);
    }
  }
  fmt(s) { return s.replace(/\{nama\}/g, this.state.player.name); }
  say(name, lines, pal, keep = false) { return this.ui.sayAll(name, lines.map((l) => this.fmt(l)), pal, keep); }
  hud() {
    if (!this.world) return;
    const ch = this.world.ch;
    this.ui.hud(this.state, ch, nextObjective(ch, this.state));
  }
  save() { saveState(this.state); }

  // ---------- peta ----------
  nearestFree(x, y) {
    const w = this.world;
    for (let r = 0; r <= 5; r++) {
      for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) {
        const nx = x + i; const ny = y + j;
        if (!w.blocked(nx, ny) && !w.warpAt(nx, ny)) return [nx, ny];
      }
    }
    return [x, y];
  }
  placePlayer(pos) {
    const [x, y] = this.nearestFree(pos[0], pos[1]);
    this.player = { type: 'player', x, y, rx: x * TS, ry: y * TS, dir: 'down', moving: false, pal: 'look' + this.state.player.look, solid: false };
  }
  async enterMap(id, pos) {
    this.mode = 'busy';
    if (this.player) await this.ui.fade(true);
    this.world = new World(id, this.state);
    const ch = this.world.ch;
    this.placePlayer(pos);
    this.r.follow(this.world, this.player.rx + 8, this.player.ry + 8, true);
    audio.setChapter(ch.no);
    this.state.pos = { map: id, x: this.player.x, y: this.player.y };
    this.refreshMarks(); this.ui.showHud(true, this.touch); this.hud();
    await this.ui.fade(false);
    if (!this.state.flags[ch.id + '.arrived']) {
      this.state.flags[ch.id + '.arrived'] = true;
      await this.ui.banner(ch.intro[0], ch.area);
      await this.say('', [ch.intro[1]]);
    }
    this.save(); this.mode = 'play'; this.input.flush();
  }
  refreshMarks() {
    if (!this.world) return;
    const ch = this.world.ch; const f = this.state.flags; const id = ch.id;
    const pre = objectives(ch, this.state).filter((o) => o.key !== 'guardian').every((o) => o.done);
    for (const e of this.world.ents) {
      if (e.type !== 'npc') continue;
      e.mark = null;
      if (e.role === 'guide' && !f[id + '.guide']) e.mark = '!';
      if (e.role === 'citizen' && f[id + '.guide'] && !f[id + '.citizen']) e.mark = '?';
      if (e.role === 'guardian' && pre) e.mark = '!';
    }
  }

  // ---------- loop ----------
  frame(ts) {
    const dt = Math.min(0.05, (ts - this.last) / 1000 || 0); this.last = ts; this.t += dt;
    try { this.update(dt); this.render(); } catch (err) { console.error(err); }
    requestAnimationFrame(this.frame);
  }
  approach(e, dt, speed) {
    const tx = e.x * TS; const ty = e.y * TS; const s = speed * dt;
    const dx = tx - e.rx; const dy = ty - e.ry;
    if (Math.abs(dx) <= s) e.rx = tx; else e.rx += Math.sign(dx) * s;
    if (Math.abs(dy) <= s) e.ry = ty; else e.ry += Math.sign(dy) * s;
    return e.rx === tx && e.ry === ty;
  }
  update(dt) {
    const w = this.world; if (!w) return;
    for (const e of w.ents) if (e.type === 'hoax' || e.type === 'npc') { if (e.moving && this.approach(e, dt, 34)) e.moving = false; }
    if (this.mode === 'title' || !this.player) return;
    if (this.ui.busy || this.mode !== 'play') { this.input.flush(); return; }
    if (performance.now() - this.ui.lastClose < 220) this.input.flush();
    const p = this.player;
    // musuh berkeliaran
    for (const e of w.ents) {
      if (e.type !== 'hoax' || e.moving) continue;
      e.wait = (e.wait == null ? Math.random() * 1.5 : e.wait) - dt;
      if (e.wait > 0) continue;
      e.wait = 0.8 + Math.random() * 1.4;
      const d = ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)]; const [dx, dy] = DIRS[d];
      const nx = e.x + dx; const ny = e.y + dy;
      if (Math.abs(nx - e.home[0]) > 2 || Math.abs(ny - e.home[1]) > 2) continue;
      if (nx === p.x && ny === p.y) { this.encounter(e); return; }
      if (w.blocked(nx, ny) || w.anyEntAt(nx, ny, e)) continue;
      e.x = nx; e.y = ny; e.moving = true; e.dir = d;
    }
    if (p.moving && this.approach(p, dt, SPEED)) { p.moving = false; this.onArrive(); }
    if (this.mode !== 'play') return;
    if (!p.moving) {
      const d = this.input.dir();
      if (d) {
        p.dir = d; const [dx, dy] = DIRS[d]; const nx = p.x + dx; const ny = p.y + dy;
        const o = w.entAt(nx, ny);
        if (o && o.type === 'hoax') { this.encounter(o); return; }
        if (!w.blocked(nx, ny)) { p.x = nx; p.y = ny; p.moving = true; if (++this.stepN % 2 === 0) audio.sfx('step'); }
      }
      if (this.input.takeAct()) this.tryInteract();
      if (this.input.takeMenu()) this.openMenu();
    }
  }
  render() {
    const w = this.world; if (!w) return;
    if (this.mode === 'title' || !this.player) {
      const span = w.w * TS - this.r.W; const k = (Math.sin(this.t * 0.12) + 1) / 2;
      this.r.follow(w, this.r.W / 2 + Math.max(0, span) * k, 10 * TS + 8, true);
      this.r.draw(w, w.ents, this.t, { shards: 0 }); return;
    }
    const p = this.player; this.r.follow(w, p.rx + 8, p.ry + 8);
    this.r.draw(w, [...w.ents, p], this.t, { shards: this.state.shards.length });
  }

  // ---------- interaksi ----------
  onArrive() {
    const p = this.player; const w = this.world;
    this.state.pos = { map: w.id, x: p.x, y: p.y };
    const wp = w.warpAt(p.x, p.y);
    if (wp) { this.useWarp(wp); return; }
    const h = w.ents.find((e) => e.type === 'heart' && e.x === p.x && e.y === p.y);
    if (h) {
      w.remove(h); this.state.flags[h.key] = true; this.state.poin += 10;
      if (this.state.hearts < MAX_HEARTS) this.state.hearts++;
      audio.sfx('ok'); this.ui.toast('Hati ditemukan! Semangat bertambah.'); this.hud(); this.save();
    }
  }
  async useWarp(wp) {
    const ch = this.world.ch;
    if (wp.dir === 'next' && !this.state.flags[ch.id + '.guardian']) {
      this.ui.toast('Gerbang tersegel! Kalahkan penjaga gerbang dulu.'); audio.sfx('bad');
      this.player.x = wp.x - 1; this.player.moving = true; return;
    }
    this.mode = 'busy'; audio.sfx('warp');
    await this.enterMap(wp.to, wp.dir === 'next' ? MAPS[wp.to].entry : MAPS[wp.to].exit);
  }
  tryInteract() {
    const p = this.player; const [dx, dy] = DIRS[p.dir];
    const e = this.world.entAt(p.x + dx, p.y + dy);
    if (e) { audio.sfx('talk'); this.interact(e); }
  }
  async interact(e) {
    if (this.mode !== 'play') return;
    this.mode = 'busy';
    try {
      if (e.type === 'npc' || e.type === 'hoax') e.dir = OPPOSITE[this.player.dir];
      switch (e.type) {
        case 'npc':
          if (e.role === 'guide') await this.talkGuide(e);
          else if (e.role === 'citizen') await this.talkCitizen(e);
          else if (e.role === 'talker') await this.talkTalker(e);
          else if (e.role === 'guardian') await this.talkGuardian(e);
          break;
        case 'sign': await this.say('Papan Info', this.world.ch.sign); break;
        case 'chest': await this.openChest(e); break;
        case 'camp':
          this.state.hearts = MAX_HEARTS; this.save(); audio.sfx('ok');
          this.ui.toast('Beristirahat di api unggun: semangat pulih dan game tersimpan.'); break;
        case 'altar': await this.talkAltar(); break;
        case 'hoax': this.mode = 'play'; await this.encounter(e); break;
        default: break;
      }
    } catch (err) { console.error(err); this.ui.closeDlg(); }
    finally { if (this.mode === 'busy') this.mode = 'play'; this.input.flush(); this.refreshMarks(); this.hud(); }
  }
  async giveCard(card) {
    if (this.state.cards.includes(card.id)) return;
    this.state.cards.push(card.id); this.state.poin += 25; audio.sfx('card');
    await this.ui.showCard(card); this.save();
  }
  async talkGuide(e) {
    const ch = this.world.ch; const g = ch.guide; const f = this.state.flags;
    if (!f[ch.id + '.guide']) {
      await this.say(g.name, g.lines, g.pal); f[ch.id + '.guide'] = true; await this.giveCard(ch.cards[0]); return;
    }
    const rest = objectives(ch, this.state).filter((o) => !o.done);
    if (rest.length) await this.say(g.name, [...g.again, 'Yang belum selesai: ' + rest.map((o) => o.text).join('; ') + '.'], g.pal);
    else await this.say(g.name, ['Semua tugasmu di sini sudah beres, ' + this.state.player.name + '!'], g.pal);
  }
  async talkCitizen(e) {
    const ch = this.world.ch; const c = ch.citizen; const f = this.state.flags;
    if (f[ch.id + '.citizen']) { await this.say(c.name, c.done, c.pal); return; }
    if (!f[ch.id + '.guide']) { await this.say(c.name, ['Temui dulu ' + ch.guide.name + ' ya. Beliau tahu soal masalah di sini.'], c.pal); return; }
    await this.say(c.name, c.intro, c.pal, true);
    for (;;) {
      const i = await this.ui.choose(c.task.prompt, c.task.options, c.name, c.pal);
      if (i === c.task.answer) {
        this.state.stats.benar++; this.state.poin += 20; audio.sfx('ok');
        await this.say(c.name, [c.task.explain, ...c.win], c.pal); break;
      }
      this.state.stats.salah++; audio.sfx('bad');
      await this.say(c.name, [c.fail], c.pal, true);
    }
    f[ch.id + '.citizen'] = true; await this.giveCard(ch.cards[2]);
  }
  async talkTalker(e) {
    const ch = this.world.ch; const t = ch.talker; const k = ch.id + '.talker';
    await this.say(t.name, t.lines, t.pal);
    if (!this.state.flags[k]) { this.state.flags[k] = true; this.state.poin += 10; this.ui.toast('+10 poin'); }
  }
  async openChest(e) {
    const ch = this.world.ch;
    if (e.opened) { await this.say('', ['Peti ini sudah kosong.']); return; }
    e.opened = true; this.state.flags[ch.id + '.chest'] = true; this.state.poin += 30; audio.sfx('card');
    await this.say('', ch.chest); await this.giveCard(ch.cards[1]);
  }
  async talkAltar() {
    const n = this.state.shards.length;
    if (n >= 5) await this.say('Altar Kristal Harmoni', ['Kelima keping menyatu dan bersinar hangat. Harmoni telah pulih berkat pengetahuanmu.']);
    else await this.say('Altar Kristal Harmoni', ['Altar ini menunggu keping kristal. Terkumpul: ' + n + ' dari 5.']);
  }
  async talkGuardian(e) {
    const ch = this.world.ch; const gd = ch.guardian; const f = this.state.flags;
    const rest = objectives(ch, this.state).filter((o) => !o.done && o.key !== 'guardian');
    if (rest.length) { await this.say(gd.name, [gd.locked, 'Selesaikan dulu: ' + rest.map((o) => o.text).join('; ') + '.'], gd.pal); return; }
    await this.say(gd.name, gd.intro, gd.pal);
    const img = gd.pal === 'boss' ? this.sp.url(this.sp.obj.boss, 3) : this.sp.url(this.sp.portrait(gd.pal), 6);
    const ok = await this.battle({ title: gd.name, img, questions: ch.quiz.slice(4, 7) });
    if (!ok) { await this.faint(); return; }
    await this.say(gd.name, gd.win, gd.pal);
    f[ch.id + '.guardian'] = true; this.world.remove(e);
    this.state.shards.push(ch.no); this.state.poin += 150; audio.sfx('shard');
    this.ui.toast(ch.shard + ' didapat!'); this.hud(); this.save();
    if (ch.no === 5) await this.finale();
    else await this.say('', ['Gerbang di sebelah timur kini terbuka. Lanjutkan petualanganmu!']);
  }
  async finale() {
    await this.ui.story(STORY.ending.map((s) => this.fmt(s)));
    const choice = await this.ui.ending({
      nama: this.state.player.name, poin: this.state.poin, kartu: this.state.cards.length, totalKartu: CHAPTERS.length * 3,
      benar: this.state.stats.benar, salah: this.state.stats.salah,
    });
    this.save();
    if (choice === 'title') { this.mode = 'busy'; await this.toTitle(); }
  }

  // ---------- pertarungan kuis ----------
  async battle({ title, img, questions }) {
    const ui = this.ui; const st = this.state;
    ui.openBattle(title, img); const queue = [...questions]; const total = queue.length; let solved = 0;
    ui.battleHp(0, total); ui.battleHearts(st.hearts);
    while (queue.length) {
      const q = queue.shift(); const r = await ui.askQuiz(q);
      if (r.correct) { solved++; st.stats.benar++; st.poin += 10; ui.battleHp(solved, total); }
      else {
        st.stats.salah++; st.hearts = Math.max(0, st.hearts - 1); ui.battleHearts(st.hearts); queue.push(q);
        if (st.hearts <= 0) { await sleep(300); ui.closeBattle(); return false; }
      }
    }
    await sleep(450); ui.closeBattle(); return true;
  }
  async encounter(e) {
    if (this.mode !== 'play') return;
    this.mode = 'busy';
    try {
      const ch = this.world.ch; const f = this.state.flags;
      audio.sfx('hit'); e.mark = null;
      await this.say('', [e.name + ' menghadangmu! Jawab pertanyaannya dengan benar untuk mengalahkannya.']);
      const qs = e.key === 'hoax1' ? ch.quiz.slice(0, 2) : ch.quiz.slice(2, 4);
      const img = this.sp.url(e.kind === 'ghost' ? this.sp.obj.ghost : this.sp.slime(e.color), 6);
      const ok = await this.battle({ title: e.name, img, questions: qs });
      if (ok) {
        this.world.remove(e); f[ch.id + '.' + e.key] = true; this.state.poin += 40; audio.sfx('shard');
        this.ui.toast(e.name + ' sirna!'); this.save();
      } else await this.faint();
    } catch (err) { console.error(err); this.ui.closeBattle(); }
    finally { if (this.mode === 'busy') this.mode = 'play'; this.input.flush(); this.refreshMarks(); this.hud(); }
  }
  async faint() {
    await this.ui.fade(true);
    this.state.hearts = MAX_HEARTS; this.state.poin = Math.max(0, this.state.poin - 20);
    const [x, y] = this.nearestFree(...this.world.def.entry);
    Object.assign(this.player, { x, y, rx: x * TS, ry: y * TS, moving: false });
    this.r.follow(this.world, this.player.rx + 8, this.player.ry + 8, true);
    await this.ui.fade(false);
    await this.say('', ['Kamu kehabisan semangat dan pingsan. Warga membawamu kembali ke awal wilayah ini dan semangatmu pulih. Buka Jurnal, pelajari kartunya, lalu coba lagi!']);
  }

  // ---------- menu ----------
  async openQuests() {
    if (this.mode !== 'play') return; this.mode = 'busy';
    await this.ui.quests(this.state, CHAPTERS, objectives, activeChapter(CHAPTERS, this.state).no);
    this.mode = 'play'; this.input.flush();
  }
  async openJournal() {
    if (this.mode !== 'play') return; this.mode = 'busy';
    await this.ui.journal(this.state, CHAPTERS);
    this.mode = 'play'; this.input.flush();
  }
  async openMenu() {
    if (this.mode !== 'play') return; this.mode = 'busy';
    const items = ['Lanjutkan', 'Misi', 'Jurnal Materi', audio.on ? 'Suara: hidup' : 'Suara: mati', 'Simpan game', 'Kembali ke judul'];
    const i = await this.ui.menu('Menu', items);
    this.mode = 'play'; this.input.flush();
    if (i === 1) await this.openQuests();
    else if (i === 2) await this.openJournal();
    else if (i === 3) audio.toggle();
    else if (i === 4) { this.save(); this.ui.toast('Game tersimpan.'); }
    else if (i === 5) { this.save(); this.mode = 'busy'; await this.toTitle(); }
  }
}
