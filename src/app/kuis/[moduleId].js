import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LearningApi } from '../../services/ApiService';
import { Mascot } from '../../components/illustrations';
import { Body, Button, ErrorState, Loading, ProgressBar, Screen } from '../../components/ui';
import { colors, fonts, radius, spacing } from '../../theme';
import { friendlyError, topicLabel } from '../../utils/labels';

const DIFFICULTY = { 1: 'Mudah', 2: 'Sedang', 3: 'Menantang' };
const LETTERS = ['A', 'B', 'C', 'D'];
const LETTER_COLORS = ['#6EC1F7', '#FF7EA6', '#B38CF5', '#FF9F43'];

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
  const mood = feedback ? (feedback.isCorrect ? 'party' : 'sad') : submitting ? 'think' : 'happy';

  return (
    <Screen edges={['bottom']}>
      <View style={styles.progressHead}>
        <Text style={styles.counter}>Soal {shownNumber}/{total}</Text>
        <View style={styles.levelPill}>
          <Ionicons name="flash" size={13} color={colors.yellowDark} />
          <Text style={styles.level}>{DIFFICULTY[question.difficulty] || ''}</Text>
        </View>
      </View>
      <ProgressBar value={shownNumber - (feedback ? 0 : 1)} max={total} color={colors.yellow} height={16} style={styles.bar} />

      <View style={styles.questionRow}>
        <Mascot size={86} mood={mood} />
        <View style={styles.questionBubble}>
          <View style={styles.bubbleTail} />
          <Text style={styles.topic}>{topicLabel(question.topic)}</Text>
          <Text style={styles.question}>{question.text}</Text>
        </View>
      </View>

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
              feedback && !isCorrect && !isWrongChoice && styles.optionDim,
              pressed && !feedback && styles.optionPressed,
            ]}
          >
            <View
              style={[
                styles.letter,
                { backgroundColor: LETTER_COLORS[index % LETTER_COLORS.length] },
                isCorrect && styles.letterCorrect,
                isWrongChoice && styles.letterWrong,
              ]}
            >
              {isCorrect ? (
                <Ionicons name="checkmark" size={20} color={colors.white} />
              ) : isWrongChoice ? (
                <Ionicons name="close" size={20} color={colors.white} />
              ) : (
                <Text style={styles.letterText}>{LETTERS[index]}</Text>
              )}
            </View>
            <Text style={styles.optionText}>{option}</Text>
          </Pressable>
        );
      })}

      {error ? <Body style={styles.inlineError}>{error}</Body> : null}

      {feedback ? (
        <View style={[styles.feedback, feedback.isCorrect ? styles.feedbackOk : styles.feedbackNo]}>
          <Text style={[styles.feedbackTitle, { color: feedback.isCorrect ? colors.primaryDark : colors.orangeDark }]}>
            {feedback.isCorrect ? 'Benar, hebat!' : 'Belum tepat, tidak apa-apa!'}
          </Text>
          <Body>{feedback.explanation}</Body>
          <Button
            title={pending && pending.finished ? 'Lihat hasil' : 'Lanjut'}
            variant={feedback.isCorrect ? 'primary' : 'yellow'}
            icon={pending && pending.finished ? 'trophy' : 'arrow-forward'}
            onPress={next}
            style={styles.nextButton}
          />
        </View>
      ) : (
        <Body muted style={styles.center}>{submitting ? 'Memeriksa jawaban...' : 'Ketuk satu jawaban.'}</Body>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  counter: { fontFamily: fonts.heading, fontSize: 17, color: colors.text },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.yellowSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  level: { fontFamily: fonts.medium, fontSize: 13, color: colors.yellowDark, marginLeft: 3 },
  bar: { marginBottom: spacing.md },
  questionRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: spacing.md },
  questionBubble: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    borderBottomWidth: 5,
    borderBottomColor: colors.borderStrong,
    padding: spacing.md,
    marginLeft: spacing.sm,
  },
  bubbleTail: {
    position: 'absolute',
    left: -10,
    bottom: 18,
    width: 18,
    height: 18,
    backgroundColor: colors.surface,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.border,
    transform: [{ rotate: '45deg' }],
  },
  topic: { fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted, marginBottom: 2 },
  question: { fontFamily: fonts.heading, fontSize: 21, lineHeight: 28, color: colors.text },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderBottomWidth: 5,
    borderBottomColor: colors.borderStrong,
    borderRadius: radius.md,
    padding: spacing.sm + 4,
    marginBottom: spacing.sm + 2,
  },
  optionPressed: { borderBottomWidth: 2, marginTop: 3 },
  optionChosen: { borderColor: colors.yellow, borderBottomColor: colors.yellowDark },
  optionCorrect: { borderColor: colors.primary, borderBottomColor: colors.primaryDark, backgroundColor: colors.primarySoft },
  optionWrong: { borderColor: colors.danger, borderBottomColor: colors.dangerDark, backgroundColor: colors.dangerSoft },
  optionDim: { opacity: 0.55 },
  letter: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 4,
  },
  letterCorrect: { backgroundColor: colors.primary },
  letterWrong: { backgroundColor: colors.danger },
  letterText: { fontFamily: fonts.display, fontSize: 18, color: colors.white },
  optionText: { flex: 1, fontFamily: fonts.medium, fontSize: 18, color: colors.text, lineHeight: 24 },
  feedback: { borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.xs },
  feedbackOk: { backgroundColor: colors.primarySoft },
  feedbackNo: { backgroundColor: colors.orangeSoft },
  feedbackTitle: { fontFamily: fonts.display, fontSize: 21, marginBottom: 4 },
  nextButton: { marginTop: spacing.md },
  inlineError: { color: colors.danger, marginVertical: spacing.sm },
  center: { textAlign: 'center', marginTop: spacing.sm },
});
