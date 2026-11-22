// Alamat layanan yang dipakai aplikasi.
// Bisa diganti tanpa mengubah kode lewat file .env:
//   EXPO_PUBLIC_API_BASE_URL=https://aiko.stei.site/api
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'https://aiko.stei.site/api';

// Batas waktu tiap request (milidetik).
export const REQUEST_TIMEOUT_MS = 15000;

// API kelompok lain (integrasi antarkelompok, dikerjakan minggu berikutnya).
// Isi baseUrl dan apiKey setelah mendapat akses dari kelompok terkait,
// lalu ubah enabled menjadi true.
export const PARTNER_APIS = {
  // Layanan penilai jajanan kemasan: data produk dan kandungan gula, garam, lemak.
  // Dipakai sebagai "kartu pangan" untuk soal dan layar Cek Jajanan.
  jajanan: {
    name: 'Layanan Penilai Jajanan',
    enabled: false,
    baseUrl: process.env.EXPO_PUBLIC_JAJANAN_API_URL || '',
    apiKey: process.env.EXPO_PUBLIC_JAJANAN_API_KEY || '',
    apiKeyHeader: 'X-API-Key',
  },
  // Layanan kesehatan dan tumbuh kembang anak: artikel kesehatan anak.
  // Dipakai sebagai "bacaan pendamping" untuk orang tua di layar Progres.
  artikel: {
    name: 'Layanan Artikel Kesehatan Anak',
    enabled: false,
    baseUrl: process.env.EXPO_PUBLIC_ARTIKEL_API_URL || '',
    apiKey: process.env.EXPO_PUBLIC_ARTIKEL_API_KEY || '',
    apiKeyHeader: 'X-API-Key',
  },
};
