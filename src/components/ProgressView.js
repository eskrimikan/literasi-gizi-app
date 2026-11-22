import { useCallback, useState } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import { notify } from '../utils/dialog';
import { useFocusEffect } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ProgressApi } from '../services/ApiService';
import { colors, fonts, radius, spacing } from '../theme';
import { BADGE_ICONS, friendlyError, topicLabel } from '../utils/labels';
import {
  Body,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Loading,
  ProgressBar,
  Screen,
  SectionTitle,
} from './ui';

// Progres satu anak (konteks Progres & Pencapaian): poin, level,
// penguasaan per topik, lencana, dan misi harian.
// canCheckMission = true hanya untuk orang tua (backend juga membatasi ini).
export default function ProgressView({ playerId, canCheckMission, header }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [checkingId, setCheckingId] = useState(null);

  const load = useCallback(async () => {
    if (!playerId) return;
    try {
      setError(null);
      const [progress, badges, missions] = await Promise.all([
        ProgressApi.progress(playerId),
        ProgressApi.badges(playerId),
        ProgressApi.missions(playerId),
      ]);
      setData({ progress, badges, missions });
    } catch (e) {
      setError(friendlyError(e, 'Gagal memuat progres.'));
    }
  }, [playerId]);

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

  const checkMission = async (mission) => {
    setCheckingId(mission.id);
    try {
      const res = await ProgressApi.checkMission(mission.id);
      notify('Misi dicentang', `Anak mendapat ${res.pointsEarned} poin tambahan.`);
      await load();
    } catch (e) {
      notify('Gagal', friendlyError(e));
    } finally {
      setCheckingId(null);
    }
  };

  const refresh = <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />;

  if (!data && !error) {
    return (
      <Screen edges={[]} refreshControl={refresh}>
        {header}
        <Loading label="Memuat progres..." />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen edges={[]} refreshControl={refresh}>
        {header}
        <ErrorState message={error} onRetry={load} />
      </Screen>
    );
  }

  const { progress, badges, missions } = data;
  const levelStart = (progress.level - 1) * 100;
  const earnedBadges = badges.filter((b) => b.earned);
  // Lencana yang sudah didapat ditampilkan lebih dulu.
  const sortedBadges = [...badges].sort((a, b) => Number(Boolean(b.earned)) - Number(Boolean(a.earned)));

  return (
    <Screen edges={[]} refreshControl={refresh}>
      {header}

      <Card style={styles.levelCard}>
        <View style={styles.levelRow}>
          <View>
            <Text style={styles.levelLabel}>Level</Text>
            <Text style={styles.levelValue}>{progress.level}</Text>
          </View>
          <View style={styles.pointsBox}>
            <Text style={styles.pointsValue}>{progress.points}</Text>
            <Text style={styles.pointsLabel}>poin</Text>
          </View>
        </View>
        <ProgressBar
          value={progress.points - levelStart}
          max={progress.nextLevelAt - levelStart}
          color={colors.accent}
          style={styles.levelBar}
        />
        <Body muted style={styles.small}>
          {progress.nextLevelAt - progress.points} poin lagi menuju level {progress.level + 1} · {progress.completedModules} modul selesai
        </Body>
      </Card>

      <SectionTitle>Misi hari ini</SectionTitle>
      {missions.length === 0 ? (
        <Card>
          <Body muted>Belum ada misi. Misi muncul setelah anak lulus satu kuis hari ini.</Body>
        </Card>
      ) : (
        missions.map((mission) => {
          const checked = mission.status === 'checked';
          return (
            <Card key={mission.id}>
              <View style={styles.missionRow}>
                <Ionicons
                  name={checked ? 'checkmark-circle' : 'flag-outline'}
                  size={22}
                  color={checked ? colors.primary : colors.accent}
                />
                <View style={styles.missionInfo}>
                  <Text style={styles.missionTitle}>{mission.title}</Text>
                  <Body muted style={styles.small}>{mission.description}</Body>
                  {mission.module_title ? (
                    <Body muted style={styles.small}>Dari modul: {mission.module_title}</Body>
                  ) : null}
                </View>
              </View>
              {checked ? (
                <Body style={styles.checkedText}>Sudah dicentang orang tua</Body>
              ) : canCheckMission ? (
                <Button
                  title="Centang misi selesai"
                  variant="secondary"
                  icon="checkmark"
                  loading={checkingId === mission.id}
                  onPress={() => checkMission(mission)}
                  style={styles.missionButton}
                />
              ) : (
                <Body muted style={styles.checkedText}>Sudah dikerjakan? Minta orang tua mencentang misi ini.</Body>
              )}
            </Card>
          );
        })
      )}

      <SectionTitle>Penguasaan topik</SectionTitle>
      {progress.mastery.length === 0 ? (
        <Card>
          <Body muted>Penguasaan topik muncul setelah anak menyelesaikan kuis.</Body>
        </Card>
      ) : (
        <Card>
          {progress.mastery.map((item) => (
            <View key={item.topic} style={styles.masteryItem}>
              <View style={styles.masteryHead}>
                <Text style={styles.masteryTopic}>{topicLabel(item.topic)}</Text>
                <Text style={styles.masteryScore}>{Math.round(item.score)}%</Text>
              </View>
              <ProgressBar
                value={item.score}
                color={item.score >= 60 ? colors.primary : colors.accent}
              />
            </View>
          ))}
        </Card>
      )}

      <SectionTitle>
        Lencana ({earnedBadges.length}/{badges.length})
      </SectionTitle>
      {badges.length === 0 ? (
        <EmptyState icon="ribbon-outline" title="Belum ada lencana" />
      ) : (
        <View style={styles.badgeGrid}>
          {sortedBadges.map((badge) => {
            const earned = Boolean(badge.earned);
            return (
              <View key={badge.id} style={[styles.badge, !earned && styles.badgeLocked]}>
                <View style={[styles.badgeIcon, !earned && styles.badgeIconLocked]}>
                  <Ionicons
                    name={BADGE_ICONS[badge.code] || 'ribbon'}
                    size={22}
                    color={earned ? colors.white : colors.locked}
                  />
                </View>
                <Text style={[styles.badgeName, !earned && styles.badgeNameLocked]}>{badge.name}</Text>
                <Text style={styles.badgeDesc}>{badge.description}</Text>
              </View>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  small: { fontSize: 12, lineHeight: 18 },
  levelCard: { backgroundColor: colors.primarySoft, borderColor: colors.primarySoft },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  levelLabel: { fontFamily: fonts.medium, fontSize: 13, color: colors.primaryDark },
  levelValue: { fontFamily: fonts.bold, fontSize: 36, color: colors.primaryDark, lineHeight: 42 },
  pointsBox: { alignItems: 'flex-end' },
  pointsValue: { fontFamily: fonts.bold, fontSize: 22, color: colors.text },
  pointsLabel: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  levelBar: { marginTop: spacing.sm, marginBottom: spacing.sm, backgroundColor: colors.white },
  missionRow: { flexDirection: 'row', alignItems: 'flex-start' },
  missionInfo: { flex: 1, marginLeft: spacing.sm },
  missionTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
  missionButton: { marginTop: spacing.sm, minHeight: 42 },
  checkedText: { fontSize: 12, marginTop: spacing.sm, color: colors.primaryDark },
  masteryItem: { marginBottom: spacing.sm },
  masteryHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  masteryTopic: { fontFamily: fonts.medium, fontSize: 13, color: colors.text },
  masteryScore: { fontFamily: fonts.semibold, fontSize: 13, color: colors.text },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  badge: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm + 4,
    marginBottom: spacing.sm,
  },
  badgeLocked: { backgroundColor: colors.lockedSoft },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  badgeIconLocked: { backgroundColor: colors.border },
  badgeName: { fontFamily: fonts.semibold, fontSize: 13, color: colors.text },
  badgeNameLocked: { color: colors.textMuted },
  badgeDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted, lineHeight: 16 },
});
