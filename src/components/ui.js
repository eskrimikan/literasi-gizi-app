import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, fonts, radius, spacing } from '../theme';
import { Mascot, Sparkle, Wave } from './illustrations';

// topColor: warna area status bar (samakan dengan warna Hero di bagian atas).
export function Screen({ children, scroll = true, edges = ['top'], refreshControl, contentStyle, hero, topColor }) {
  const inner = (
    <>
      {hero}
      <View style={[styles.screenContent, contentStyle]}>{children}</View>
    </>
  );
  return (
    <SafeAreaView style={[styles.screen, topColor && { backgroundColor: topColor }]} edges={edges}>
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          refreshControl={refreshControl}
          style={styles.scrollView}
          contentContainerStyle={styles.scroll}
        >
          {inner}
        </ScrollView>
      ) : (
        <View style={[styles.flex, styles.scrollView]}>{inner}</View>
      )}
    </SafeAreaView>
  );
}

// Area atas berwarna dengan tepi bergelombang, judul, dan ilustrasi di kanan.
export function Hero({ title, subtitle, color = colors.primary, art, children, compact }) {
  return (
    <View>
      <View style={[styles.hero, { backgroundColor: color }, compact && styles.heroCompact]}>
        <View style={styles.heroSparkleA}>
          <Sparkle size={16} color="rgba(255,255,255,0.7)" />
        </View>
        <View style={styles.heroSparkleB}>
          <Sparkle size={11} color="rgba(255,255,255,0.55)" />
        </View>
        <View style={styles.heroRow}>
          <View style={styles.flex}>
            {title ? <Text style={styles.heroTitle}>{title}</Text> : null}
            {subtitle ? <Text style={styles.heroSubtitle}>{subtitle}</Text> : null}
          </View>
          {art ? <View style={styles.heroArt}>{art}</View> : null}
        </View>
        {children}
      </View>
      <Wave color={color} />
    </View>
  );
}

