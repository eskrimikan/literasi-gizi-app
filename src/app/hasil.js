import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Mascot, Sparkle } from '../components/illustrations';
import { Body, Button, Card, Screen, SectionTitle } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { colors, fonts, radius, spacing } from '../theme';
import { BADGE_ICONS, BADGE_NAMES } from '../utils/labels';

// Posisi taburan bintang di sekitar maskot.
const CONFETTI = [
  { top: 10, left: 40, size: 18, color: colors.yellow },
  { top: 40, left: 10, size: 12, color: colors.pink },
  { top: 120, left: 30, size: 14, color: colors.sky },
  { top: 16, right: 44, size: 14, color: colors.pink },
  { top: 70, right: 14, size: 20, color: colors.yellow },
  { top: 140, right: 40, size: 12, color: colors.purple },
];

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
        <Button title="Kembali ke peta belajar" onPress={backToPath} style={styles.gap} />
      </Screen>
    );
  }

  const passed = result.passed;

  return (
    <Screen edges={['bottom']}>
      <View style={[styles.hero, passed ? styles.heroPass : styles.heroRetry]}>
        {passed
          ? CONFETTI.map((c, i) => (
              <View key={i} style={[styles.confetti, { top: c.top, left: c.left, right: c.right }]}>
                <Sparkle size={c.size} color={c.color} />
              </View>
            ))
          : null}
        <Mascot size={140} mood={passed ? 'party' : 'think'} />
        <Text style={styles.heroTitle}>{passed ? 'Hore, kamu lulus!' : 'Hampir! Ayo coba lagi'}</Text>
        <Body style={styles.centerText}>
          {result.correct} dari {result.total} jawaban benar.
          {passed ? ' Modul ini selesai.' : ' Baca lagi materinya, lalu ulangi kuis.'}
        </Body>
      </View>

      <View style={styles.stats}>
        <Card style={styles.stat}>
          <Text style={[styles.statValue, { color: passed ? colors.primaryDark : colors.orangeDark }]}>{result.score}</Text>
          <Text style={styles.statLabel}>skor</Text>
        </Card>
        <Card style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.yellowDark }]}>+{result.pointsEarned}</Text>
          <Text style={styles.statLabel}>poin</Text>
        </Card>
        <Card style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.purple }]}>{result.level}</Text>
          <Text style={styles.statLabel}>level</Text>
        </Card>
      </View>

      {result.unlockedModuleId ? (
        <Card style={styles.info} tone={{ bg: colors.primarySoft, border: colors.primarySoft, shadow: '#C7E8B8' }}>
          <View style={[styles.infoIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="lock-open" size={20} color={colors.white} />
          </View>
          <Body style={styles.infoText}>Modul berikutnya sudah terbuka di peta belajar!</Body>
        </Card>
      ) : null}

      {result.newBadges && result.newBadges.length > 0 ? (
        <>
          <SectionTitle icon="ribbon" iconColor={colors.purple}>Lencana baru</SectionTitle>
          {result.newBadges.map((code) => (
            <Card key={code} style={styles.info}>
              <View style={[styles.infoIcon, { backgroundColor: colors.yellow }]}>
                <Ionicons name={BADGE_ICONS[code] || 'ribbon'} size={20} color={colors.white} />
              </View>
              <Body style={styles.infoText}>{BADGE_NAMES[code] || code}</Body>
            </Card>
          ))}
        </>
      ) : null}

      {result.mission ? (
        <>
          <SectionTitle icon="flag" iconColor={colors.pink}>Misi hari ini</SectionTitle>
          <Card tone={{ bg: colors.pinkSoft, border: colors.pinkSoft, shadow: '#F8C2D3' }}>
            <Text style={styles.missionTitle}>{result.mission.title}</Text>
            <Body>{result.mission.description}</Body>
            <Body muted style={styles.small}>
              {session?.role === 'parent'
                ? 'Centang misi ini di tab Progres setelah anak mengerjakannya.'
                : 'Kerjakan di rumah, lalu minta orang tua mencentangnya.'}
            </Body>
          </Card>
        </>
      ) : null}

      {!passed ? <Button title="Ulangi kuis" variant="yellow" icon="refresh" onPress={retry} style={styles.gap} /> : null}
      <Button
        title="Kembali ke peta belajar"
        variant={passed ? 'primary' : 'secondary'}
        icon="map"
        onPress={backToPath}
        style={passed ? styles.gap : styles.gapSmall}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  heroPass: { backgroundColor: colors.yellowSoft },
  heroRetry: { backgroundColor: colors.orangeSoft },
  confetti: { position: 'absolute' },
  heroTitle: { fontFamily: fonts.display, fontSize: 28, color: colors.text, marginTop: spacing.sm, textAlign: 'center' },
  centerText: { textAlign: 'center', marginTop: spacing.xs },
  stats: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { width: '31%', alignItems: 'center', paddingVertical: spacing.sm + 4 },
  statValue: { fontFamily: fonts.display, fontSize: 28 },
  statLabel: { fontFamily: fonts.medium, fontSize: 14, color: colors.textMuted },
  info: { flexDirection: 'row', alignItems: 'center' },
  infoIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  infoText: { marginLeft: spacing.sm + 4, flex: 1 },
  missionTitle: { fontFamily: fonts.heading, fontSize: 18, color: colors.text },
  small: { fontSize: 13, marginTop: spacing.xs },
  gap: { marginTop: spacing.lg },
  gapSmall: { marginTop: spacing.sm },
});
