import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthApi, setAuthToken, setUnauthorizedHandler } from '../services/ApiService';
import { getItem, removeItem, setItem } from '../services/storage';

const STORAGE_KEY = 'literasigizi.session';
const AuthContext = createContext(null);

// session:
//   orang tua -> { token, role: 'parent', user: { id, email, role } }
//   anak      -> { token, role: 'child', player: { id, display_name, username, grade, ... } }
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveSession = useCallback(async (next) => {
    setAuthToken(next ? next.token : null);
    setSession(next);
    if (next) await setItem(STORAGE_KEY, JSON.stringify(next));
    else await removeItem(STORAGE_KEY);
  }, []);

  const signOut = useCallback(() => saveSession(null), [saveSession]);

  // Muat sesi tersimpan saat aplikasi dibuka.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      saveSession(null);
    });
    (async () => {
      try {
        const raw = await getItem(STORAGE_KEY);
        if (raw) {
          const stored = JSON.parse(raw);
          setAuthToken(stored.token);
          setSession(stored);
          // Cek token masih berlaku. Kalau 401, ApiService memanggil handler di atas.
          AuthApi.me().catch(() => {});
        }
      } catch {
        await removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [saveSession]);

  const signInParent = useCallback(
    async (email, password) => {
      const data = await AuthApi.login(email.trim().toLowerCase(), password);
      await saveSession({ token: data.token, role: 'parent', user: data.user });
    },
    [saveSession]
  );

  const registerParent = useCallback(
    async (email, password, consent) => {
      const normalized = email.trim().toLowerCase();
      await AuthApi.register(normalized, password, consent);
      await signInParent(normalized, password);
    },
    [signInParent]
  );

  const signInChild = useCallback(
    async (username, pin) => {
      const data = await AuthApi.childLogin(username.trim().toLowerCase(), pin);
      await saveSession({ token: data.token, role: 'child', player: data.player });
    },
    [saveSession]
  );

  const value = useMemo(
    () => ({ session, isLoading, signInParent, registerParent, signInChild, signOut }),
    [session, isLoading, signInParent, registerParent, signInChild, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  return value;
}
