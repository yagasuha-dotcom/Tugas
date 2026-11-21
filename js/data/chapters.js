// Seluruh materi sosiologi, dialog, dan soal ada di sini.
// Mau menambah bab? Tambah satu objek di CHAPTERS + satu peta di maps.js + nama peta di MAP_ORDER (constants.js).
// Format soal: { q: pertanyaan, o: [4 pilihan], a: indeks jawaban benar, e: penjelasan }

export const CHAPTERS = [
  {
    id: 'ch1', no: 1, map: 'desa', title: 'Interaksi Sosial', area: 'Desa Sukamaju',
    intro: ['Bab 1: Interaksi Sosial', 'Desa Sukamaju terasa sepi. Sejak Kristal Harmoni pecah, warga jarang bertegur sapa. Cari tahu apa yang hilang dari hubungan mereka.'],
    cards: [
      { id: 'ch1c1', title: 'Pengertian Interaksi Sosial', body: 'Interaksi sosial adalah hubungan timbal balik antara individu dengan individu, individu dengan kelompok, atau kelompok dengan kelompok, yang saling memengaruhi. Tanpa interaksi sosial tidak ada kehidupan bersama.' },
      { id: 'ch1c2', title: 'Syarat: Kontak dan Komunikasi', body: 'Interaksi sosial terjadi jika ada (1) kontak sosial: hubungan antarpihak, bisa langsung (tatap muka) atau tidak langsung (lewat telepon, surat, perantara), bisa positif atau negatif; dan (2) komunikasi: penyampaian pesan yang kemudian ditafsirkan penerimanya.' },
      { id: 'ch1c3', title: 'Bentuk-Bentuk Interaksi', body: 'Asosiatif (menyatukan): kerja sama, akomodasi, asimilasi, akulturasi. Disosiatif (memecah): persaingan, kontravensi, pertentangan atau konflik. Akulturasi: budaya asing diterima tanpa menghilangkan ciri budaya asal. Asimilasi: budaya melebur sehingga ciri aslinya hilang.' },
    ],
    guide: {
      name: 'Pak Lurah Budi', pal: 'elder',
      lines: [
        'Selamat datang, {nama}! Aku Pak Lurah Budi. Desa kami sedang dalam masalah besar.',
        'Kristal Harmoni pecah jadi lima keping karena hoaks dan prasangka. Kamu harus menjelajah lima wilayah untuk menemukannya.',
        'Kita mulai dari INTERAKSI SOSIAL, yaitu hubungan timbal balik yang saling memengaruhi. Warga di sini lupa caranya.',
        'Ini Kartu Materi pertamamu. Lalu temukan peti kartu, bantu warga, kalahkan dua Hoaks, dan tantang Penjaga Gerbang di timur.',
      ],
      again: ['Ingat, {nama}: interaksi sosial itu hubungan timbal balik yang saling memengaruhi.'],
    },
    chest: ['Peti tua di balik semak! Di dalamnya ada selembar Kartu Materi.'],
    citizen: {
      name: 'Bu Sari', pal: 'ibu',
      intro: ['Halo, {nama}. Kemarin warga bekerja bakti membersihkan selokan bersama-sama, dan aku jadi bertanya-tanya.'],
      task: {
        prompt: 'Bekerja bakti bersama untuk kepentingan warga termasuk bentuk interaksi sosial apa?',
        options: ['Kerja sama (asosiatif)', 'Persaingan (disosiatif)', 'Kontravensi (disosiatif)', 'Pertentangan (disosiatif)'], answer: 0,
        explain: 'Tepat! Kerja sama adalah usaha bersama demi tujuan bersama, dan termasuk interaksi asosiatif.',
      },
      fail: 'Hmm, coba pikirkan lagi. Apakah bekerja bakti menyatukan atau memecah warga?',
      win: ['Terima kasih! Ambillah Kartu Materi ini sebagai tanda terima kasih.'],
      done: ['Berkat kerja bakti itu desa kembali bersih. Semangat, {nama}!'],
    },
    talker: {
      name: 'Pak Joko', pal: 'pak',
      lines: [
        'Kemarin Dika menelepon neneknya di kota. Itu kontak sosial tidak langsung, karena lewat alat perantara.',
        'Kalau bertemu tatap muka seperti kita sekarang, itu kontak sosial langsung. Dan kalau dua-duanya saling mengerti pesannya, barulah komunikasi berjalan.',
      ],
    },
    sign: ['Papan Info: Interaksi sosial butuh KONTAK dan KOMUNIKASI. Salah satunya hilang, hubungan pun putus.'],
    hoax: { name: 'Hoaks Kabar Burung', kind: 'slime', color: '#5cd65c' },
    guardian: {
      name: 'Ksatria Gerbang Timur', pal: 'guard',
      locked: 'Gerbang ini dijaga ketat. Kamu belum siap menghadapiku.',
      intro: ['Aku Ksatria Gerbang Timur. Buktikan kamu paham interaksi sosial, jawab tiga pertanyaanku!'],
      win: ['Hebat! Kamu layak membawa keping kristal pertama. Gerbang timur kini terbuka.'],
    },
    shard: 'Keping Kristal Interaksi',
    quiz: [
      { q: 'Hubungan timbal balik yang saling memengaruhi antarindividu atau kelompok disebut…', o: ['Interaksi sosial', 'Mobilitas sosial', 'Stratifikasi sosial', 'Diferensiasi sosial'], a: 0, e: 'Itulah pengertian interaksi sosial: hubungan dinamis yang saling memengaruhi.' },
      { q: 'Dua syarat terjadinya interaksi sosial adalah…', o: ['Kontak sosial dan komunikasi', 'Kekuasaan dan kekayaan', 'Norma dan nilai', 'Status dan peran'], a: 0, e: 'Interaksi sosial hanya terjadi jika ada kontak sosial dan komunikasi.' },
      { q: 'Budi menelepon neneknya yang tinggal di luar kota. Kontak sosial ini termasuk…', o: ['Kontak langsung', 'Kontak tidak langsung', 'Kontak negatif', 'Bukan kontak sosial'], a: 1, e: 'Kontak lewat perantara (telepon, surat, media) disebut kontak sosial tidak langsung.' },
      { q: 'Contoh bentuk interaksi sosial asosiatif adalah…', o: ['Persaingan', 'Kontravensi', 'Kerja bakti membersihkan desa', 'Pertikaian antarkelompok'], a: 2, e: 'Kerja sama termasuk asosiatif karena menyatukan. Tiga lainnya bersifat disosiatif.' },
      { q: 'Dua kelompok pedagang saling berlomba menawarkan harga termurah. Ini bentuk…', o: ['Kerja sama', 'Akomodasi', 'Persaingan', 'Asimilasi'], a: 2, e: 'Persaingan adalah perlombaan meraih tujuan yang sama, dan termasuk interaksi disosiatif.' },
      { q: 'Pihak yang bertikai sepakat berdamai lewat penengah sehingga ketegangan mereda. Ini disebut…', o: ['Akomodasi', 'Kontravensi', 'Persaingan', 'Konflik terbuka'], a: 0, e: 'Akomodasi adalah upaya meredakan pertentangan agar tercapai keseimbangan.' },
      { q: 'Dua budaya berpadu, tetapi ciri khas budaya asal masih terlihat. Proses ini disebut…', o: ['Asimilasi', 'Akulturasi', 'Kontravensi', 'Disintegrasi'], a: 1, e: 'Akulturasi: budaya asing diterima tanpa menghilangkan ciri budaya asal. Asimilasi: melebur sepenuhnya.' },
    ],
  },
  {
    id: 'ch2', no: 2, map: 'kampung', title: 'Sosialisasi', area: 'Kampung Keluarga dan Sekolah',
    intro: ['Bab 2: Sosialisasi', 'Di kampung ini, anak-anak mulai lupa nilai dan aturan. Siapa yang bertugas menanamkannya?'],
    cards: [
      { id: 'ch2c1', title: 'Pengertian Sosialisasi', body: 'Sosialisasi adalah proses belajar seseorang untuk memahami dan menerima nilai, norma, dan peran sosial agar dapat hidup sebagai anggota masyarakat. Sosialisasi primer terjadi di keluarga pada masa kanak-kanak. Sosialisasi sekunder terjadi di sekolah, tempat kerja, dan masyarakat luas.' },
      { id: 'ch2c2', title: 'Agen Sosialisasi', body: 'Keluarga: agen pertama dan utama. Teman sebaya: hubungan setara, belajar kebersamaan dan kerja sama. Sekolah: menanamkan disiplin, pengetahuan, dan nilai formal. Media massa: memengaruhi opini, selera, dan gaya hidup. Lingkungan kerja dan agama juga berperan.' },
      { id: 'ch2c3', title: 'Tahap Sosialisasi (G.H. Mead)', body: 'Tahap persiapan (preparatory): anak meniru orang di sekitarnya tanpa paham maknanya. Tahap meniru (play stage): anak memerankan orang tertentu di sekitarnya. Tahap siap bertindak (game stage): anak memahami peran banyak orang sekaligus. Penerimaan norma kolektif (generalized other): memahami aturan masyarakat luas.' },
    ],
    guide: {
      name: 'Bu Rina (Guru)', pal: 'guru',
      lines: [
        'Selamat datang di Kampung Keluarga dan Sekolah, {nama}! Aku Bu Rina.',
        'Anak-anak di sini mulai lupa sopan santun dan aturan. Mereka butuh SOSIALISASI.',
        'Sosialisasi adalah proses belajar nilai, norma, dan peran agar bisa hidup bermasyarakat. Di keluarga disebut primer, di sekolah dan tempat kerja disebut sekunder.',
        'Ini Kartu Materi pertama. Selesaikan misi di kampung ini, lalu hadapi Kepala Sekolah di timur.',
      ],
      again: ['Ingat, {nama}: sosialisasi itu proses belajar nilai dan norma agar bisa hidup bermasyarakat.'],
    },
    chest: ['Peti di taman bermain! Isinya Kartu Materi yang tertinggal dari pelajaran kemarin.'],
    citizen: {
      name: 'Rani (siswa)', pal: 'anak',
      intro: ['Kak, aku belajar disiplin, hormat pada guru, dan jujur lewat aturan di kelas. Aku penasaran, itu dari agen sosialisasi yang mana ya?'],
      task: {
        prompt: 'Rani belajar disiplin dan nilai kejujuran lewat aturan di kelas. Agen sosialisasinya adalah…',
        options: ['Keluarga', 'Teman sebaya', 'Sekolah', 'Media massa'], answer: 2,
        explain: 'Benar! Sekolah menanamkan disiplin, pengetahuan, dan nilai-nilai formal.',
      },
      fail: 'Kurang tepat. Di mana Rani mengikuti aturan kelas?',
      win: ['Wah, pintar! Ini Kartu Materi untukmu.'],
      done: ['Sekarang aku makin rajin ke sekolah. Terima kasih, Kak!'],
    },
    talker: {
      name: 'Kak Dimas', pal: 'pemuda',
      lines: [
        'Aku belajar gaya bicara dan berpakaian dari teman sebaya. Hubungannya setara, jadi aku nyaman belajar kebersamaan.',
        'Tapi hati-hati dengan media massa. Ia bisa membentuk selera dan gaya hidup, bahkan menyebarkan hoaks.',
      ],
    },
    sign: ['Papan Info: Keluarga adalah agen sosialisasi PERTAMA dan UTAMA.'],
    hoax: { name: 'Si Salah Ikut', kind: 'slime', color: '#5cb0f0' },
    guardian: {
      name: 'Kepala Sekolah Pak Darmo', pal: 'kepsek',
      locked: 'Selesaikan dulu urusanmu di kampung ini sebelum menemuiku.',
      intro: ['Aku Pak Darmo, kepala sekolah. Jawab tiga pertanyaan tentang sosialisasi dengan benar!'],
      win: ['Luar biasa! Keping kristal kedua jadi milikmu. Jalan menuju pasar sudah terbuka.'],
    },
    shard: 'Keping Kristal Sosialisasi',
    quiz: [
      { q: 'Proses belajar nilai dan norma agar menjadi anggota masyarakat disebut…', o: ['Mobilitas', 'Sosialisasi', 'Stratifikasi', 'Konflik'], a: 1, e: 'Sosialisasi adalah proses belajar menjadi anggota masyarakat.' },
      { q: 'Agen sosialisasi pertama dan utama bagi seorang anak adalah…', o: ['Sekolah', 'Media massa', 'Keluarga', 'Teman sebaya'], a: 2, e: 'Anak pertama kali belajar nilai dan norma di dalam keluarga.' },
      { q: 'Anak bermain dokter-dokteran dan meniru peran dokter tertentu. Menurut Mead ini tahap…', o: ['Persiapan', 'Meniru (play stage)', 'Siap bertindak (game stage)', 'Generalized other'], a: 1, e: 'Pada tahap meniru, anak memerankan orang tertentu di sekitarnya (significant others).' },
      { q: 'Remaja meniru gaya berpakaian artis dari tayangan di media sosial. Agen sosialisasinya adalah…', o: ['Keluarga', 'Sekolah', 'Media massa', 'Lingkungan kerja'], a: 2, e: 'Media massa memengaruhi selera, opini, dan gaya hidup.' },
      { q: 'Contoh sosialisasi sekunder adalah…', o: ['Bayi belajar tersenyum pada ibunya', 'Karyawan baru mempelajari budaya perusahaan', 'Balita belajar makan sendiri', 'Anak belajar berbicara di rumah'], a: 1, e: 'Sosialisasi sekunder terjadi di luar keluarga, misalnya sekolah dan tempat kerja.' },
      { q: 'Ciri khas teman sebaya sebagai agen sosialisasi adalah…', o: ['Hubungan bertingkat', 'Hubungan setara dan akrab', 'Berdasarkan hukum tertulis', 'Berlangsung formal'], a: 1, e: 'Teman sebaya sederajat sehingga anak belajar kebersamaan dan kerja sama.' },
      { q: 'Seorang remaja paham bahwa setiap orang punya peran dan harus menaati aturan masyarakat luas. Ini tahap…', o: ['Persiapan', 'Meniru', 'Penerimaan norma kolektif (generalized other)', 'Disintegrasi'], a: 2, e: 'Pada tahap generalized other, seseorang menerima norma masyarakat yang lebih luas.' },
    ],
  },
  {
    id: 'ch3', no: 3, map: 'pasar', title: 'Kelompok Sosial', area: 'Pasar Raya',
    intro: ['Bab 3: Kelompok Sosial', 'Pasar Raya ramai, tetapi pedagang dan pembeli saling curiga. Mereka lupa siapa yang termasuk kelompok kita.'],
    cards: [
      { id: 'ch3c1', title: 'Syarat Kelompok Sosial', body: 'Kelompok sosial adalah kumpulan individu yang saling berinteraksi. Syaratnya: ada kesadaran sebagai bagian dari kelompok, ada hubungan timbal balik antaranggota, ada faktor pengikat (kepentingan, nasib, ideologi), serta ada struktur, norma, dan pola perilaku. Kerumunan penonton bukan kelompok sosial.' },
      { id: 'ch3c2', title: 'Primer, Sekunder, Paguyuban, Patembayan', body: 'Kelompok primer (Cooley): erat, personal, tatap muka, misalnya keluarga dan sahabat. Kelompok sekunder: besar, formal, impersonal, misalnya organisasi dan perusahaan. Tonnies: paguyuban (gemeinschaft) berdasar ikatan batin dan kekeluargaan; patembayan (gesellschaft) berdasar ikatan lahir dan untung rugi.' },
      { id: 'ch3c3', title: 'In-group, Out-group, Formal, Informal', body: 'Sumner: in-group adalah kelompok dalam, yaitu kita merasa menjadi bagian dari "kami". Out-group adalah kelompok luar, yaitu "mereka". Anggapan bahwa kelompok sendiri paling unggul disebut etnosentrisme. Kelompok formal punya aturan tertulis (OSIS, koperasi); kelompok informal tidak (kelompok teman bermain).' },
    ],
    guide: {
      name: 'Bu Tini (Pedagang)', pal: 'ibu',
      lines: [
        'Selamat datang di Pasar Raya, {nama}! Aku Bu Tini.',
        'Pasar ini ramai, tapi pedagang dan pembeli mulai saling curiga. Mereka lupa bahwa manusia hidup dalam KELOMPOK SOSIAL.',
        'Kelompok sosial itu kumpulan orang yang saling berinteraksi, sadar jadi anggota, dan punya faktor pengikat. Penonton konser bukan kelompok sosial, lho.',
        'Ini Kartu Materi pertama. Kerjakan misi di pasar, lalu tantang Juragan Hartono di timur.',
      ],
      again: ['Ingat, {nama}: kelompok sosial ada kesadaran anggota, hubungan timbal balik, dan faktor pengikat.'],
    },
    chest: ['Peti di pojok pasar! Ada Kartu Materi terselip di antara kain dagangan.'],
    citizen: {
      name: 'Pak Hasan', pal: 'pak',
      intro: ['Nak, aku membeli sayur di kios kota. Aku dan penjualnya cuma bertemu untuk transaksi, tidak saling kenal.'],
      task: {
        prompt: 'Hubungan penjual dan pembeli yang hanya berdasar untung rugi dan kontrak mencerminkan…',
        options: ['Paguyuban (gemeinschaft)', 'Patembayan (gesellschaft)', 'Kelompok primer', 'Kelompok keluarga'], answer: 1,
        explain: 'Benar! Patembayan adalah ikatan lahir yang bersifat pamrih dan untung rugi, biasa terjadi di kota.',
      },
      fail: 'Belum tepat. Ikatan batin kekeluargaan itu paguyuban. Jadi yang berdasar untung rugi itu apa?',
      win: ['Betul sekali! Terimalah Kartu Materi ini.'],
      done: ['Sekarang aku lebih paham mengapa hubungan di kota terasa kaku. Terima kasih!'],
    },
    talker: {
      name: 'Mas Eko', pal: 'pemuda',
      lines: [
        'Aku anggota OSIS dan juga punya geng main bola. OSIS punya aturan tertulis, itu kelompok formal. Geng bolaku tidak, itu informal.',
        'Hati-hati ya. Kalau merasa kelompok sendiri paling hebat dan merendahkan kelompok lain, itu etnosentrisme.',
      ],
    },
    sign: ['Papan Info: Keluarga dan sahabat = kelompok PRIMER. Perusahaan dan organisasi besar = kelompok SEKUNDER.'],
    hoax: { name: 'Si Prasangka Pasar', kind: 'slime', color: '#f0b040' },
    guardian: {
      name: 'Juragan Hartono', pal: 'pedagang',
      locked: 'Juragan sibuk. Selesaikan dulu urusanmu di pasar ini.',
      intro: ['Aku Juragan Hartono, ketua pedagang. Jawab tiga pertanyaan tentang kelompok sosial!'],
      win: ['Pintar! Keping kristal ketiga jadi milikmu. Jalan menuju tambang sudah terbuka.'],
    },
    shard: 'Keping Kristal Kelompok',
    quiz: [
      { q: 'Salah satu syarat kelompok sosial adalah…', o: ['Ada kesadaran menjadi anggota kelompok', 'Anggotanya harus sama usia', 'Harus memiliki gedung sendiri', 'Hanya terdiri dari keluarga'], a: 0, e: 'Anggota harus sadar bahwa mereka bagian dari kelompok.' },
      { q: 'Penonton konser bukan kelompok sosial karena…', o: ['Jumlahnya terlalu banyak', 'Tidak ada hubungan timbal balik dan struktur yang jelas', 'Mereka tidak membeli tiket', 'Mereka tidak bernyanyi'], a: 1, e: 'Kerumunan tidak punya struktur, norma, dan hubungan timbal balik yang terorganisasi.' },
      { q: 'Contoh kelompok primer adalah…', o: ['Perusahaan multinasional', 'Partai politik', 'Keluarga inti', 'Organisasi profesi'], a: 2, e: 'Kelompok primer bersifat erat, personal, dan tatap muka, seperti keluarga.' },
      { q: 'Ciri kelompok sekunder adalah…', o: ['Hubungan formal dan impersonal', 'Ikatan batin kuat', 'Anggotanya sedikit', 'Selalu bertatap muka'], a: 0, e: 'Kelompok sekunder bersifat besar, formal, dan impersonal.' },
      { q: 'Menurut Tonnies, paguyuban (gemeinschaft) ditandai oleh…', o: ['Hubungan untung rugi', 'Kontrak tertulis', 'Ikatan batin dan kekeluargaan', 'Persaingan ketat'], a: 2, e: 'Paguyuban bertumpu pada ikatan batin yang murni dan alamiah, seperti keluarga dan desa.' },
      { q: 'Menganggap kelompok sendiri paling unggul dan merendahkan kelompok lain disebut…', o: ['Toleransi', 'Etnosentrisme', 'Asimilasi', 'Akulturasi'], a: 1, e: 'Etnosentrisme adalah sikap menilai kelompok lain dengan ukuran kelompok sendiri.' },
      { q: 'OSIS yang memiliki AD/ART tertulis termasuk kelompok…', o: ['Informal', 'Paguyuban', 'Formal', 'Kerumunan'], a: 2, e: 'Kelompok formal memiliki aturan dan struktur yang tertulis.' },
    ],
  },
  {
    id: 'ch4', no: 4, map: 'tambang', title: 'Diferensiasi dan Stratifikasi', area: 'Tambang Berlapis',
    intro: ['Bab 4: Diferensiasi dan Stratifikasi', 'Tambang ini berlapis-lapis seperti masyarakat. Ada yang di lapisan atas, ada yang di bawah. Pelajari mengapa dan bagaimana orang bisa berpindah lapisan.'],
    cards: [
      { id: 'ch4c1', title: 'Diferensiasi vs Stratifikasi', body: 'Diferensiasi sosial adalah pembedaan masyarakat secara horizontal tanpa tingkatan, misalnya berdasarkan suku, ras, agama, profesi, dan jenis kelamin. Stratifikasi sosial adalah pembedaan vertikal, berlapis, ada yang lebih tinggi dan lebih rendah, berdasarkan kekayaan, kekuasaan, kehormatan, atau ilmu pengetahuan.' },
      { id: 'ch4c2', title: 'Sifat Stratifikasi dan Status', body: 'Stratifikasi tertutup: sulit berpindah lapisan (contoh: sistem kasta). Stratifikasi terbuka: mudah berpindah lewat usaha. Status ascribed diperoleh sejak lahir (gelar bangsawan). Status achieved diraih lewat usaha (dokter, insinyur). Status assigned diberikan karena jasa.' },
      { id: 'ch4c3', title: 'Mobilitas Sosial', body: 'Mobilitas sosial adalah perpindahan posisi sosial. Vertikal naik (social climbing): buruh menjadi pengusaha. Vertikal turun (social sinking): pengusaha bangkrut. Horizontal: pindah posisi tanpa mengubah derajat, misalnya pindah kerja dengan jabatan setara. Pendorong: pendidikan, keterampilan. Penghambat: diskriminasi, kemiskinan.' },
    ],
    guide: {
      name: 'Pak Mandor Joko', pal: 'penambang',
      lines: [
        'Selamat datang di Tambang Berlapis, {nama}! Aku Pak Mandor Joko.',
        'Lihat tambang ini: ada lapisan atas, tengah, dan bawah. Masyarakat juga begitu. Itu disebut STRATIFIKASI SOSIAL.',
        'Bedakan dengan DIFERENSIASI sosial: perbedaan horizontal tanpa tingkatan, seperti suku, agama, dan profesi.',
        'Ini Kartu Materi pertama. Selesaikan misi di tambang ini, lalu tantang Mandor Baja di ujung timur.',
      ],
      again: ['Ingat, {nama}: diferensiasi itu horizontal, stratifikasi itu vertikal bertingkat.'],
    },
    chest: ['Peti di lorong atas! Berisi Kartu Materi yang berdebu.'],
    citizen: {
      name: 'Dedi (penambang)', pal: 'pak',
      intro: ['Dulu aku buruh tambang biasa. Aku kuliah malam dengan susah payah dan sekarang bekerja sebagai insinyur tambang.'],
      task: {
        prompt: 'Dedi naik dari buruh tambang menjadi insinyur tambang. Ini contoh mobilitas sosial…',
        options: ['Vertikal naik', 'Vertikal turun', 'Horizontal', 'Tidak ada mobilitas'], answer: 0,
        explain: 'Benar! Berpindah ke posisi lebih tinggi lewat usaha (pendidikan) disebut mobilitas vertikal naik.',
      },
      fail: 'Belum tepat. Posisi Dedi sekarang lebih tinggi atau lebih rendah dari dulu?',
      win: ['Betul! Terimalah Kartu Materi ini.'],
      done: ['Pendidikan memang jalan naik tangga sosial. Semangat, {nama}!'],
    },
    talker: {
      name: 'Bu Warti (Warung)', pal: 'ibu',
      lines: [
        'Di tambang ini ada yang punya kekayaan, kekuasaan, dan kehormatan. Itu dasar pelapisan masyarakat.',
        'Kalau status didapat sejak lahir, misalnya gelar bangsawan, itu ascribed. Kalau diraih lewat usaha, seperti jadi dokter, itu achieved.',
      ],
    },
    sign: ['Papan Info: Sistem kasta termasuk stratifikasi TERTUTUP. Pendidikan dan usaha membuka stratifikasi TERBUKA.'],
    hoax: { name: 'Si Gengsi Palsu', kind: 'slime', color: '#b0b0c8' },
    guardian: {
      name: 'Mandor Baja', pal: 'guard',
      locked: 'Gerbang bawah tanah ini belum bisa kau lewati. Selesaikan dulu pekerjaanmu.',
      intro: ['Aku Mandor Baja. Hanya yang paham lapisan masyarakat yang boleh lewat. Jawab tiga pertanyaanku!'],
      win: ['Mantap! Keping kristal keempat jadi milikmu. Jalan menuju Gua Api sudah terbuka.'],
    },
    shard: 'Keping Kristal Stratifikasi',
    quiz: [
      { q: 'Pembedaan masyarakat secara horizontal tanpa tingkatan disebut…', o: ['Stratifikasi sosial', 'Diferensiasi sosial', 'Mobilitas sosial', 'Integrasi sosial'], a: 1, e: 'Diferensiasi sosial membedakan tanpa menyatakan yang satu lebih tinggi dari yang lain.' },
      { q: 'Perbedaan agama dan suku termasuk…', o: ['Stratifikasi sosial', 'Diferensiasi sosial', 'Konflik sosial', 'Mobilitas sosial'], a: 1, e: 'Suku, ras, agama, profesi, dan jenis kelamin adalah dasar diferensiasi sosial.' },
      { q: 'Berikut yang BUKAN dasar pelapisan (stratifikasi) sosial adalah…', o: ['Kekayaan', 'Kekuasaan', 'Ilmu pengetahuan', 'Warna kesukaan'], a: 3, e: 'Dasar stratifikasi: kekayaan, kekuasaan, kehormatan, dan ilmu pengetahuan.' },
      { q: 'Sistem kasta termasuk stratifikasi sosial yang bersifat…', o: ['Terbuka', 'Tertutup', 'Campuran', 'Horizontal'], a: 1, e: 'Pada sistem kasta, perpindahan lapisan hampir tidak mungkin, sehingga tertutup.' },
      { q: 'Status yang diraih seseorang lewat usaha sendiri disebut…', o: ['Ascribed status', 'Achieved status', 'Assigned status', 'Natural status'], a: 1, e: 'Achieved status diperoleh karena usaha, misalnya menjadi dokter.' },
      { q: 'Seorang pengusaha bangkrut dan menjadi karyawan biasa. Ini mobilitas…', o: ['Vertikal naik', 'Horizontal', 'Vertikal turun', 'Antargenerasi naik'], a: 2, e: 'Turun ke posisi yang lebih rendah disebut mobilitas vertikal turun (social sinking).' },
      { q: 'Seorang guru dipindahtugaskan ke sekolah lain dengan jabatan yang sama. Ini mobilitas…', o: ['Horizontal', 'Vertikal naik', 'Vertikal turun', 'Tertutup'], a: 0, e: 'Berpindah tanpa mengubah derajat sosial disebut mobilitas horizontal.' },
    ],
  },
  {
    id: 'ch5', no: 5, map: 'gua', title: 'Konflik dan Integrasi', area: 'Gua Api',
    intro: ['Bab 5: Konflik dan Integrasi', 'Gua Api, sumber prasangka dan pertikaian. Di sinilah Raja Prasangka menyimpan keping kristal terakhir.'],
    cards: [
      { id: 'ch5c1', title: 'Konflik Sosial', body: 'Konflik adalah proses sosial ketika pihak-pihak berusaha menyingkirkan lawannya. Penyebab: perbedaan individu, perbedaan budaya, perbedaan kepentingan, dan perubahan sosial yang cepat. Dampak positif: solidaritas kelompok menguat, mendorong perubahan. Dampak negatif: perpecahan, kerugian, trauma.' },
      { id: 'ch5c2', title: 'Penyelesaian Konflik', body: 'Konsiliasi: mempertemukan pihak bertikai agar mencapai kesepakatan. Mediasi: pihak ketiga netral hanya memberi saran, keputusan tetap di tangan pihak bertikai. Arbitrasi: pihak ketiga memberi keputusan yang mengikat. Koersi: penyelesaian dengan paksaan. Detente: meredakan ketegangan.' },
      { id: 'ch5c3', title: 'Integrasi dan Multikulturalisme', body: 'Integrasi sosial adalah penyatuan unsur-unsur yang berbeda menjadi masyarakat yang utuh. Jenisnya: normatif (nilai bersama, misalnya Pancasila), fungsional (saling bergantung), koersif (lewat kekuasaan). Multikulturalisme adalah pengakuan dan penghargaan atas keberagaman. Semboyan: Bhinneka Tunggal Ika. Kuncinya: toleransi, empati, dialog.' },
    ],
    guide: {
      name: 'Mbah Wiro (Tetua Adat)', pal: 'elder',
      lines: [
        'Akhirnya kau sampai, {nama}. Aku Mbah Wiro, tetua adat desa.',
        'Di Gua Api inilah Raja Prasangka bersemayam. Ia hidup dari KONFLIK SOSIAL: pertikaian yang muncul karena perbedaan kepentingan, budaya, dan individu.',
        'Tapi konflik bisa diredakan, dan masyarakat bisa dipersatukan lewat INTEGRASI SOSIAL dan MULTIKULTURALISME.',
        'Ini Kartu Materi pertama. Selesaikan misi di sini, lalu hadapi Raja Prasangka di ujung gua.',
      ],
      again: ['Ingat, {nama}: konflik bisa diselesaikan, dan perbedaan bisa dipersatukan lewat toleransi.'],
    },
    chest: ['Peti di ruang batu! Di dalamnya ada Kartu Materi yang masih hangat.'],
    citizen: {
      name: 'Pak RT Slamet', pal: 'pak',
      intro: ['Dua pemuda bertengkar soal batas tanah. Aku hanya memberi saran, keputusan kuserahkan kepada mereka.'],
      task: {
        prompt: 'Pihak ketiga netral hanya memberi saran dan keputusan tetap di tangan yang bertikai. Ini disebut…',
        options: ['Arbitrasi', 'Mediasi', 'Koersi', 'Detente'], answer: 1,
        explain: 'Tepat! Mediasi: penengah netral hanya menyarankan. Arbitrasi: keputusan penengah mengikat.',
      },
      fail: 'Belum tepat. Kalau keputusan penengah mengikat itu arbitrasi. Yang hanya memberi saran apa?',
      win: ['Betul! Ini Kartu Materi untukmu.'],
      done: ['Dua pemuda itu sudah berdamai. Terima kasih, {nama}!'],
    },
    talker: {
      name: 'Maya (Jurnalis)', pal: 'pemuda',
      lines: [
        'Konflik tidak selalu buruk. Kalau dikelola baik, ia bisa menguatkan solidaritas kelompok dan memicu perubahan ke arah lebih baik.',
        'Indonesia sangat beragam. Bhinneka Tunggal Ika berarti berbeda-beda tetapi tetap satu. Itulah semangat multikulturalisme.',
      ],
    },
    sign: ['Papan Info: Mediasi = penengah hanya MENYARANKAN. Arbitrasi = keputusan penengah MENGIKAT.'],
    hoax: { name: 'Hantu Provokasi', kind: 'ghost', color: '#ffffff' },
    guardian: {
      name: 'Raja Prasangka', pal: 'boss',
      locked: 'Hahaha! Kamu belum cukup tahu untuk menghadapiku!',
      intro: ['GRAAAH! Akulah Raja Prasangka. Aku hidup dari curiga dan pertikaian. Kalahkan aku dengan ilmumu, kalau bisa!'],
      win: ['Tidak... pengetahuan dan toleransi... mengalahkanku... Kristal itu... milikmu...'],
    },
    shard: 'Keping Kristal Integrasi',
    quiz: [
      { q: 'Salah satu penyebab konflik sosial adalah…', o: ['Perbedaan kepentingan', 'Cuaca yang cerah', 'Jumlah penduduk genap', 'Letak geografis saja'], a: 0, e: 'Perbedaan individu, budaya, dan kepentingan adalah penyebab umum konflik.' },
      { q: 'Berikut contoh dampak positif konflik, yaitu…', o: ['Kerugian harta benda', 'Solidaritas kelompok menguat', 'Trauma berkepanjangan', 'Keretakan hubungan'], a: 1, e: 'Konflik dengan pihak luar sering memperkuat solidaritas dalam kelompok.' },
      { q: 'Pihak ketiga netral memberi keputusan yang mengikat kedua pihak bertikai. Ini disebut…', o: ['Mediasi', 'Konsiliasi', 'Arbitrasi', 'Toleransi'], a: 2, e: 'Arbitrasi: keputusan pihak ketiga wajib ditaati.' },
      { q: 'Pihak ketiga netral hanya memberi saran, dan pihak bertikai bebas memutuskan. Ini…', o: ['Arbitrasi', 'Koersi', 'Mediasi', 'Disintegrasi'], a: 2, e: 'Mediasi bersifat memberi saran, bukan memutuskan.' },
      { q: 'Penyatuan unsur-unsur berbeda menjadi masyarakat yang utuh disebut…', o: ['Diferensiasi', 'Integrasi sosial', 'Stratifikasi', 'Mobilitas'], a: 1, e: 'Integrasi sosial menyatukan unsur berbeda menjadi satu kesatuan.' },
      { q: 'Pengakuan dan penghargaan atas keberagaman budaya disebut…', o: ['Etnosentrisme', 'Multikulturalisme', 'Diskriminasi', 'Segregasi'], a: 1, e: 'Multikulturalisme menghargai perbedaan budaya dalam satu masyarakat.' },
      { q: 'Sikap menghargai perbedaan sehingga persatuan terjaga, sesuai semboyan Bhinneka Tunggal Ika, adalah…', o: ['Toleransi', 'Prasangka', 'Etnosentrisme', 'Stereotip'], a: 0, e: 'Toleransi adalah kunci menjaga persatuan dalam keberagaman.' },
    ],
  },
];

export const chapterByMap = (map) => CHAPTERS.find((c) => c.map === map);
export const chapterById = (id) => CHAPTERS.find((c) => c.id === id);
