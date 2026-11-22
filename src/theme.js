// Palet pastel hangat untuk anak SD: krem sebagai dasar, hijau daun untuk aksi utama,
// pink untuk mode orang tua, kuning untuk poin dan pencapaian.
export const colors = {
  background: '#FFF7EC',
  surface: '#FFFFFF',
  border: '#F0E2CF',
  borderStrong: '#E6D3BA',
  text: '#3B2F2A',
  textMuted: '#8C7C70',

  primary: '#4DB848',
  primaryDark: '#2F8F35',
  primarySoft: '#E5F6DD',

  pink: '#FF7EA6',
  pinkDark: '#E0588A',
  pinkSoft: '#FFE4EC',

  yellow: '#FFC93C',
  yellowDark: '#E5A500',
  yellowSoft: '#FFF2C8',

  orange: '#FF9F43',
  orangeDark: '#E07B1F',
  orangeSoft: '#FFE8D2',

  sky: '#6EC1F7',
  skyDark: '#3A9BD9',
  skySoft: '#E1F2FE',

  purple: '#B38CF5',
  purpleSoft: '#F0E8FF',

  danger: '#EF5E5B',
  dangerDark: '#C94340',
  dangerSoft: '#FFE4E2',

  locked: '#C8BBAE',
  lockedSoft: '#F3ECE3',
  white: '#FFFFFF',
};

// Semua teks memakai Fredoka: bentuk hurufnya bulat dan ramah anak.
export const fonts = {
  display: 'Fredoka_700Bold',
  heading: 'Fredoka_600SemiBold',
  headingMedium: 'Fredoka_500Medium',
  regular: 'Fredoka_400Regular',
  medium: 'Fredoka_500Medium',
  bold: 'Fredoka_600SemiBold',
};

export const radius = {
  sm: 10,
  md: 18,
  lg: 24,
  xl: 32,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Warna stiker per topik modul.
export const topicColors = {
  jajanan: { bg: colors.yellowSoft, main: colors.yellow, dark: colors.yellowDark },
  'sayur-buah': { bg: colors.primarySoft, main: colors.primary, dark: colors.primaryDark },
  protein: { bg: colors.orangeSoft, main: colors.orange, dark: colors.orangeDark },
  'air-putih': { bg: colors.skySoft, main: colors.sky, dark: colors.skyDark },
  'minuman-manis': { bg: colors.pinkSoft, main: colors.pink, dark: colors.pinkDark },
  'label-gizi': { bg: colors.purpleSoft, main: colors.purple, dark: '#8E63D9' },
};
