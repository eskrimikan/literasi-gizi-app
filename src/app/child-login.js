import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Banner, Body, Button, Field, Screen } from '../components/ui';
import { colors, spacing } from '../theme';
import { friendlyError } from '../utils/labels';
import { hasErrors, validateChildLogin } from '../utils/validation';

// Anak masuk dengan nama pengguna dan PIN yang dibuat orang tuanya.
export default function ChildLoginScreen() {
  const { signInChild } = useAuth();
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const found = validateChildLogin({ username, pin });
    setErrors(found);
    setServerError('');
    if (hasErrors(found)) return;
    setLoading(true);
    try {
      await signInChild(username, pin);
    } catch (e) {
      setServerError(friendlyError(e, 'Gagal masuk.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen edges={[]}>
        <Body muted style={styles.intro}>
          Minta orang tuamu membuatkan profil dulu. Nama pengguna dan PIN dibuat oleh orang tua.
        </Body>
        <Banner message={serverError} />
        <Field
          label="Nama pengguna"
          value={username}
          onChangeText={(v) => setUsername(v.toLowerCase())}
          placeholder="contoh: budi_kecil"
          autoCorrect={false}
          error={errors.username}
        />
        <Field
          label="PIN"
          value={pin}
          onChangeText={(v) => setPin(v.replace(/\D/g, ''))}
          secure
          keyboardType="number-pad"
          maxLength={6}
          placeholder="4-6 angka"
          error={errors.pin}
          onSubmitEditing={submit}
        />
        <Button title="Ayo belajar" onPress={submit} loading={loading} />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  intro: { marginBottom: spacing.md },
});
