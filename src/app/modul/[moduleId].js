import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ContentApi } from '../../services/ApiService';
import { Body, Button, Card, ErrorState, Loading, Screen } from '../../components/ui';
import { colors, fonts, radius, spacing } from '../../theme';
import { friendlyError, topicLabel } from '../../utils/labels';

// Mengubah teks materi (format markdown sederhana dari backend) menjadi blok teks.
function renderContent(markdown) {
  if (!markdown) return null;
  return markdown
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      if (block.startsWith('#')) {
        return (
          <Text key={index} style={styles.contentHeading}>
            {block.replace(/^#+\s*/, '')}
          </Text>
        );
      }
      return (
        <Text key={index} style={styles.contentText}>
          {block.replace(/\n/g, ' ')}
        </Text>
      );
    });
}

// Materi satu modul (konteks Kurasi Konten), dibaca sebelum kuis.
export default function ModuleScreen() {
  const { moduleId, playerId } = useLocalSearchParams();
  const [module, setModule] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setModule(await ContentApi.module(moduleId));
    } catch (e) {
      setError(friendlyError(e, 'Gagal memuat materi.'));
    }
  }, [moduleId]);

  useEffect(() => {
    load();
  }, [load]);

  if (!module && !error) return <Loading label="Memuat materi..." />;

  return (
    <Screen edges={['bottom']}>
      <Stack.Screen options={{ title: module ? module.title : 'Materi' }} />
      {error ? <ErrorState message={error} onRetry={load} /> : null}
      {module ? (
        <>
          <View style={styles.topic}>
            <Text style={styles.topicText}>{topicLabel(module.topic)}</Text>
          </View>
          <Body muted style={styles.summary}>{module.summary}</Body>
          <Card style={styles.content}>{renderContent(module.content_md)}</Card>
          {module.source_ref ? (
            <View style={styles.sourceRow}>
              <Ionicons name="book-outline" size={14} color={colors.textMuted} />
              <Body muted style={styles.source}>Sumber: {module.source_ref}</Body>
            </View>
          ) : null}
          <Card style={styles.quizInfo}>
            <Text style={styles.quizTitle}>Siap kuis?</Text>
            <Body muted style={styles.small}>
              Soal menyesuaikan jawabanmu. Kalau salah, kamu akan dapat penjelasan. Lulus kuis membuka
              modul berikutnya.
            </Body>
          </Card>
          <Button
            title="Mulai kuis"
            icon="play"
            onPress={() =>
              router.push({ pathname: '/kuis/[moduleId]', params: { moduleId, playerId } })
            }
          />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topic: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentSoft,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: spacing.sm,
  },
  topicText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.accent },
  summary: { marginBottom: spacing.md },
  content: { paddingVertical: spacing.lg },
  contentHeading: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginBottom: spacing.sm },
  contentText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 26,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sourceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  source: { fontSize: 12, marginLeft: 4 },
  quizInfo: { backgroundColor: colors.primarySoft, borderColor: colors.primarySoft },
  quizTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.primaryDark },
  small: { fontSize: 13, lineHeight: 19 },
});
