// Daftar misi tiap bab dihitung dari flag yang tersimpan di state.
export function objectives(ch, state) {
  const f = state.flags; const id = ch.id;
  const n = (f[id + '.hoax1'] ? 1 : 0) + (f[id + '.hoax2'] ? 1 : 0);
  return [
    { key: 'guide', text: 'Bicara dengan ' + ch.guide.name, done: !!f[id + '.guide'] },
    { key: 'chest', text: 'Temukan peti Kartu Materi', done: !!f[id + '.chest'] },
    { key: 'citizen', text: 'Bantu ' + ch.citizen.name, done: !!f[id + '.citizen'] },
    { key: 'hoax', text: 'Kalahkan 2 Hoaks (' + n + '/2)', done: n >= 2 },
    { key: 'guardian', text: 'Tantang ' + ch.guardian.name, done: !!f[id + '.guardian'] },
  ];
}
export function nextObjective(ch, state) {
  const o = objectives(ch, state).find((x) => !x.done);
  if (o) return o.text;
  return ch.no === 5 ? 'Semua misi selesai!' : 'Lanjut ke gerbang di sebelah timur';
}
export const chapterDone = (ch, state) => !!state.flags[ch.id + '.guardian'];
export function activeChapter(chapters, state) {
  return chapters.find((c) => !chapterDone(c, state)) || chapters[chapters.length - 1];
}
