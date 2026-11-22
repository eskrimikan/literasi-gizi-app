import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LearningApi } from '../../services/ApiService';
import { Body, Button, Card, ErrorState, Loading, ProgressBar, Screen } from '../../components/ui';
import { colors, fonts, radius, spacing } from '../../theme';
import { friendlyError, topicLabel } from '../../utils/labels';

const DIFFICULTY = { 1: 'Mudah', 2: 'Sedang', 3: 'Menantang' };
const LETTERS = ['A', 'B', 'C', 'D'];

// Kuis adaptif (konteks Jalur Belajar & Kuis).
// Backend memilih tingkat kesulitan soal berikutnya dari jawaban sebelumnya.
export default function QuizScreen() {
  const { moduleId, playerId } = useLocalSearchParams();
  const started = useRef(false);
  const [sessionId, setSessionId] = useState(null);
  const [total, setTotal] = useState(0);
  const [number, setNumber] = useState(1);
  const [question, setQuestion] = useState(null);
  const [chosen, setChosen] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [pending, setPending] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const start = useCallback(async () => {
    try {
      setError(null);
      const data = await LearningApi.startQuiz(moduleId, playerId);
      setSessionId(data.sessionId);
      setTotal(data.totalQuestions);
      setQuestion(data.question);
    } catch (e) {
      setError(friendlyError(e, 'Gagal memulai kuis.'));
    }
  }, [moduleId, playerId]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    start();
  }, [start]);

  const answer = async (index) => {
    if (feedback || submitting) return;
    setChosen(index);
    setSubmitting(true);
    try {
      const res = await LearningApi.answer(sessionId, question.id, index);
      setFeedback({ isCorrect: res.isCorrect, correctIndex: res.correctIndex, explanation: res.explanation });
      setPending(res);
    } catch (e) {
      setChosen(null);
      setError(friendlyError(e, 'Jawaban gagal dikirim.'));
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => {
    if (!pending) return;
    if (pending.finished && pending.result) {
      router.replace({
        pathname: '/hasil',
        params: { result: JSON.stringify(pending.result), playerId, moduleId },
      });
      return;
    }
    if (!pending.nextQuestion) {
      setError('Soal untuk modul ini sudah habis tetapi kuis belum ditutup oleh server. Laporkan ke admin.');
      return;
    }
    setQuestion(pending.nextQuestion);
    setNumber((n) => n + 1);
    setChosen(null);
    setFeedback(null);
    setPending(null);
  };

  if (error && !question) {
    return (
      <Screen edges={['bottom']}>
        <ErrorState message={error} onRetry={error.includes('habis') ? undefined : start} />
        <Button title="Kembali" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  if (!question) return <Loading label="Menyiapkan soal..." />;

  const shownNumber = Math.min(number, total || number);

  return (
    <Screen edges={['bottom']}>
      <View style={styles.progressHead}>
        <Text style={styles.counter}>Soal {shownNumber} dari {total}</Text>
        <Text style={styles.level}>{DIFFICULTY[question.difficulty] || ''}</Text>
      </View>
      <ProgressBar value={shownNumber - (feedback ? 0 : 1)} max={total} style={styles.bar} />

      <Card style={styles.questionCard}>
        <Text style={styles.topic}>{topicLabel(question.topic)}</Text>
        <Text style={styles.question}>{question.text}</Text>
      </Card>

      {question.options.map((option, index) => {
        const isChosen = chosen === index;
        const isCorrect = feedback && feedback.correctIndex === index;
        const isWrongChoice = feedback && isChosen && !feedback.isCorrect;
        return (
          <Pressable
            key={`${question.id}-${index}`}
            onPress={() => answer(index)}
            disabled={Boolean(feedback) || submitting}
            style={({ pressed }) => [
              styles.option,
              isChosen && !feedback && styles.optionChosen,
              isCorrect && styles.optionCorrect,
              isWrongChoice && styles.optionWrong,
              pressed && !feedback && styles.pressed,
            ]}
          >
            <View style={[styles.letter, isCorrect && styles.letterCorrect, isWrongChoice && styles.letterWrong]}>
              <Text style={[styles.letterText, (isCorrect || isWrongChoice) && styles.letterTextOn]}>
                {LETTERS[index]}
              </Text>
            </View>
            <Text style={styles.optionText}>{option}</Text>
            {isCorrect ? <Ionicons name="checkmark-circle" size={22} color={colors.primary} /> : null}
            {isWrongChoice ? <Ionicons name="close-circle" size={22} color={colors.danger} /> : null}
          </Pressable>
        );
      })}

      {error ? <Body style={styles.inlineError}>{error}</Body> : null}

      {feedback ? (
        <Card style={[styles.feedback, feedback.isCorrect ? styles.feedbackOk : styles.feedbackNo]}>
          <Text style={styles.feedbackTitle}>
            {feedback.isCorrect ? 'Benar, hebat!' : 'Belum tepat, tidak apa-apa.'}
          </Text>
          <Body>{feedback.explanation}</Body>
        </Card>
      ) : null}

      {feedback ? (
        <Button
          title={pending && pending.finished ? 'Lihat hasil' : 'Soal berikutnya'}
          icon={pending && pending.finished ? 'trophy-outline' : 'arrow-forward'}
          onPress={next}
        />
      ) : submitting ? (
        <Body muted style={styles.center}>Memeriksa jawaban...</Body>
      ) : (
        <Body muted style={styles.center}>Pilih satu jawaban.</Body>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  counter: { fontFamily: fonts.semibold, fontSize: 13, color: colors.text },
  level: { fontFamily: fonts.medium, fontSize: 12, color: colors.accent },
  bar: { marginBottom: spacing.md },
  questionCard: { paddingVertical: spacing.lg },
  topic: { fontFamily: fonts.medium, fontSize: 12, color: colors.textMuted, marginBottom: spacing.xs },
  question: { fontFamily: fonts.semibold, fontSize: 19, lineHeight: 28, color: colors.text },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  optionChosen: { borderColor: colors.accent },
  optionCorrect: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  optionWrong: { borderColor: colors.danger, backgroundColor: colors.dangerSoft },
  pressed: { opacity: 0.75 },
  letter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.lockedSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  letterCorrect: { backgroundColor: colors.primary },
  letterWrong: { backgroundColor: colors.danger },
  letterText: { fontFamily: fonts.bold, fontSize: 13, color: colors.text },
  letterTextOn: { color: colors.white },
  optionText: { flex: 1, fontFamily: fonts.medium, fontSize: 15, color: colors.text, lineHeight: 22 },
  feedback: { marginTop: spacing.sm },
  feedbackOk: { backgroundColor: colors.primarySoft, borderColor: colors.primarySoft },
  feedbackNo: { backgroundColor: colors.accentSoft, borderColor: colors.accentSoft },
  feedbackTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.text, marginBottom: 4 },
  inlineError: { color: colors.danger, marginVertical: spacing.sm },
  center: { textAlign: 'center', marginTop: spacing.sm },
});
