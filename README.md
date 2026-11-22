# LiterasiGizi App

Aplikasi mobile LiterasiGizi untuk Tugas Besar II3160 Teknologi Sistem Terintegrasi dan
II3140 Pengembangan Aplikasi Web dan Mobile, Kelompok Aiko. Aplikasi ini membantu anak
SD belajar gizi seimbang lewat jalur belajar bertahap, kuis adaptif, poin, lencana, dan
misi harian, dengan akun yang dikelola orang tua.

Dibangun dengan React Native (Expo SDK 58) dan Expo Router. Tampilan dibuat ramah anak:
font Fredoka, warna pastel, maskot Jeru si Jeruk dan stiker makanan per topik (digambar
sendiri dengan `react-native-svg`), serta jalur belajar berbentuk peta. Data diambil dari microservice
LiterasiGizi di STB: `https://aiko.stei.site/api` (repo backend:
<https://github.com/jackoluciano/aiko>).

## Menjalankan aplikasi

Prasyarat: Node.js 20 atau lebih baru, dan aplikasi **Expo Go** versi terbaru di HP
(App Store atau Play Store).

```bash
git clone https://github.com/eskrimikan/literasi-gizi-app.git
cd literasi-gizi-app
npm install
npx expo start
```

Pindai QR code yang muncul memakai kamera iPhone atau aplikasi Expo Go di Android. HP dan
laptop sebaiknya berada di jaringan yang sama. Kalau tidak bisa, jalankan
`npx expo start --tunnel`.

Untuk mencoba di browser: `npx expo start --web`.

Alamat API bisa diganti tanpa mengubah kode dengan membuat file `.env` dari `.env.example`.

## Akun demo

Akun ini berasal dari script seed backend (`node scripts/seed.js`) dan hanya berisi data uji.

| Peran | Login | Kredensial |
|---|---|---|
| Orang tua | Email dan password | `demo.parent@aiko.test` / `Demo12345!` |
| Anak (kelas 3) | Nama pengguna dan PIN | `demo_kid` / `1234` |

Akun orang tua baru juga bisa dibuat langsung dari layar Daftar.

## Fitur dan layar

Ada dua mode, mengikuti aturan di makalah: akun dibuat dan dikelola orang tua (Pasal 25 UU
No. 27 Tahun 2022 tentang Pelindungan Data Pribadi), sedangkan anak masuk memakai nama
pengguna dan PIN yang dibuat orang tuanya.

| Layar | Mode | Endpoint yang dipakai |
|---|---|---|
| Login orang tua | Belum login | `POST /auth/login` |
| Daftar orang tua (form dengan validasi dan persetujuan orang tua) | Belum login | `POST /auth/register` |
| Masuk sebagai anak | Belum login | `POST /auth/child-login` |
| Tab Anak: daftar profil anak | Orang tua | `GET /players` |
| Tambah profil anak (form dengan validasi) | Orang tua | `POST /players` |
| Jalur belajar anak, hapus profil | Orang tua | `GET /players/{id}`, `GET /players/{id}/path`, `DELETE /players/{id}` |
| Materi modul | Orang tua, anak | `GET /modules/{id}` |
| Kuis adaptif dengan penjelasan jawaban | Orang tua, anak | `POST /quizzes/{moduleId}/start`, `POST /quizzes/{sessionId}/answer` |
| Hasil kuis: skor, poin, level, modul terbuka, misi | Orang tua, anak | hasil dari endpoint answer |
| Tab Progres: level, misi harian (centang oleh orang tua), penguasaan topik, lencana | Orang tua | `GET /players/{id}/progress`, `/badges`, `/missions`, `POST /missions/{id}/check` |
| Tab Akun: profil dan status layanan | Orang tua | data sesi |
| Tab Belajar: jalur belajarku | Anak | `GET /players/{id}/path` |
| Tab Lencana: poin, misi, lencana | Anak | `GET /players/{id}/progress`, `/badges`, `/missions` |
| Tab Profil | Anak | data sesi |

Navigasi memakai stack (login, materi, kuis, hasil) dan tab (Anak, Progres, Akun untuk orang
tua; Belajar, Lencana, Profil untuk anak). Halaman untuk orang tua dan anak dilindungi
dengan `Stack.Protected`, jadi anak tidak bisa membuka halaman milik orang tua.

Token login disimpan terenkripsi di HP dengan `expo-secure-store`. Kalau token kedaluwarsa
(respons 401), aplikasi otomatis kembali ke layar login.

## Struktur folder

```text
src/
  app/                    layar (Expo Router: setiap file adalah satu halaman)
    _layout.js            root stack dan pembatasan akses per peran
    login.js, register.js, child-login.js
    (parent)/             tab mode orang tua: anak, progres, akun
    (child)/              tab mode anak: belajar, lencana, profil
    tambah-anak.js
    jalur/[playerId].js
    modul/[moduleId].js
    kuis/[moduleId].js
    hasil.js
  services/
    ApiService.js         semua pemanggilan API (LiterasiGizi dan kelompok lain)
    config.js             alamat API dan konfigurasi mitra
    storage.js            penyimpanan token
  context/AuthContext.js  sesi login orang tua dan anak
  components/             komponen UI, jalur belajar, dan tampilan progres
  utils/                  validasi form, label, dialog
```

## ApiService dan integrasi antarkelompok

`src/services/ApiService.js` adalah satu-satunya tempat aplikasi memanggil API:

- `AuthApi`, `PlayerApi`, `ContentApi`, `LearningApi`, `ProgressApi`: microservice
  LiterasiGizi milik kelompok sendiri.
- `PartnerApi`: API kelompok lain. Bagian ini sudah disiapkan untuk dua layanan yang
  disebut di makalah, yaitu layanan penilai jajanan kemasan (bahan kartu pangan untuk
  soal) dan layanan artikel kesehatan anak (bacaan pendamping orang tua). Integrasinya
  dikerjakan pada minggu berikutnya.

Cara menghubungkan API mitra:

1. Isi `EXPO_PUBLIC_JAJANAN_API_URL`, `EXPO_PUBLIC_ARTIKEL_API_URL`, dan API key di `.env`.
2. Ubah `enabled` menjadi `true` di `src/services/config.js`.
3. Sesuaikan path endpoint di `PartnerApi` dengan dokumentasi API mitra.

Catatan: nilai `EXPO_PUBLIC_*` ikut masuk ke dalam aplikasi dan bisa dibaca siapa pun yang
membongkar aplikasinya. Gunakan API key yang memang ditujukan untuk aplikasi klien.

## Batasan

- Semua data anak adalah data uji.
- Belum ada integrasi API kelompok lain (dijadwalkan minggu berikutnya).
- Fitur Kelas & Tantangan Sekolah untuk guru belum tersedia karena belum ada di backend.
