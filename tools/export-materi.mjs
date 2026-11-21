// Membuat docs/MATERI.md dari data bab (berguna untuk laporan tugas).
import { writeFileSync } from 'node:fs';
import { CHAPTERS } from '../js/data/chapters.js';

let md = '# Ringkasan Materi Sosiologi dalam Game Misi Harmoni\n\nSemua materi ini muncul di dalam game sebagai Kartu Materi dan soal kuis.\n\n';
for (const ch of CHAPTERS) {
  md += `## Bab ${ch.no}: ${ch.title} (${ch.area})\n\n`;
  for (const c of ch.cards) md += `### ${c.title}\n\n${c.body}\n\n`;
  md += '### Soal latihan\n\n';
  ch.quiz.forEach((q, i) => { md += `${i + 1}. ${q.q}\n` + q.o.map((o, j) => `   - ${String.fromCharCode(65 + j)}. ${o}`).join('\n') + `\n   - Jawaban: ${String.fromCharCode(65 + q.a)}. ${q.e}\n\n`; });
}
writeFileSync(new URL('../docs/MATERI.md', import.meta.url), md);
console.log('docs/MATERI.md dibuat.');
