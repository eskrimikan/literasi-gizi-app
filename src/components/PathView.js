import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LearningApi } from '../services/ApiService';
import { colors, fonts, radius, spacing, topicColors } from '../theme';
import { friendlyError, topicLabel } from '../utils/labels';
import { TopicSticker } from './illustrations';
import { Body, EmptyState, ErrorState, Loading, ProgressBar, Screen } from './ui';

// Geser kiri-kanan supaya jalur terlihat seperti peta petualangan.
const OFFSETS = [0, 70, 0, -70];

function Dots() {
  return (
    <View style={styles.dots}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={styles.dot} />
      ))}
    </View>
  );
}

function ModuleNode({ module, index, recommended, onPress }) {
  const locked = module.status === 'terkunci';
  const done = module.status === 'selesai';
  const tone = topicColors[module.topic] || topicColors.jajanan;
  const offset = OFFSETS[index % OFFSETS.length];

  return (
    <Pressable
      onPress={onPress}
      disabled={locked}
      accessibilityRole="button"
      accessibilityLabel={`${module.title}, ${locked ? 'terkunci' : done ? 'selesai' : 'siap dipelajari'}`}
      style={({ pressed }) => [
        styles.nodeWrap,
        { transform: [{ translateX: offset }, { scale: pressed && !locked ? 0.96 : 1 }] },
      ]}
    >
      {recommended && !locked ? (
        <View style={[styles.bubble, { backgroundColor: tone.dark }]}>
          <Text style={styles.bubbleText}>{done ? 'Ulangi' : 'Mulai di sini!'}</Text>
          <View style={[styles.bubbleTail, { borderTopColor: tone.dark }]} />
        </View>
      ) : null}
      <View style={styles.node}>
        <TopicSticker topic={module.topic} size={92} locked={locked} />
        <View
          style={[
            styles.badge,
            done && { backgroundColor: colors.primary },
            locked && { backgroundColor: colors.locked },
            !done && !locked && { backgroundColor: colors.yellow },
          ]}
        >
          <Ionicons
            name={done ? 'checkmark' : locked ? 'lock-closed' : 'play'}
            size={16}
            color={!done && !locked ? colors.text : colors.white}
          />
        </View>
      </View>
      <Text style={[styles.nodeTitle, locked && styles.textLocked]} numberOfLines={2}>
        {module.title}
      </Text>
      <Text style={[styles.nodeMeta, { color: locked ? colors.locked : tone.dark }]}>
        {locked ? 'Terkunci' : done ? `Selesai · skor ${module.best_score}` : topicLabel(module.topic)}
      </Text>
    </Pressable>
  );
}

// Jalur belajar satu anak (konteks Jalur Belajar & Kuis).
export default function PathView({ playerId, header, hero, topColor, edges = [] }) {
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

  // Muat ulang setiap kali layar tampil lagi (misalnya setelah kuis selesai).
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

  const modules = data ? data.modules : [];
  const doneCount = modules.filter((m) => m.status === 'selesai').length;

  return (
    <Screen
      edges={edges}
      hero={hero}
      topColor={topColor}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {header}
      {!data && !error ? <Loading label="Menyiapkan peta belajar..." /> : null}
      {error ? <ErrorState message={error} onRetry={load} /> : null}
      {data && modules.length === 0 ? (
        <EmptyState title="Belum ada modul" message="Belum ada modul untuk jenjang kelas ini." />
      ) : null}

      {data && modules.length > 0 ? (
        <View style={styles.progressCard}>
          <View style={styles.progressHead}>
            <Text style={styles.progressTitle}>Peta Belajar</Text>
            <Text style={styles.progressCount}>
              {doneCount}/{modules.length} modul
            </Text>
          </View>
          <ProgressBar value={doneCount} max={modules.length} color={colors.yellow} />
        </View>
      ) : null}

      <View style={styles.map}>
        {modules.map((module, index) => (
          <View key={module.id} style={styles.step}>
            {index > 0 ? <Dots /> : null}
            <ModuleNode
              module={module}
              index={index}
              recommended={data.recommended_next === module.id}
              onPress={() =>
                router.push({ pathname: '/modul/[moduleId]', params: { moduleId: module.id, playerId } })
              }
            />
          </View>
        ))}
        {data && modules.length > 0 ? (
          <View style={styles.finish}>
            <Dots />
            <View style={[styles.flag, doneCount === modules.length && styles.flagDone]}>
              <Ionicons name="trophy" size={28} color={doneCount === modules.length ? colors.white : colors.locked} />
            </View>
            <Body muted style={styles.finishText}>
              {doneCount === modules.length ? 'Semua modul selesai. Keren!' : 'Selesaikan semua modul untuk lencana Juara!'}
            </Body>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    borderBottomWidth: 5,
    borderBottomColor: colors.borderStrong,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  progressHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  progressTitle: { fontFamily: fonts.heading, fontSize: 18, color: colors.text },
  progressCount: { fontFamily: fonts.medium, fontSize: 15, color: colors.yellowDark },
  map: { alignItems: 'center', paddingBottom: spacing.lg },
  step: { alignItems: 'center', width: '100%' },
  dots: { alignItems: 'center', paddingVertical: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.borderStrong, marginVertical: 3 },
  nodeWrap: { alignItems: 'center', width: 180 },
  node: { position: 'relative' },
  badge: {
    position: 'absolute',
    right: 0,
    bottom: 4,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 8,
  },
  bubbleText: { fontFamily: fonts.heading, fontSize: 14, color: colors.white },
  bubbleTail: {
    position: 'absolute',
    bottom: -7,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  nodeTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    lineHeight: 20,
    color: colors.text,
    textAlign: 'center',
    marginTop: 6,
  },
  nodeMeta: { fontFamily: fonts.medium, fontSize: 13, textAlign: 'center', marginTop: 2 },
  textLocked: { color: colors.textMuted },
  finish: { alignItems: 'center' },
  flag: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.lockedSoft,
    borderWidth: 3,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagDone: { backgroundColor: colors.yellow, borderColor: colors.yellowDark },
  finishText: { textAlign: 'center', marginTop: spacing.sm, maxWidth: 240 },
});
