import { useCallback, useState } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ProgressApi } from '../services/ApiService';
import { colors, fonts, radius, spacing } from '../theme';
import { notify } from '../utils/dialog';
import { BADGE_ICONS, friendlyError, topicLabel } from '../utils/labels';
import { TopicSticker } from './illustrations';
import { Body, Button, Card, ErrorState, Loading, ProgressBar, Screen, SectionTitle } from './ui';

const BADGE_TONES = {
  first_quiz: [colors.sky, colors.skySoft],
  perfect_score: [colors.yellow, colors.yellowSoft],
  streak_3: [colors.orange, colors.orangeSoft],
  water_hero: [colors.sky, colors.skySoft],
  sugar_detective: [colors.pink, colors.pinkSoft],
  veggie_star: [colors.primary, colors.primarySoft],
  level_5: [colors.purple, colors.purpleSoft],
  all_modules: [colors.yellow, colors.yellowSoft],
};

// Progres satu anak (konteks Progres & Pencapaian): poin, level, misi harian,
// penguasaan per topik, dan lencana. canCheckMission hanya untuk orang tua.
export default function ProgressView({ playerId, canCheckMission, header, hero, topColor, edges = [] }) {
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

  const screenProps = {
    edges,
    hero,
    topColor,
    refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />,
  };

  if (!data || error) {
    return (
      <Screen {...screenProps}>
        {header}
        {error ? <ErrorState message={error} onRetry={load} /> : <Loading label="Menghitung poin..." />}
      </Screen>
    );
  }

  const { progress, badges, missions } = data;
  const levelStart = (progress.level - 1) * 100;
  const earnedCount = badges.filter((b) => b.earned).length;
  const sortedBadges = [...badges].sort((a, b) => Number(Boolean(b.earned)) - Number(Boolean(a.earned)));

  return (
    <Screen {...screenProps}>
      {header}

      <View style={styles.levelCard}>
        <View style={styles.levelRow}>
          <View style={styles.levelStar}>
            <Text style={styles.levelNumber}>{progress.level}</Text>
            <View style={styles.levelStarBadge}>
              <Ionicons name="star" size={14} color={colors.white} />
            </View>
          </View>
          <View style={styles.flex}>
            <Text style={styles.levelLabel}>Level {progress.level}</Text>
            <Text style={styles.points}>{progress.points} poin</Text>
          </View>
          <View style={styles.modulesDone}>
            <Text style={styles.modulesValue}>{progress.completedModules}</Text>
            <Text style={styles.modulesLabel}>modul{'\n'}selesai</Text>
          </View>
        </View>
        <ProgressBar
          value={progress.points - levelStart}
          max={progress.nextLevelAt - levelStart}
          color={colors.white}
          style={styles.levelBar}
          height={16}
        />
        <Text style={styles.levelHint}>
          {progress.nextLevelAt - progress.points} poin lagi menuju level {progress.level + 1}
        </Text>
      </View>

      <SectionTitle icon="flag" iconColor={colors.pink}>Misi hari ini</SectionTitle>
      {missions.length === 0 ? (
        <Card>
          <Body muted>Belum ada misi. Misi muncul setelah lulus satu kuis hari ini.</Body>
        </Card>
      ) : (
        missions.map((mission) => {
          const checked = mission.status === 'checked';
          return (
            <Card
              key={mission.id}
              tone={checked ? { bg: colors.primarySoft, border: colors.primarySoft, shadow: '#C7E8B8' } : null}
            >
              <View style={styles.missionRow}>
                <View style={[styles.missionIcon, checked && styles.missionIconDone]}>
                  <Ionicons name={checked ? 'checkmark' : 'flag'} size={20} color={colors.white} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.missionTitle}>{mission.title}</Text>
                  <Body muted style={styles.small}>{mission.description}</Body>
                </View>
                <Text style={styles.missionPoints}>+10</Text>
              </View>
              {checked ? (
                <Body style={styles.checkedText}>Hebat! Misi sudah dicentang orang tua.</Body>
              ) : canCheckMission ? (
                <Button
                  title="Centang misi selesai"
                  variant="pink"
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

      <SectionTitle icon="bulb" iconColor={colors.yellowDark}>Penguasaan topik</SectionTitle>
      {progress.mastery.length === 0 ? (
        <Card>
          <Body muted>Penguasaan topik muncul setelah menyelesaikan kuis.</Body>
        </Card>
      ) : (
        <Card>
          {progress.mastery.map((item) => (
            <View key={item.topic} style={styles.masteryItem}>
              <TopicSticker topic={item.topic} size={40} />
              <View style={styles.masteryBody}>
                <View style={styles.masteryHead}>
                  <Text style={styles.masteryTopic}>{topicLabel(item.topic)}</Text>
                  <Text style={styles.masteryScore}>{Math.round(item.score)}%</Text>
                </View>
                <ProgressBar value={item.score} color={item.score >= 60 ? colors.primary : colors.orange} height={12} />
              </View>
            </View>
          ))}
        </Card>
      )}

      <SectionTitle icon="ribbon" iconColor={colors.purple}>
        Lencana ({earnedCount}/{badges.length})
      </SectionTitle>
      <View style={styles.badgeGrid}>
        {sortedBadges.map((badge) => {
          const earned = Boolean(badge.earned);
          const [main, soft] = BADGE_TONES[badge.code] || [colors.yellow, colors.yellowSoft];
          return (
            <View key={badge.id} style={[styles.badge, { backgroundColor: earned ? soft : colors.lockedSoft }]}>
              <View
                style={[
                  styles.badgeIcon,
                  { backgroundColor: earned ? main : colors.border, borderColor: earned ? colors.white : colors.lockedSoft },
                ]}
              >
                <Ionicons name={earned ? BADGE_ICONS[badge.code] || 'ribbon' : 'lock-closed'} size={26} color={colors.white} />
              </View>
              <Text style={[styles.badgeName, !earned && styles.textLocked]}>{badge.name}</Text>
              <Text style={styles.badgeDesc}>{badge.description}</Text>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  small: { fontSize: 14, lineHeight: 19 },
  levelCard: {
    backgroundColor: colors.yellow,
    borderRadius: radius.lg,
    borderBottomWidth: 6,
    borderBottomColor: colors.yellowDark,
    padding: spacing.md,
    overflow: 'hidden',
  },
  levelRow: { flexDirection: 'row', alignItems: 'center' },
  levelStar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  levelNumber: { fontFamily: fonts.display, fontSize: 30, color: colors.yellowDark },
  levelStarBadge: {
    position: 'absolute',
    right: -2,
    top: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.orange,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelLabel: { fontFamily: fonts.medium, fontSize: 15, color: colors.text },
  points: { fontFamily: fonts.display, fontSize: 28, lineHeight: 34, color: colors.text },
  modulesDone: { alignItems: 'center' },
  modulesValue: { fontFamily: fonts.display, fontSize: 24, color: colors.text },
  modulesLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.text, textAlign: 'center', lineHeight: 14 },
  levelBar: { marginTop: spacing.md, backgroundColor: 'rgba(255,255,255,0.45)' },
  levelHint: { fontFamily: fonts.medium, fontSize: 14, color: colors.text, marginTop: 6 },
  missionRow: { flexDirection: 'row', alignItems: 'center' },
  missionIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 4,
  },
  missionIconDone: { backgroundColor: colors.primary },
  missionTitle: { fontFamily: fonts.heading, fontSize: 17, color: colors.text },
  missionPoints: { fontFamily: fonts.display, fontSize: 18, color: colors.yellowDark, marginLeft: spacing.sm },
  missionButton: { marginTop: spacing.md, minHeight: 48 },
  checkedText: { fontSize: 14, marginTop: spacing.sm, color: colors.primaryDark },
  masteryItem: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm + 4 },
  masteryBody: { flex: 1, marginLeft: spacing.sm + 4 },
  masteryHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  masteryTopic: { fontFamily: fonts.heading, fontSize: 16, color: colors.text },
  masteryScore: { fontFamily: fonts.heading, fontSize: 16, color: colors.text },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  badge: {
    width: '48%',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm + 4,
    alignItems: 'center',
  },
  badgeIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  badgeName: { fontFamily: fonts.heading, fontSize: 15, color: colors.text, textAlign: 'center' },
  badgeDesc: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, lineHeight: 16, textAlign: 'center', marginTop: 2 },
  textLocked: { color: colors.textMuted },
});
