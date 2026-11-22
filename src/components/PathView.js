import { useCallback, useState } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LearningApi } from '../services/ApiService';
import { colors, fonts, spacing } from '../theme';
import { MODULE_STATUS, friendlyError, topicLabel } from '../utils/labels';
import { Body, Card, EmptyState, ErrorState, Loading, Screen } from './ui';

// Jalur belajar satu anak: daftar modul sesuai kelas, dengan status
// terkunci / berjalan / selesai dari konteks Jalur Belajar & Kuis.
export default function PathView({ playerId, header }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      setData(await LearningApi.path(playerId));
    } catch (e) {
      setError(friendlyError(e, 'Gagal memuat jalur belajar.'));
    }
  }, [playerId]);

  // Muat ulang setiap kali layar kembali tampil (misalnya setelah kuis selesai).
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (!data && !error) return <Loading label="Memuat jalur belajar..." />;

  const modules = data ? data.modules : [];
  const doneCount = modules.filter((m) => m.status === 'selesai').length;

  return (
    <Screen edges={[]} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {header}
      {error ? <ErrorState message={error} onRetry={load} /> : null}
      {data && modules.length === 0 ? (
        <EmptyState title="Belum ada modul" message="Belum ada modul untuk jenjang kelas ini." />
      ) : null}
      {data && modules.length > 0 ? (
        <Body muted style={styles.summary}>
          {doneCount} dari {modules.length} modul selesai
        </Body>
      ) : null}
      {modules.map((module, index) => {
        const status = MODULE_STATUS[module.status] || MODULE_STATUS.terkunci;
        const locked = module.status === 'terkunci';
        const done = module.status === 'selesai';
        const recommended = data.recommended_next === module.id;
        return (
          <Card
            key={module.id}
            disabled={locked}
            onPress={() =>
              router.push({ pathname: '/modul/[moduleId]', params: { moduleId: module.id, playerId } })
            }
            style={[styles.card, locked && styles.cardLocked, recommended && styles.cardRecommended]}
          >
            <View style={[styles.step, done && styles.stepDone, locked && styles.stepLocked]}>
              <Text style={[styles.stepText, locked && styles.stepTextLocked]}>{index + 1}</Text>
            </View>
            <View style={styles.info}>
              <Text style={[styles.moduleTitle, locked && styles.textLocked]}>{module.title}</Text>
              <Text style={styles.topic}>{topicLabel(module.topic)}</Text>
              <View style={styles.statusRow}>
                <Ionicons
                  name={status.icon}
                  size={16}
                  color={locked ? colors.locked : done ? colors.primary : colors.accent}
                />
                <Text style={[styles.statusText, locked && styles.textLocked]}>
                  {status.label}
                  {done ? ` · skor terbaik ${module.best_score}` : ''}
                </Text>
              </View>
              {recommended ? <Text style={styles.recommended}>Disarankan berikutnya</Text> : null}
            </View>
            {!locked ? <Ionicons name="chevron-forward" size={20} color={colors.textMuted} /> : null}
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { marginBottom: spacing.sm },
  card: { flexDirection: 'row', alignItems: 'center' },
  cardLocked: { backgroundColor: colors.lockedSoft },
  cardRecommended: { borderColor: colors.accent, borderWidth: 1.5 },
  step: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  stepDone: { backgroundColor: colors.primarySoft },
  stepLocked: { backgroundColor: colors.border },
  stepText: { fontFamily: fonts.bold, fontSize: 15, color: colors.text },
  stepTextLocked: { color: colors.textMuted },
  info: { flex: 1 },
  moduleTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  topic: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statusText: { fontFamily: fonts.medium, fontSize: 12, color: colors.text, marginLeft: 4 },
  textLocked: { color: colors.textMuted },
  recommended: { fontFamily: fonts.semibold, fontSize: 12, color: colors.accent, marginTop: 4 },
});