export function Title({ children, style }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function Subtitle({ children, style }) {
  return <Text style={[styles.subtitle, style]}>{children}</Text>;
}

export function Body({ children, style, muted, numberOfLines }) {
  return (
    <Text style={[styles.body, muted && styles.muted, style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
}

// Kartu "chunky": sudut bulat, garis tepi tebal, bayangan tebal di bawah.
export function Card({ children, style, onPress, disabled, tone }) {
  const toneStyle = tone ? { backgroundColor: tone.bg, borderColor: tone.border || tone.bg, borderBottomColor: tone.shadow || tone.border || tone.bg } : null;
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [styles.card, toneStyle, pressed && styles.cardPressed, style]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, toneStyle, style]}>{children}</View>;
}

const BUTTON_TONES = {
  primary: { bg: colors.primary, shadow: colors.primaryDark, text: colors.white },
  pink: { bg: colors.pink, shadow: colors.pinkDark, text: colors.white },
  yellow: { bg: colors.yellow, shadow: colors.yellowDark, text: colors.text },
  secondary: { bg: colors.surface, shadow: colors.borderStrong, text: colors.primaryDark, border: colors.border },
  danger: { bg: colors.danger, shadow: colors.dangerDark, text: colors.white },
  ghost: { bg: 'transparent', shadow: 'transparent', text: colors.primaryDark, flat: true },
  dangerGhost: { bg: 'transparent', shadow: 'transparent', text: colors.danger, flat: true },
};

// Tombol yang terasa bisa ditekan: bayangan bawah menipis saat ditekan.
export function Button({ title, onPress, variant = 'primary', loading, disabled, icon, style }) {
  const tone = BUTTON_TONES[variant] || BUTTON_TONES.primary;
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: tone.bg,
          borderBottomColor: tone.shadow,
          borderColor: tone.border || tone.bg,
          borderTopWidth: tone.border ? 2 : 0,
          borderLeftWidth: tone.border ? 2 : 0,
          borderRightWidth: tone.border ? 2 : 0,
        },
        tone.flat ? styles.buttonFlat : pressed && !isDisabled ? styles.buttonPressed : null,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={tone.text} />
      ) : (
        <View style={styles.row}>
          {icon ? <Ionicons name={icon} size={20} color={tone.text} style={styles.buttonIcon} /> : null}
          <Text style={[styles.buttonText, { color: tone.text }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

export function Field({ label, error, hint, secure, style, icon, ...inputProps }) {
  const [hidden, setHidden] = useState(Boolean(secure));
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.field, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputWrap, focused && styles.inputFocused, error && styles.inputError]}>
        {icon ? <Ionicons name={icon} size={20} color={colors.textMuted} style={styles.inputIcon} /> : null}
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.locked}
          secureTextEntry={hidden}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...inputProps}
        />
        {secure ? (
          <Pressable onPress={() => setHidden((v) => !v)} hitSlop={10} accessibilityLabel="Tampilkan atau sembunyikan">
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={22} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

export function Chip({ label, selected, onPress, style, color = colors.primary, shadow = colors.primaryDark }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        selected && { backgroundColor: color, borderColor: color, borderBottomColor: shadow },
        style,
      ]}
      accessibilityState={{ selected }}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function Checkbox({ checked, onChange, children, error }) {
  return (
    <View style={styles.field}>
      <Pressable onPress={() => onChange(!checked)} style={styles.checkRow} accessibilityRole="checkbox" accessibilityState={{ checked }}>
        <View style={[styles.checkBox, checked && styles.checkBoxOn, error && styles.inputError]}>
          {checked ? <Ionicons name="checkmark" size={18} color={colors.white} /> : null}
        </View>
        <Text style={[styles.body, styles.flex]}>{children}</Text>
      </Pressable>
      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

export function Banner({ message, tone = 'danger', style }) {
  if (!message) return null;
  const toneStyle = tone === 'danger' ? styles.bannerDanger : tone === 'info' ? styles.bannerInfo : styles.bannerSuccess;
  const icon = tone === 'danger' ? 'alert-circle' : tone === 'info' ? 'information-circle' : 'checkmark-circle';
  const iconColor = tone === 'danger' ? colors.danger : tone === 'info' ? colors.yellowDark : colors.primaryDark;
  return (
    <View style={[styles.banner, toneStyle, style]}>
      <Ionicons name={icon} size={20} color={iconColor} />
      <Text style={styles.bannerText}>{message}</Text>
    </View>
  );
}

export function Loading({ label = 'Sebentar ya...' }) {
  return (
    <View style={styles.center}>
      <Mascot size={96} mood="think" />
      <View style={styles.loadingRow}>
        <ActivityIndicator color={colors.primary} />
        <Body muted style={styles.loadingText}>{label}</Body>
      </View>
    </View>
  );
}

export function EmptyState({ title, message, action, mood = 'wow' }) {
  return (
    <View style={styles.empty}>
      <Mascot size={110} mood={mood} />
      <Subtitle style={styles.centerText}>{title}</Subtitle>
      {message ? <Body muted style={styles.centerText}>{message}</Body> : null}
      {action}
    </View>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <View style={styles.empty}>
      <Mascot size={100} mood="sad" />
      <Body style={styles.centerText}>{message}</Body>
      {onRetry ? <Button title="Coba lagi" variant="secondary" icon="refresh" onPress={onRetry} style={styles.retry} /> : null}
    </View>
  );
}

export function ProgressBar({ value, max = 100, color = colors.primary, style, height = 14 }) {
  const ratio = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }, style]}>
      <View style={[styles.fill, { width: `${ratio * 100}%`, backgroundColor: color, borderRadius: height / 2 }]}>
        {ratio > 0.08 ? <View style={[styles.fillShine, { borderRadius: height / 2 }]} /> : null}
      </View>
    </View>
  );
}

export function SectionTitle({ children, style, icon, iconColor = colors.orange }) {
  return (
    <View style={[styles.sectionRow, style]}>
      {icon ? <Ionicons name={icon} size={20} color={iconColor} style={styles.sectionIcon} /> : null}
      <Text style={styles.section}>{children}</Text>
    </View>
  );
}

