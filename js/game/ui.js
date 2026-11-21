// Seluruh antarmuka berbasis DOM: dialog, kuis pertarungan, modal, HUD, judul, ending.
import { MAX_HEARTS } from './constants.js';

const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const shuffle = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

export class UI {
  constructor(sp, audio) {
    this.sp = sp; this.audio = audio; this.open = new Set(); this.lastClose = 0;
    this.advance = null; this.typing = false; this.tw = null;
    this.dlg = $('dialog'); this.dlgName = $('dlg-name'); this.dlgText = $('dlg-text'); this.dlgChoices = $('dlg-choices');
    this.dlgHint = $('dlg-hint'); this.dlgPortrait = $('dlg-portrait');
    this.bopts = $('b-opts'); this.bnext = $('b-next');
    this.dlg.addEventListener('click', () => this.advance && this.advance());
    $('story').addEventListener('click', () => this.advance && this.advance());
    addEventListener('keydown', (e) => {
      if (e.repeat) return;
      if (this.advance && [' ', 'Enter', 'z', 'Z'].includes(e.key)) { e.preventDefault(); this.advance(); return; }
      if (this.open.has('battle')) {
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= 4) { const b = this.bopts.children[n - 1]; if (b && !b.disabled) b.click(); }
        else if ((e.key === 'Enter' || e.key === ' ') && !this.bnext.classList.contains('hidden')) { e.preventDefault(); this.bnext.click(); }
      }
      if (this.open.has('modal') && e.key === 'Escape') $('m-close').click();
    });
  }
  get busy() { return this.open.size > 0; }

  // ---------- teks bertahap ----------
  _page(el_, text, hint) {
    return new Promise((res) => {
      let i = 0; clearInterval(this.tw); el_.textContent = ''; this.typing = true;
      if (hint) hint.style.visibility = 'hidden';
      const done = () => { clearInterval(this.tw); this.typing = false; el_.textContent = text; if (hint) hint.style.visibility = 'visible'; };
      this.tw = setInterval(() => { i += 2; el_.textContent = text.slice(0, i); if (i >= text.length) done(); }, 20);
      this.advance = () => { if (this.typing) { done(); return; } this.advance = null; res(); };
    });
  }
  _portrait(pal) {
    const c = this.dlgPortrait;
    if (!pal) { c.classList.add('hidden'); return; }
    c.classList.remove('hidden');
    const g = c.getContext('2d'); g.clearRect(0, 0, 64, 64); g.imageSmoothingEnabled = false;
    const src = this.sp.portrait(pal); g.drawImage(src, 0, 0, 64, 64);
  }
  _showDlg(name, pal) {
    this.open.add('dlg'); this.dlg.classList.remove('hidden');
    this.dlgName.textContent = name || ''; this.dlgName.classList.toggle('hidden', !name);
    this.dlgChoices.innerHTML = ''; this._portrait(pal);
  }
  closeDlg() { this.dlg.classList.add('hidden'); this.open.delete('dlg'); this.lastClose = performance.now(); }
  async say(name, text, pal, keep = false) {
    this._showDlg(name, pal);
    await this._page(this.dlgText, text, this.dlgHint);
    if (!keep) this.closeDlg();
  }
  async sayAll(name, lines, pal, keepOpen = false) {
    for (let i = 0; i < lines.length; i++) await this.say(name, lines[i], pal, keepOpen || i < lines.length - 1);
  }
  choose(prompt, options, name, pal) {
    return new Promise((res) => {
      this._showDlg(name, pal); this.advance = null; clearInterval(this.tw);
      this.dlgText.textContent = prompt; this.dlgHint.style.visibility = 'hidden';
      options.forEach((t, i) => {
        const b = el('button', 'opt', String.fromCharCode(65 + i) + '. ' + t);
        b.onclick = () => { this.dlgChoices.innerHTML = ''; res(i); };
        this.dlgChoices.appendChild(b);
      });
    });
  }
  async story(lines) {
    this.open.add('story'); const s = $('story'); s.classList.remove('hidden');
    for (const l of lines) await this._page($('story-text'), l, $('story-hint'));
    s.classList.add('hidden'); this.open.delete('story'); this.lastClose = performance.now();
  }
  toast(msg) {
    const t = $('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(this.tt); this.tt = setTimeout(() => t.classList.remove('show'), 2600);
  }
  async banner(l1, l2, ms = 2400) {
    const b = $('banner'); $('banner-1').textContent = l1; $('banner-2').textContent = l2 || '';
    b.classList.remove('hidden'); b.classList.add('show'); await sleep(ms); b.classList.remove('show'); b.classList.add('hidden');
  }
  async fade(on) { $('fade').classList.toggle('on', on); await sleep(280); }

  // ---------- HUD ----------
  showHud(on, touch) {
    ['hud', 'hudbtns'].forEach((id) => $(id).classList.toggle('hidden', !on));
    $('controls').classList.toggle('hidden', !(on && touch));
  }
  hud(state, ch, nextText) {
    const h = $('hearts'); h.innerHTML = '';
    for (let i = 0; i < MAX_HEARTS; i++) { const im = el('img'); im.src = i < state.hearts ? this.sp.icons.heart : this.sp.icons.heartEmpty; h.appendChild(im); }
    const s = $('shards'); s.innerHTML = '';
    for (let i = 1; i <= 5; i++) { const im = el('img'); im.src = state.shards.includes(i) ? this.sp.icons.shard : this.sp.icons.shardEmpty; s.appendChild(im); }
    $('poin').textContent = state.poin + ' poin';
    $('chlabel').textContent = ch ? 'Bab ' + ch.no + ': ' + ch.title : '';
    $('questline').textContent = nextText ? '▶ ' + nextText : '';
  }

  // ---------- pertarungan kuis ----------
  openBattle(title, img) {
    this.open.add('battle'); $('battle').classList.remove('hidden');
    $('b-name').textContent = title; $('b-img').src = img; $('b-q').textContent = ''; this.bopts.innerHTML = '';
    $('b-expl').textContent = ''; this.bnext.classList.add('hidden');
  }
  closeBattle() { $('battle').classList.add('hidden'); this.open.delete('battle'); this.lastClose = performance.now(); }
  battleHp(done, total) { $('b-hp').style.width = Math.round(100 - (done / total) * 100) + '%'; }
  battleHearts(n) {
    const h = $('b-hearts'); h.innerHTML = '';
    for (let i = 0; i < MAX_HEARTS; i++) { const im = el('img'); im.src = i < n ? this.sp.icons.heart : this.sp.icons.heartEmpty; h.appendChild(im); }
  }
  askQuiz(q) {
    return new Promise((res) => {
      $('b-q').textContent = q.q; this.bopts.innerHTML = ''; $('b-expl').textContent = ''; this.bnext.classList.add('hidden');
      const opts = shuffle(q.o.map((t, i) => ({ t, ok: i === q.a }))); let locked = false;
      opts.forEach((o, idx) => {
        const b = el('button', 'opt', String.fromCharCode(65 + idx) + '. ' + o.t);
        b.onclick = () => {
          if (locked) return; locked = true;
          [...this.bopts.children].forEach((bb, j) => { bb.disabled = true; if (opts[j].ok) bb.classList.add('ok'); });
          if (!o.ok) b.classList.add('bad');
          $('b-expl').textContent = (o.ok ? 'Benar! ' : 'Kurang tepat. ') + q.e;
          this.bnext.classList.remove('hidden'); this.audio.sfx(o.ok ? 'ok' : 'bad');
          this.bnext.onclick = () => res({ correct: o.ok });
        };
        this.bopts.appendChild(b);
      });
    });
  }

  // ---------- modal ----------
  modal(title, build) {
    return new Promise((res) => {
      this.open.add('modal'); $('m-title').textContent = title; const body = $('m-body'); body.innerHTML = ''; body.scrollTop = 0;
      const m = $('modal');
      const close = (v) => { m.classList.add('hidden'); this.open.delete('modal'); this.lastClose = performance.now(); res(v); };
      $('m-close').onclick = () => close(-1);
      build(body, close); m.classList.remove('hidden');
    });
  }
  menu(title, items) {
    return this.modal(title, (body, close) => {
      items.forEach((t, i) => { const b = el('button', 'btn', t); b.onclick = () => close(i); body.appendChild(b); });
    });
  }
  showCard(card) {
    return this.modal('Kartu Materi', (body, close) => {
      body.append(el('h3', 'm-h', card.title), el('p', 'card-text', card.body));
      const b = el('button', 'btn', 'Siap, lanjut'); b.onclick = () => close(0); body.appendChild(b);
    });
  }
  journal(state, chs) {
    return this.modal('Jurnal Materi', (body) => {
      body.append(el('p', 'm-note', 'Kartu terkumpul: ' + state.cards.length + '/' + chs.length * 3 + '. Ketuk kartu untuk membaca.'));
      chs.forEach((ch) => {
        const have = ch.cards.filter((c) => state.cards.includes(c.id)).length;
        body.append(el('h3', 'm-h', 'Bab ' + ch.no + ': ' + ch.title + ' (' + have + '/3)'));
        ch.cards.forEach((c) => {
          const own = state.cards.includes(c.id);
          const b = el('button', 'card-btn' + (own ? '' : ' lock'), own ? c.title : '🔒 Belum ditemukan');
          const d = el('div', 'card-body hidden', c.body);
          if (own) b.onclick = () => d.classList.toggle('hidden'); else b.disabled = true;
          body.append(b, d);
        });
      });
    });
  }
  quests(state, chs, objectives, activeNo) {
    return this.modal('Misi', (body) => {
      chs.forEach((ch) => {
        const done = !!state.flags[ch.id + '.guardian'];
        const status = done ? 'Selesai' : ch.no === activeNo ? 'Sedang berjalan' : 'Terkunci';
        body.append(el('h3', 'm-h', 'Bab ' + ch.no + ': ' + ch.title + ' (' + status + ')'));
        if (ch.no === activeNo) objectives(ch, state).forEach((o) => body.append(el('p', 'obj' + (o.done ? ' done' : ''), (o.done ? '☑ ' : '☐ ') + o.text)));
      });
    });
  }

  // ---------- judul & ending ----------
  title({ hasSave }) {
    return new Promise((res) => {
      this.open.add('title'); const t = $('title'); t.classList.remove('hidden');
      const looks = $('looks'); looks.innerHTML = ''; let sel = 0;
      for (let i = 0; i < 4; i++) {
        const c = document.createElement('canvas'); c.width = c.height = 64; c.className = 'look' + (i === 0 ? ' sel' : '');
        const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(this.sp.portrait('look' + i), 0, 0, 64, 64);
        c.onclick = () => { sel = i; [...looks.children].forEach((x, j) => x.classList.toggle('sel', j === i)); };
        looks.appendChild(c);
      }
      const bc = $('btn-cont'); bc.classList.toggle('hidden', !hasSave);
      const fin = (r) => { t.classList.add('hidden'); this.open.delete('title'); this.lastClose = performance.now(); res(r); };
      $('btn-new').onclick = () => fin({ mode: 'new', name: ($('in-name').value.trim() || 'Sasi'), look: sel });
      bc.onclick = () => fin({ mode: 'continue' });
    });
  }
  ending(stats) {
    return new Promise((res) => {
      this.open.add('ending'); const e = $('ending'); e.classList.remove('hidden');
      const total = stats.benar + stats.salah; const acc = total ? Math.round((stats.benar / total) * 100) : 0;
      const rank = acc >= 85 ? 'Sosiolog Ahli' : acc >= 65 ? 'Sosiolog Muda' : 'Pengamat Sosial';
      const box = $('end-stats'); box.innerHTML = '';
      [['Petualang', stats.nama], ['Gelar', rank], ['Poin', String(stats.poin)], ['Kartu Materi', stats.kartu + '/' + stats.totalKartu], ['Jawaban benar', stats.benar + ' dari ' + total + ' (' + acc + '%)']]
        .forEach(([k, v]) => { const r = el('div', 'row'); r.append(el('span', null, k), el('b', null, v)); box.appendChild(r); });
      const fin = (v) => { e.classList.add('hidden'); this.open.delete('ending'); this.lastClose = performance.now(); res(v); };
      $('end-cont').onclick = () => fin('continue'); $('end-title').onclick = () => fin('title');
    });
  }
}
