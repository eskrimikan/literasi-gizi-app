import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';

// Arahkan pengguna ke layar awal sesuai peran.
export default function Index() {
  const { session } = useAuth();
  if (!session) return <Redirect href="/login" />;
  if (session.role === 'child') return <Redirect href="/belajar" />;
  return <Redirect href="/anak" />;
}