export function Tag({ label, color = colors.orange, bg = colors.orangeSoft, icon }) {
  return (
    <View style={[styles.tag, { backgroundColor: bg }]}>
      {icon ? <Ionicons name={icon} size={13} color={color} style={styles.tagIcon} /> : null}
      <Text style={[styles.tagText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1 },
  scrollView: { backgroundColor: colors.background },
  screenContent: { padding: spacing.md, paddingBottom: spacing.xl },
  hero: {
    paddingHorizontal: spacing.md + 4,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    overflow: 'hidden',
  },
  heroCompact: { paddingTop: spacing.sm },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  heroTitle: { fontFamily: fonts.display, fontSize: 27, lineHeight: 34, color: colors.white },
  heroSubtitle: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 21, color: 'rgba(255,255,255,0.95)', marginTop: 2 },
  heroArt: { marginLeft: spacing.sm },
  heroSparkleA: { position: 'absolute', top: 14, right: 130 },
  heroSparkleB: { position: 'absolute', bottom: 16, right: 120 },
  title: { fontFamily: fonts.display, fontSize: 28, color: colors.text, lineHeight: 36 },
  subtitle: { fontFamily: fonts.heading, fontSize: 19, color: colors.text, lineHeight: 26 },
  body: { fontFamily: fonts.regular, fontSize: 15, color: colors.text, lineHeight: 22 },
  muted: { color: colors.textMuted },
  sectionRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.sm },
  sectionIcon: { marginRight: 6 },
  section: { fontFamily: fonts.heading, fontSize: 19, color: colors.text },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    borderBottomWidth: 5,
    borderBottomColor: colors.borderStrong,
    padding: spacing.md,
    marginBottom: spacing.sm + 4,
  },
  cardPressed: { borderBottomWidth: 2, marginTop: 3 },
  disabled: { opacity: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center' },
  button: {
    minHeight: 54,
    borderRadius: radius.md,
    borderBottomWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  buttonPressed: { borderBottomWidth: 2, marginTop: 3 },
  buttonFlat: { borderBottomWidth: 0, minHeight: 44 },
  buttonText: { fontFamily: fonts.heading, fontSize: 17, letterSpacing: 0.2 },
  buttonIcon: { marginRight: spacing.sm },
  field: { marginBottom: spacing.md },
  label: { fontFamily: fonts.heading, fontSize: 15, color: colors.text, marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  inputFocused: { borderColor: colors.primary },
  inputError: { borderColor: colors.danger },
  inputIcon: { marginRight: spacing.sm },
  input: { flex: 1, minHeight: 52, fontFamily: fonts.regular, fontSize: 16, color: colors.text },
  errorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  errorText: { fontFamily: fonts.regular, fontSize: 13, color: colors.danger, marginLeft: 4, flex: 1 },
  hint: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginTop: 5 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.border,
    borderBottomWidth: 4,
    borderBottomColor: colors.borderStrong,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipText: { fontFamily: fonts.medium, fontSize: 15, color: colors.text },
  chipTextSelected: { color: colors.white },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start' },
  checkBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 2,
    marginTop: 1,
    backgroundColor: colors.surface,
  },
  checkBoxOn: { backgroundColor: colors.primary },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  bannerDanger: { backgroundColor: colors.dangerSoft },
  bannerInfo: { backgroundColor: colors.yellowSoft },
  bannerSuccess: { backgroundColor: colors.primarySoft },
  bannerText: { fontFamily: fonts.regular, fontSize: 14, color: colors.text, lineHeight: 20, marginLeft: spacing.sm, flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, minHeight: 320 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  loadingText: { marginLeft: spacing.sm },
  centerText: { textAlign: 'center', marginTop: spacing.sm },
  empty: { alignItems: 'center', paddingVertical: spacing.lg, paddingHorizontal: spacing.md },
  retry: { marginTop: spacing.md, alignSelf: 'stretch' },
  track: { backgroundColor: colors.lockedSoft, overflow: 'hidden' },
  fill: { height: '100%', justifyContent: 'flex-start' },
  fillShine: { height: '35%', marginHorizontal: 6, marginTop: 3, backgroundColor: 'rgba(255,255,255,0.4)' },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagIcon: { marginRight: 4 },
  tagText: { fontFamily: fonts.medium, fontSize: 13 },
});
