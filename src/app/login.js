import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Mascot, Sparkle, TopicSticker } from '../components/illustrations';
import { Banner, Body, Button, Card, Field, Screen } from '../components/ui';
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

  const hero = (
    <View style={styles.hero}>
      <View style={[styles.float, styles.floatA]}>
        <TopicSticker topic="sayur-buah" size={54} />
      </View>
      <View style={[styles.float, styles.floatB]}>
        <TopicSticker topic="air-putih" size={46} />
      </View>
      <View style={[styles.float, styles.floatC]}>
        <TopicSticker topic="protein" size={44} />
      </View>
      <View style={[styles.float, styles.floatD]}>
        <Sparkle size={18} color={colors.yellow} />
      </View>
      <View style={[styles.float, styles.floatE]}>
        <Sparkle size={12} color={colors.pink} />
      </View>
      <Mascot size={140} mood="happy" />
      <Text style={styles.brand}>
        Literasi<Text style={styles.brandAccent}>Gizi</Text>
      </Text>
      <Body muted style={styles.tagline}>Belajar gizi seimbang itu seru!</Body>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen hero={hero}>
        <Card style={styles.formCard}>
          <Text style={styles.heading}>Masuk sebagai orang tua</Text>
          <Banner message={serverError} />
          <Field
            label="Email"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            placeholder="nama@email.com"
            error={errors.email}
          />
          <Field
            label="Password"
            icon="lock-closed-outline"
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
            <Link href="/register" style={styles.link}>Daftar di sini</Link>
          </View>
        </Card>

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>atau</Text>
          <View style={styles.orLine} />
        </View>

        <Link href="/child-login" asChild>
          <Button title="Aku anak, mau belajar!" variant="yellow" icon="happy" />
        </Link>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  hero: { alignItems: 'center', paddingTop: spacing.lg, paddingBottom: spacing.sm },
  float: { position: 'absolute' },
  floatA: { top: 26, left: 26, transform: [{ rotate: '-12deg' }] },
  floatB: { top: 40, right: 30, transform: [{ rotate: '10deg' }] },
  floatC: { top: 132, left: 46, transform: [{ rotate: '8deg' }] },
  floatD: { top: 120, right: 62 },
  floatE: { top: 18, right: 120 },
  brand: { fontFamily: fonts.display, fontSize: 36, lineHeight: 44, color: colors.primaryDark, marginTop: spacing.xs },
  brandAccent: { color: colors.orange },
  tagline: { fontSize: 16 },
  formCard: { padding: spacing.md + 4 },
  heading: { fontFamily: fonts.heading, fontSize: 21, color: colors.text, marginBottom: spacing.md },
  links: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.md, flexWrap: 'wrap' },
  link: { fontFamily: fonts.heading, fontSize: 15, color: colors.pinkDark },
  orRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.md },
  orLine: { flex: 1, height: 2, backgroundColor: colors.border, borderRadius: 1 },
  orText: { fontFamily: fonts.medium, fontSize: 14, color: colors.textMuted, marginHorizontal: spacing.sm },
});
