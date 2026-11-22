import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { Banner, Body, Button, Field, Screen, Title } from '../components/ui';
import { colors, fonts, spacing } from '../theme';
import { friendlyError } from '../utils/labels';
import { hasErrors, validateLogin } from '../utils/validation';

export default function LoginScreen() {
  const { signInParent } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const found = validateLogin({ email, password });
    setErrors(found);
    setServerError('');
    if (hasErrors(found)) return;
    setLoading(true);
    try {
      await signInParent(email, password);
    } catch (e) {
      setServerError(friendlyError(e, 'Gagal masuk.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen contentStyle={styles.content}>
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Ionicons name="nutrition" size={34} color={colors.white} />
          </View>
          <Title style={styles.center}>LiterasiGizi</Title>
          <Body muted style={styles.center}>
            Belajar gizi seimbang untuk anak SD, didampingi orang tua.
          </Body>
        </View>

        <Text style={styles.heading}>Masuk sebagai orang tua</Text>
        <Banner message={serverError} />
        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoComplete="email"
          placeholder="nama@email.com"
          error={errors.email}
        />
        <Field
          label="Password"
          value={password}
          onChangeText={setPassword}
          secure
          placeholder="Password"
          error={errors.password}
          onSubmitEditing={submit}
        />
        <Button title="Masuk" onPress={submit} loading={loading} />

        <View style={styles.links}>
          <Body muted>Belum punya akun? </Body>
          <Link href="/register" style={styles.link}>Daftar</Link>
        </View>

        <View style={styles.divider} />
        <Link href="/child-login" asChild>
          <Button title="Masuk sebagai anak" variant="secondary" icon="happy-outline" />
        </Link>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: spacing.xl },
  brand: { alignItems: 'center', marginBottom: spacing.lg },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  center: { textAlign: 'center' },
  heading: { fontFamily: fonts.semibold, fontSize: 17, color: colors.text, marginBottom: spacing.md },
  links: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.md },
  link: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.lg },
});
