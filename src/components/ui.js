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

export function Screen({ children, scroll = true, edges = ['top'], refreshControl, contentStyle }) {
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.screenContent, contentStyle]}
      keyboardShouldPersistTaps="handled"
      refreshControl={refreshControl}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.screenContent, styles.flex, contentStyle]}>{children}</View>
  );
  return (
    <SafeAreaView style={styles.screen} edges={edges}>
      {content}
    </SafeAreaView>
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

export function Card({ children, style, onPress, disabled }) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({ title, onPress, variant = 'primary', loading, disabled, icon, style }) {
  const isDisabled = disabled || loading;
  const variantStyle = {
    primary: styles.buttonPrimary,
    secondary: styles.buttonSecondary,
    ghost: styles.buttonGhost,
    danger: styles.buttonDanger,
    dangerGhost: styles.buttonGhost,
  }[variant];
  const textColor =
    variant === 'primary' || variant === 'danger'
      ? colors.white
      : variant === 'dangerGhost'
        ? colors.danger
        : colors.primaryDark;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        variantStyle,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.row}>
          {icon ? <Ionicons name={icon} size={18} color={textColor} style={styles.buttonIcon} /> : null}
          <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

export function Field({ label, error, hint, secure, style, ...inputProps }) {
  const [hidden, setHidden] = useState(Boolean(secure));
  return (
    <View style={[styles.field, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputWrap, error && styles.inputError]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.locked}
          secureTextEntry={hidden}
          autoCapitalize="none"
          {...inputProps}
        />
        {secure ? (
          <Pressable onPress={() => setHidden((v) => !v)} hitSlop={10} accessibilityLabel="Tampilkan atau sembunyikan">
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

export function Chip({ label, selected, onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected, style]}
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
          {checked ? <Ionicons name="checkmark" size={16} color={colors.white} /> : null}
        </View>
        <Text style={[styles.body, styles.flex]}>{children}</Text>
      </Pressable>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export function Banner({ message, tone = 'danger', style }) {
  if (!message) return null;
  const toneStyle = tone === 'danger' ? styles.bannerDanger : tone === 'info' ? styles.bannerInfo : styles.bannerSuccess;
  return (
    <View style={[styles.banner, toneStyle, style]}>
      <Text style={styles.bannerText}>{message}</Text>
    </View>
  );
}

export function Loading({ label = 'Memuat...' }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Body muted style={styles.centerText}>{label}</Body>
    </View>
  );
}

export function EmptyState({ icon = 'leaf-outline', title, message, action }) {
  return (
    <View style={styles.empty}>
      <Ionicons name={icon} size={40} color={colors.primary} />
      <Subtitle style={styles.centerText}>{title}</Subtitle>
      {message ? <Body muted style={styles.centerText}>{message}</Body> : null}
      {action}
    </View>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <View style={styles.empty}>
      <Ionicons name="cloud-offline-outline" size={40} color={colors.danger} />
      <Body style={styles.centerText}>{message}</Body>
      {onRetry ? <Button title="Coba lagi" variant="secondary" onPress={onRetry} style={styles.retry} /> : null}
    </View>
  );
}

export function ProgressBar({ value, max = 100, color = colors.primary, style }) {
  const ratio = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  return (
    <View style={[styles.track, style]}>
      <View style={[styles.fill, { width: `${ratio * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

export function SectionTitle({ children, style }) {
  return <Text style={[styles.section, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.background },
  screenContent: { padding: spacing.md, paddingBottom: spacing.xl },
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.text, lineHeight: 32 },
  subtitle: { fontFamily: fonts.semibold, fontSize: 17, color: colors.text, lineHeight: 24 },
  body: { fontFamily: fonts.regular, fontSize: 14, color: colors.text, lineHeight: 21 },
  muted: { color: colors.textMuted },
  section: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center' },
  button: {
    minHeight: 50,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  buttonPrimary: { backgroundColor: colors.primary },
  buttonSecondary: { backgroundColor: colors.primarySoft },
  buttonGhost: { backgroundColor: 'transparent' },
  buttonDanger: { backgroundColor: colors.danger },
  buttonText: { fontFamily: fonts.semibold, fontSize: 15 },
  buttonIcon: { marginRight: spacing.sm },
  field: { marginBottom: spacing.md },
  label: { fontFamily: fonts.medium, fontSize: 13, color: colors.text, marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    minHeight: 48,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
  },
  inputError: { borderColor: colors.danger },
  errorText: { fontFamily: fonts.regular, fontSize: 12, color: colors.danger, marginTop: 4 },
  hint: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontFamily: fonts.medium, fontSize: 13, color: colors.text },
  chipTextSelected: { color: colors.white },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start' },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 1,
    backgroundColor: colors.surface,
  },
  checkBoxOn: { backgroundColor: colors.primary },
  banner: { borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  bannerDanger: { backgroundColor: colors.dangerSoft },
  bannerInfo: { backgroundColor: colors.accentSoft },
  bannerSuccess: { backgroundColor: colors.primarySoft },
  bannerText: { fontFamily: fonts.regular, fontSize: 13, color: colors.text, lineHeight: 19 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  centerText: { textAlign: 'center', marginTop: spacing.sm },
  empty: { alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.md },
  retry: { marginTop: spacing.md, alignSelf: 'stretch' },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.lockedSoft, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4 },
});
