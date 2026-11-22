import { StyleSheet, Text, View } from 'react-native';
import { confirmAction } from '../../utils/dialog';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, PARTNER_APIS } from '../../services/config';
import { Body, Button, Card, Screen, SectionTitle } from '../../components/ui';
import { colors, fonts, spacing } from '../../theme';

export default function AccountScreen() {
  const { session, signOut } = useAuth();

  const confirmSignOut = () => {
    confirmAction({
      title: 'Keluar',
      message: 'Yakin ingin keluar dari akun ini?',
      confirmText: 'Keluar',
      destructive: true,
      onConfirm: signOut,
    });
  };

  return (
    <Screen edges={[]}>
      <Card>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{session?.user?.email}</Text>
        <Text style={[styles.label, styles.gap]}>Peran</Text>
        <Text style={styles.value}>Orang tua</Text>
      </Card>

      <SectionTitle>Privasi data anak</SectionTitle>
      <Card>
        <Body muted>
          Data anak hanya bisa dilihat oleh akun orang tua yang membuat profilnya. Tidak ada papan
          peringkat antaranak. Semua data saat pengembangan adalah data uji.
        </Body>
      </Card>

      <SectionTitle>Layanan terhubung</SectionTitle>
      <Card>
        <View style={styles.serviceRow}>
          <View style={[styles.dot, styles.dotOn]} />
          <View style={styles.flex}>
            <Text style={styles.serviceName}>LiterasiGizi API</Text>
            <Body muted style={styles.small}>{API_BASE_URL}</Body>
          </View>
        </View>
        {Object.values(PARTNER_APIS).map((partner) => (
          <View key={partner.name} style={styles.serviceRow}>
            <View style={[styles.dot, partner.enabled ? styles.dotOn : styles.dotOff]} />
            <View style={styles.flex}>
              <Text style={styles.serviceName}>{partner.name}</Text>
              <Body muted style={styles.small}>
                {partner.enabled ? partner.baseUrl : 'Belum dihubungkan (integrasi antarkelompok)'}
              </Body>
            </View>
          </View>
        ))}
      </Card>

      <Button title="Keluar" variant="danger" icon="log-out-outline" onPress={confirmSignOut} style={styles.logout} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  label: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  value: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  gap: { marginTop: spacing.sm },
  serviceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.sm },
  dotOn: { backgroundColor: colors.primary },
  dotOff: { backgroundColor: colors.locked },
  serviceName: { fontFamily: fonts.medium, fontSize: 14, color: colors.text },
  small: { fontSize: 12, lineHeight: 18 },
  logout: { marginTop: spacing.lg },
});
