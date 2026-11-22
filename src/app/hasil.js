import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Body, Button, Card, Screen, SectionTitle } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { colors, fonts, spacing } from '../theme';
import { BADGE_ICONS, BADGE_NAMES } from '../utils/labels';

// Hasil kuis: skor, poin (konteks Progres & Pencapaian), lencana baru,
// modul yang terbuka, dan misi harian.
export default function ResultScreen() {
  const { result: raw, playerId, moduleId } = useLocalSearchParams();
  const { session } = useAuth();
  let result = null;
  try {
    result = JSON.parse(raw);
  } catch {
    result = null;
  }

  // Tumpukan layar: ... -> Jalur/Belajar -> Materi -> Hasil. Kembali 2 langkah ke jalur.
  const backToPath = () => router.dismiss(2);
  const retry = () => router.replace({ pathname: '/kuis/[moduleId]', params: { moduleId, playerId } });

  if (!result) {
    return (
      <Screen edges={['bottom']}>
        <Body>Hasil kuis tidak ditemukan.</Body>
        <Button title="Kembali ke jalur belajar" onPress={backToPath} style={styles.gap} />
      </Screen>
    );
  }

  const passed = result.passed;

  return (
    <Screen edges={['bottom']}>
      <View style={styles.hero}>
        <View style={[styles.circle, passed ? styles.circlePass : styles.circleRetry]}>
          <Text style={styles.score}>{result.score}</Text>
          <Text style={styles.scoreLabel}>skor</Text>
        </View>
        <Text style={styles.heroTitle}>{passed ? 'Kamu lulus!' : 'Hampir! Ayo coba lagi'}</Text>
        <Body muted style={styles.centerText}>
          {result.correct} dari {result.total} jawaban benar.
          {passed ? ' Modul ini selesai.' : ' Pelajari lagi materinya, lalu ulangi kuis.'}
        </Body>
      </View>

      <View style={styles.stats}>
        <Card style={styles.stat}>
          <Ionicons name="sparkles" size={20} color={colors.accent} />
          <Text style={styles.statValue}>+{result.pointsEarned}</Text>
          <Text style={styles.statLabel}>poin</Text>
        </Card>
        <Card style={styles.stat}>
          <Ionicons name="trending-up" size={20} color={colors.primary} />
          <Text style={styles.statValue}>{result.level}</Text>
          <Text style={styles.statLabel}>level</Text>
        </Card>
      </View>

      {result.unlockedModuleId ? (
        <Card style={styles.info}>
          <Ionicons name="lock-open" size={20} color={colors.primary} />
          <Body style={styles.infoText}>Modul berikutnya sudah terbuka di jalur belajar.</Body>
        </Card>
      ) : null}

      {result.newBadges && result.newBadges.length > 0 ? (
        <>
          <SectionTitle>Lencana baru</SectionTitle>
          {result.newBadges.map((code) => (
            <Card key={code} style={styles.info}>
              <Ionicons name={BADGE_ICONS[code] || 'ribbon'} size={20} color={colors.accent} />
              <Body style={styles.infoText}>{BADGE_NAMES[code] || code}</Body>
            </Card>
          ))}
        </>
      ) : null}

      {result.mission ? (
        <>
          <SectionTitle>Misi hari ini</SectionTitle>
          <Card>
            <Text style={styles.missionTitle}>{result.mission.title}</Text>
            <Body muted>{result.mission.description}</Body>
            <Body muted style={styles.small}>
              {session?.role === 'parent'
                ? 'Centang misi ini di tab Progres setelah anak mengerjakannya.'
                : 'Kerjakan di rumah, lalu minta orang tua mencentangnya.'}
            </Body>
          </Card>
        </>
      ) : null}

      {!passed ? <Button title="Ulangi kuis" icon="refresh" onPress={retry} style={styles.gap} /> : null}
      <Button
        title="Kembali ke jalur belajar"
        variant={passed ? 'primary' : 'secondary'}
        onPress={backToPath}
        style={styles.gapSmall}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginVertical: spacing.md },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  circlePass: { backgroundColor: colors.primary },
  circleRetry: { backgroundColor: colors.accent },
  score: { fontFamily: fonts.bold, fontSize: 40, color: colors.white, lineHeight: 46 },
  scoreLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.white },
  heroTitle: { fontFamily: fonts.bold, fontSize: 22, color: colors.text },
  centerText: { textAlign: 'center', marginTop: spacing.xs },
  stats: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { width: '48%', alignItems: 'center' },
  statValue: { fontFamily: fonts.bold, fontSize: 22, color: colors.text, marginTop: 4 },
  statLabel: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  info: { flexDirection: 'row', alignItems: 'center' },
  infoText: { marginLeft: spacing.sm, flex: 1 },
  missionTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  small: { fontSize: 12, marginTop: spacing.xs },
  gap: { marginTop: spacing.lg },
  gapSmall: { marginTop: spacing.sm },
});
