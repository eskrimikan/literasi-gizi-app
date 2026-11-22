export const TOPIC_LABELS = {
  jajanan: 'Kelompok Makanan',
  'sayur-buah': 'Sayur & Buah',
  protein: 'Protein',
  'air-putih': 'Air Putih',
  'minuman-manis': 'Minuman Manis',
  'label-gizi': 'Label Gizi',
};

export const topicLabel = (topic) => TOPIC_LABELS[topic] || topic;

export const MODULE_STATUS = {
  terkunci: { label: 'Terkunci', icon: 'lock-closed' },
  berjalan: { label: 'Siap dipelajari', icon: 'play-circle' },
  selesai: { label: 'Selesai', icon: 'checkmark-circle' },
};

export const BADGE_ICONS = {
  first_quiz: 'footsteps',
  perfect_score: 'star',
  streak_3: 'flame',
  water_hero: 'water',
  sugar_detective: 'search',
  veggie_star: 'leaf',
  level_5: 'trophy',
  all_modules: 'ribbon',
};

export const BADGE_NAMES = {
  first_quiz: 'Langkah Pertama',
  perfect_score: 'Skor Sempurna',
  streak_3: 'Tiga Hari Hebat',
  water_hero: 'Pahlawan Air',
  sugar_detective: 'Detektif Gula',
  veggie_star: 'Bintang Sayur',
  level_5: 'Petualang Level 5',
  all_modules: 'Juara Literasi Gizi',
};

export function friendlyError(error, fallback = 'Terjadi kesalahan. Coba lagi.') {
  if (!error) return fallback;
  switch (error.code) {
    case 'DAILY_LIMIT_REACHED':
      return 'Waktu belajar hari ini sudah habis. Istirahat dulu, lanjut lagi besok ya!';
    case 'MODULE_LOCKED':
      return 'Modul ini masih terkunci. Selesaikan modul sebelumnya dulu.';
    case 'RATE_LIMITED':
      return 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.';
    default:
      return error.message || fallback;
  }
}
