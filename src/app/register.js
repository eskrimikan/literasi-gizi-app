import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Banner, Body, Button, Checkbox, Field, Screen } from '../components/ui';
import { colors, spacing } from '../theme';
import { friendlyError } from '../utils/labels';
import { hasErrors, validateRegister } from '../utils/validation';

// Pendaftaran hanya untuk orang tua. Sesuai Pasal 25 UU PDP, data anak
// diproses dengan persetujuan orang tua, jadi centang persetujuan wajib.
export default function RegisterScreen() {
  const { registerParent } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', consent: false });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async () => {
    const found = validateRegister(form);
    setErrors(found);
    setServerError('');
    if (hasErrors(found)) return;
    setLoading(true);
    try {
      await registerParent(form.email, form.password, form.consent);
    } catch (e) {
      setServerError(friendlyError(e, 'Pendaftaran gagal.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen edges={[]}>
        <Body muted style={styles.intro}>
          Akun dibuat oleh orang tua. Setelah mendaftar, Anda bisa membuat profil anak dan
          memantau progres belajarnya.
        </Body>
        <Banner message={serverError} />
        <Field
          label="Email orang tua"
          value={form.email}
          onChangeText={update('email')}
          keyboardType="email-address"
          autoComplete="email"
          placeholder="nama@email.com"
          error={errors.email}
        />
        <Field
          label="Password"
          value={form.password}
          onChangeText={update('password')}
          secure
          placeholder="Minimal 8 karakter"
          error={errors.password}
        />
        <Field
          label="Ulangi password"
          value={form.confirmPassword}
          onChangeText={update('confirmPassword')}
          secure
          placeholder="Ketik ulang password"
          error={errors.confirmPassword}
        />
        <Checkbox checked={form.consent} onChange={update('consent')} error={errors.consent}>
          Saya orang tua atau wali dan menyetujui data anak saya diproses untuk kegiatan belajar
          di LiterasiGizi (UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi).
        </Checkbox>
        <Button title="Daftar dan masuk" onPress={submit} loading={loading} />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  intro: { marginBottom: spacing.md },
});
