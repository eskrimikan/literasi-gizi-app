import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import { PlayerApi } from '../services/ApiService';
import { FruitAvatar } from '../components/illustrations';
import { Banner, Body, Button, Card, Chip, Field, Screen } from '../components/ui';
import { colors, fonts, spacing } from '../theme';
import { friendlyError } from '../utils/labels';
import { hasErrors, validateChild } from '../utils/validation';

const GRADES = [1, 2, 3, 4, 5, 6];
const LIMITS = [10, 15, 20, 30];

// Form tambah profil anak (konteks Profil Keluarga & Pemain).
export default function AddChildScreen() {
  const [form, setForm] = useState({
    displayName: '',
    username: '',
    pin: '',
    confirmPin: '',
    grade: null,
    dailyLimit: '15',
    shareProgress: false,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async () => {
    const found = validateChild(form);
    setErrors(found);
    setServerError('');
    if (hasErrors(found)) return;
    setLoading(true);
    try {
      await PlayerApi.create({
        display_name: form.displayName.trim(),
        username: form.username,
        pin: form.pin,
        grade: form.grade,
        daily_limit_minutes: Number(form.dailyLimit),
        share_progress: form.shareProgress,
      });
      router.back();
    } catch (e) {
      if (e.code === 'CONFLICT') setErrors((prev) => ({ ...prev, username: e.message }));
      setServerError(friendlyError(e, 'Gagal menyimpan profil anak.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen edges={['bottom']}>
        <View style={styles.preview}>
          <FruitAvatar name={form.displayName || '?'} size={84} />
          <Text style={styles.previewName}>{form.displayName.trim() || 'Nama anak'}</Text>
          <Body muted>{form.grade ? `Kelas ${form.grade}` : 'Pilih kelas di bawah'}</Body>
        </View>
        <Card>
        <Banner message={serverError} />
        <Field
          label="Nama panggilan anak"
          value={form.displayName}
          onChangeText={update('displayName')}
          autoCapitalize="words"
          placeholder="contoh: Budi"
          maxLength={50}
          error={errors.displayName}
        />
        <Field
          label="Nama pengguna (untuk login anak)"
          value={form.username}
          onChangeText={(v) => update('username')(v.toLowerCase())}
          autoCorrect={false}
          placeholder="contoh: budi_kecil"
          maxLength={20}
          error={errors.username}
          hint="Huruf kecil, angka, atau garis bawah. 3-20 karakter."
        />
        <Field
          label="PIN anak"
          value={form.pin}
          onChangeText={(v) => update('pin')(v.replace(/\D/g, ''))}
          secure
          keyboardType="number-pad"
          maxLength={6}
          placeholder="4-6 angka"
          error={errors.pin}
        />
        <Field
          label="Ulangi PIN"
          value={form.confirmPin}
          onChangeText={(v) => update('confirmPin')(v.replace(/\D/g, ''))}
          secure
          keyboardType="number-pad"
          maxLength={6}
          placeholder="Ketik ulang PIN"
          error={errors.confirmPin}
        />

        <Text style={styles.label}>Kelas</Text>
        <View style={styles.chips}>
          {GRADES.map((grade) => (
            <Chip
              key={grade}
              label={`Kelas ${grade}`}
              selected={form.grade === grade}
              onPress={() => update('grade')(grade)}
            />
          ))}
        </View>
        {errors.grade ? <Text style={styles.error}>{errors.grade}</Text> : null}
        <Body muted style={styles.hint}>Urutan modul disesuaikan dengan jenjang kelas.</Body>

        <Text style={[styles.label, styles.gap]}>Batas waktu belajar per hari</Text>
        <View style={styles.chips}>
          {LIMITS.map((limit) => (
            <Chip
              key={limit}
              label={`${limit} menit`}
              selected={form.dailyLimit === String(limit)}
              onPress={() => update('dailyLimit')(String(limit))}
            />
          ))}
        </View>
        <Field
          value={form.dailyLimit}
          onChangeText={(v) => update('dailyLimit')(v.replace(/\D/g, ''))}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="5-60"
          error={errors.dailyLimit}
          hint="Atau ketik sendiri, 5 sampai 60 menit."
        />

        <View style={styles.switchRow}>
          <View style={styles.flex}>
            <Text style={styles.switchLabel}>Bagikan ringkasan progres</Text>
            <Body muted style={styles.hint}>
              Izinkan layanan mitra yang terhubung membaca ringkasan progres anak (tanpa data keluarga).
            </Body>
          </View>
          <Switch
            value={form.shareProgress}
            onValueChange={update('shareProgress')}
            trackColor={{ true: colors.primary, false: colors.border }}
          />
        </View>

        <Button title="Simpan profil anak" variant="pink" icon="checkmark-circle" onPress={submit} loading={loading} style={styles.gap} />
        </Card>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  preview: { alignItems: 'center', marginBottom: spacing.md },
  previewName: { fontFamily: fonts.display, fontSize: 24, color: colors.text, marginTop: spacing.xs },
  label: { fontFamily: fonts.heading, fontSize: 15, color: colors.text, marginBottom: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  error: { fontFamily: fonts.regular, fontSize: 12, color: colors.danger },
  hint: { fontSize: 13, lineHeight: 18 },
  gap: { marginTop: spacing.md },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  switchLabel: { fontFamily: fonts.heading, fontSize: 15, color: colors.text },
});
