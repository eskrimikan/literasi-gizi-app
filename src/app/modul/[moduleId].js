import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ContentApi } from '../../services/ApiService';
import { Mascot, TopicSticker } from '../../components/illustrations';
import { Body, Button, Card, ErrorState, Loading, Screen } from '../../components/ui';
import { colors, fonts, radius, spacing, topicColors } from '../../theme';
import { friendlyError, topicLabel } from '../../utils/labels';

// Mengubah teks materi (markdown sederhana dari backend) menjadi blok teks.
// Judul pertama dilewati karena sudah tampil di bagian atas.
function renderContent(markdown) {
  if (!markdown) return null;
  return markdown
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter((block) => block && !block.startsWith('# '))
    .map((block, index) =>
      block.startsWith('#') ? (
        <Text key={index} style={styles.contentHeading}>
          {block.replace(/^#+\s*/, '')}
        </Text>
      ) : (
        <Text key={index} style={styles.contentText}>
          {block.replace(/\n/g, ' ')}
        </Text>
      )
    );
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

  if (!module && !error) return <Loading label="Membuka materi..." />;

  const tone = module ? topicColors[module.topic] || topicColors.jajanan : topicColors.jajanan;

  return (
    <Screen edges={['bottom']}>
      <Stack.Screen options={{ title: 'Materi' }} />
      {error ? <ErrorState message={error} onRetry={load} /> : null}
      {module ? (
        <>
          <View style={[styles.cover, { backgroundColor: tone.bg, borderBottomColor: tone.main }]}>
            <TopicSticker topic={module.topic} size={110} />
            <View style={[styles.topicPill, { backgroundColor: tone.main }]}>
              <Text style={styles.topicText}>{topicLabel(module.topic)}</Text>
            </View>
            <Text style={styles.title}>{module.title}</Text>
            <Body style={styles.summary}>{module.summary}</Body>
          </View>

          <Card style={styles.content}>
            <View style={styles.readRow}>
              <Ionicons name="book" size={20} color={tone.dark} />
              <Text style={[styles.readLabel, { color: tone.dark }]}>Yuk baca dulu</Text>
            </View>
            {renderContent(module.content_md)}
            {module.source_ref ? <Body muted style={styles.source}>Sumber: {module.source_ref}</Body> : null}
          </Card>

          <View style={styles.tipRow}>
            <Mascot size={74} mood="happy" />
            <View style={styles.tipBubble}>
              <Text style={styles.tipText}>
                Soal kuis menyesuaikan jawabanmu. Kalau salah, aku kasih penjelasannya. Lulus kuis membuka modul berikutnya!
              </Text>
            </View>
          </View>

          <Button
            title="Ayo kuis!"
            icon="play"
            onPress={() => router.push({ pathname: '/kuis/[moduleId]', params: { moduleId, playerId } })}
          />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  cover: {
    alignItems: 'center',
    borderRadius: radius.xl,
    borderBottomWidth: 6,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  topicPill: { borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 4, marginTop: spacing.sm },
  topicText: { fontFamily: fonts.heading, fontSize: 14, color: colors.white },
  title: { fontFamily: fonts.display, fontSize: 26, lineHeight: 32, color: colors.text, textAlign: 'center', marginTop: spacing.sm },
  summary: { textAlign: 'center', marginTop: 4 },
  content: { padding: spacing.lg },
  readRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  readLabel: { fontFamily: fonts.heading, fontSize: 16, marginLeft: 6 },
  contentHeading: { fontFamily: fonts.heading, fontSize: 20, color: colors.text, marginBottom: spacing.sm },
  contentText: { fontFamily: fonts.regular, fontSize: 18, lineHeight: 28, color: colors.text, marginBottom: spacing.sm },
  source: { fontSize: 13, marginTop: spacing.xs },
  tipRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.sm },
  tipBubble: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.sm + 4,
    marginLeft: spacing.xs,
  },
  tipText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.text },
});
