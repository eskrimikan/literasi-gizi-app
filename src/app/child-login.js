import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Mascot, Sparkle } from '../components/illustrations';
import { Banner, Body, Button, Card, Field, Screen } from '../components/ui';
import { colors, fonts, spacing } from '../theme';
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
        <View style={styles.hello}>
          <View style={styles.sparkle}>
            <Sparkle size={20} color={colors.yellow} />
          </View>
          <Mascot size={120} mood="party" />
          <Text style={styles.helloTitle}>Hai, teman kecil!</Text>
          <Body muted style={styles.intro}>
            Masukkan nama pengguna dan PIN yang dibuatkan orang tuamu.
          </Body>
        </View>
        <Card>
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
        <Button title="Ayo belajar!" icon="rocket" onPress={submit} loading={loading} />
        </Card>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  hello: { alignItems: 'center', marginBottom: spacing.md },
  sparkle: { position: 'absolute', top: 10, right: 70 },
  helloTitle: { fontFamily: fonts.display, fontSize: 26, color: colors.primaryDark, marginTop: spacing.xs },
  intro: { textAlign: 'center', marginTop: 2 },
});
