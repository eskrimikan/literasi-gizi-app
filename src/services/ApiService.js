import { API_BASE_URL, PARTNER_APIS, REQUEST_TIMEOUT_MS } from './config';

// ApiService: satu-satunya tempat aplikasi memanggil API.
// 1. LiterasiGizi (microservice milik Kelompok Aiko di STB): https://aiko.stei.site/api
// 2. API kelompok lain (lihat bagian Partner di bawah).

export class ApiError extends Error {
  constructor(status, code, message, details = []) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

let authToken = null;
let onUnauthorized = null;

export function setAuthToken(token) {
  authToken = token;
}

// Dipanggil AuthContext supaya pengguna otomatis keluar kalau token kedaluwarsa.
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

async function request(path, options = {}) {
  const {
    method = 'GET',
    body,
    auth = true,
    baseUrl = API_BASE_URL,
    headers = {},
    timeoutMs = REQUEST_TIMEOUT_MS,
  } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const usesToken = auth && Boolean(authToken);

  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(usesToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError(0, 'TIMEOUT', 'Server terlalu lama merespons. Coba lagi.');
    }
    throw new ApiError(0, 'NETWORK', 'Tidak bisa terhubung ke server. Periksa koneksi internet.');
  } finally {
    clearTimeout(timer);
  }

  if (response.status === 204) return null;

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    // Format error backend: { error: { code, message, details } }
    const err = data && data.error ? data.error : {};
    const apiError = new ApiError(
      response.status,
      err.code || `HTTP_${response.status}`,
      err.message || 'Terjadi kesalahan pada server.',
      err.details || []
    );
    if (response.status === 401 && usesToken && onUnauthorized) onUnauthorized();
    throw apiError;
  }
  return data;
}

// ---------- LiterasiGizi: akun ----------
export const AuthApi = {
  register: (email, password, consent) =>
    request('/auth/register', { method: 'POST', body: { email, password, consent }, auth: false }),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  childLogin: (username, pin) =>
    request('/auth/child-login', { method: 'POST', body: { username, pin }, auth: false }),
  me: () => request('/auth/me'),
};

// ---------- LiterasiGizi: profil anak (konteks Profil Keluarga & Pemain) ----------
export const PlayerApi = {
  list: () => request('/players'),
  get: (playerId) => request(`/players/${playerId}`),
  create: (data) => request('/players', { method: 'POST', body: data }),
  update: (playerId, data) => request(`/players/${playerId}`, { method: 'PATCH', body: data }),
  remove: (playerId) => request(`/players/${playerId}`, { method: 'DELETE' }),
};

// ---------- LiterasiGizi: konten (konteks Kurasi Konten) ----------
export const ContentApi = {
  modules: (grade) => request(`/modules${grade ? `?grade=${grade}` : ''}`),
  module: (moduleId) => request(`/modules/${moduleId}`),
  topics: () => request('/topics'),
};

// ---------- LiterasiGizi: jalur belajar dan kuis (konteks inti) ----------
export const LearningApi = {
  path: (playerId) => request(`/players/${playerId}/path`),
  startQuiz: (moduleId, playerId) =>
    request(`/quizzes/${moduleId}/start`, { method: 'POST', body: { playerId } }),
  answer: (sessionId, questionId, chosenIndex) =>
    request(`/quizzes/${sessionId}/answer`, { method: 'POST', body: { questionId, chosenIndex } }),
  session: (sessionId) => request(`/quizzes/${sessionId}`),
  mastery: (playerId) => request(`/players/${playerId}/mastery`),
};

// ---------- LiterasiGizi: progres dan pencapaian (konteks inti) ----------
export const ProgressApi = {
  progress: (playerId) => request(`/players/${playerId}/progress`),
  badges: (playerId) => request(`/players/${playerId}/badges`),
  missions: (playerId, date) =>
    request(`/players/${playerId}/missions${date ? `?date=${date}` : ''}`),
  checkMission: (missionId) => request(`/missions/${missionId}/check`, { method: 'POST' }),
};

export const SystemApi = {
  health: () => request('/health', { auth: false }),
};

// ---------- API kelompok lain (integrasi) ----------
// Endpoint di bawah masih contoh. Sesuaikan path dan bentuk datanya dengan
// dokumentasi API kelompok mitra saat integrasi dikerjakan.
function partnerRequest(partnerKey, path, options = {}) {
  const partner = PARTNER_APIS[partnerKey];
  if (!partner || !partner.enabled || !partner.baseUrl) {
    return Promise.reject(
      new ApiError(0, 'PARTNER_NOT_CONFIGURED', `${partner ? partner.name : partnerKey} belum dihubungkan.`)
    );
  }
  return request(path, {
    ...options,
    auth: false,
    baseUrl: partner.baseUrl,
    headers: partner.apiKey ? { [partner.apiKeyHeader]: partner.apiKey } : {},
  });
}

export const PartnerApi = {
  isEnabled: (partnerKey) => Boolean(PARTNER_APIS[partnerKey] && PARTNER_APIS[partnerKey].enabled),
  // Contoh: cari produk jajanan beserta kandungan gizinya.
  searchSnacks: (query) => partnerRequest('jajanan', `/products?search=${encodeURIComponent(query)}`),
  // Contoh: artikel kesehatan anak berdasarkan topik modul dan usia anak.
  articlesByTopic: (topic, age) =>
    partnerRequest('artikel', `/articles?topic=${encodeURIComponent(topic)}${age ? `&age=${age}` : ''}`),
};

export default {
  AuthApi,
  PlayerApi,
  ContentApi,
  LearningApi,
  ProgressApi,
  SystemApi,
  PartnerApi,
};
