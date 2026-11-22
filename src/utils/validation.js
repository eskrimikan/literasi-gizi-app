// Aturan validasi disamakan dengan skema di backend (zod) supaya error
// sudah tertangkap di aplikasi sebelum data dikirim.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-z0-9_]{3,20}$/;
const PIN_RE = /^\d{4,6}$/;

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = 'Email wajib diisi.';
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Format email tidak valid.';
  if (!password) errors.password = 'Password wajib diisi.';
  return errors;
}

export function validateRegister({ email, password, confirmPassword, consent }) {
  const errors = {};
  if (!email.trim()) errors.email = 'Email wajib diisi.';
  else if (!EMAIL_RE.test(email.trim()) || email.length > 254) errors.email = 'Format email tidak valid.';
  if (!password) errors.password = 'Password wajib diisi.';
  else if (password.length < 8) errors.password = 'Password minimal 8 karakter.';
  else if (password.length > 128) errors.password = 'Password maksimal 128 karakter.';
  if (confirmPassword !== password) errors.confirmPassword = 'Konfirmasi password tidak sama.';
  if (!consent) errors.consent = 'Persetujuan orang tua wajib diberikan.';
  return errors;
}

export function validateChildLogin({ username, pin }) {
  const errors = {};
  if (!USERNAME_RE.test(username.trim().toLowerCase())) {
    errors.username = 'Nama pengguna 3-20 karakter: huruf kecil, angka, atau garis bawah.';
  }
  if (!PIN_RE.test(pin)) errors.pin = 'PIN berupa 4-6 angka.';
  return errors;
}

export function validateChild({ displayName, username, pin, confirmPin, grade, dailyLimit }) {
  const errors = {};
  const name = displayName.trim();
  if (!name) errors.displayName = 'Nama anak wajib diisi.';
  else if (name.length > 50) errors.displayName = 'Nama maksimal 50 karakter.';
  if (!USERNAME_RE.test(username)) {
    errors.username = 'Gunakan 3-20 karakter: huruf kecil, angka, atau garis bawah. Contoh: budi_kecil';
  }
  if (!PIN_RE.test(pin)) errors.pin = 'PIN berupa 4-6 angka.';
  if (confirmPin !== pin) errors.confirmPin = 'Konfirmasi PIN tidak sama.';
  if (!grade || grade < 1 || grade > 6) errors.grade = 'Pilih kelas 1 sampai 6.';
  const limit = Number(dailyLimit);
  if (!Number.isInteger(limit) || limit < 5 || limit > 60) {
    errors.dailyLimit = 'Batas waktu harian 5 sampai 60 menit.';
  }
  return errors;
}

export const hasErrors = (errors) => Object.keys(errors).length > 0;
