# Misi Harmoni

Game petualangan pixel art bergaya blok (terinspirasi tampilan Minecraft) dengan materi **Sosiologi SMA Kelas X**. Dibuat murni dengan HTML5 Canvas dan JavaScript modul, tanpa library dan tanpa build step. Semua gambar dibuat lewat kode.

## Cerita

Kristal Harmoni di Desa Sukamaju pecah menjadi lima keping karena hoaks dan prasangka. Kamu, murid baru, menjelajah lima wilayah, mempelajari sosiologi, dan mengalahkan Hoaks dengan ilmu untuk menyatukannya kembali.

| Bab | Wilayah | Materi |
|---|---|---|
| 1 | Desa Sukamaju | Interaksi sosial (syarat, bentuk asosiatif dan disosiatif) |
| 2 | Kampung Keluarga dan Sekolah | Sosialisasi (agen, tahap menurut Mead) |
| 3 | Pasar Raya | Kelompok sosial (primer/sekunder, paguyuban/patembayan, in-group/out-group) |
| 4 | Tambang Berlapis | Diferensiasi, stratifikasi, status, mobilitas sosial |
| 5 | Gua Api | Konflik, penyelesaian konflik, integrasi, multikulturalisme |

Ringkasan seluruh materi dan soal ada di [docs/MATERI.md](docs/MATERI.md), cocok dilampirkan di laporan tugas.

## Cara main

- Jalan: panah / WASD / D-pad layar. Bicara dan aksi: Spasi / Enter / tombol **A**. Menu: Esc.
- Tiap bab: bicara dengan pemandu, temukan peti, bantu warga (soal pilihan), kalahkan 2 Hoaks (kuis), lalu tantang Penjaga Gerbang (3 soal) untuk mendapat keping kristal.
- Jawaban salah mengurangi hati. Hati habis berarti pingsan dan kembali ke awal wilayah. Api unggun memulihkan hati dan menyimpan game.
- Kartu Materi yang terkumpul tersimpan di **Jurnal** dan bisa dibaca kapan saja.
- Progres tersimpan otomatis di browser (localStorage).

## Menjalankan di lokal

Modul ES tidak jalan lewat `file://`, jadi gunakan server lokal:

```bash
# Termux / Linux / macOS
python3 -m http.server 8080
# lalu buka http://localhost:8080
```

Di Termux: `pkg install python git` dulu.

## Push ke GitHub dari HP (Termux)

```bash
cd misi-harmoni
git init
git add .
git commit -m "Misi Harmoni: game petualangan sosiologi"
git branch -M main
git remote add origin https://github.com/USERNAME/misi-harmoni.git
git push -u origin main
```

Lalu aktifkan hosting gratis: **Settings → Pages → Source: GitHub Actions**. Workflow di `.github/workflows/pages.yml` akan memvalidasi data dan men-deploy otomatis setiap push ke `main`. Alternatif: Source **Deploy from a branch** → `main` → `/ (root)`.

## Struktur proyek

```
index.html            halaman utama
css/style.css         tampilan antarmuka
js/main.js            titik masuk
js/engine/            sprites (pixel art lewat kode), renderer, input, audio
js/game/              game (alur utama), world, ui, state/save, quests
js/data/              chapters (materi + soal), maps (peta), tiles, story
tools/validate.mjs    cek peta terhubung dan data bab valid
tools/export-materi.mjs  buat docs/MATERI.md dari data
```

## Menambah konten

- **Soal atau materi**: edit `js/data/chapters.js`. Format soal: `{ q, o: [4 pilihan], a: indeks benar, e: penjelasan }`.
- **Bab baru**: tambah objek di `CHAPTERS`, buat fungsi peta di `js/data/maps.js`, lalu tambahkan nama peta ke `MAP_ORDER` di `js/game/constants.js`.
- **Tile atau karakter baru**: `js/data/tiles.js` dan `js/engine/sprites.js`.
- Setelah mengubah data jalankan `node tools/validate.mjs`.

## Lisensi

MIT. Terinspirasi gaya visual blok; seluruh aset dibuat ulang dan tidak memakai aset resmi Minecraft.
