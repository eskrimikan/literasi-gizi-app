import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, PARTNER_APIS } from '../../services/config';
import { Mascot } from '../../components/illustrations';
import { Body, Button, Card, Hero, Screen, SectionTitle } from '../../components/ui';
import { colors, fonts, spacing } from '../../theme';
import { confirmAction } from '../../utils/dialog';

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

  const hero = (
    <Hero color={colors.pink} title="Akun Saya" subtitle={session?.user?.email} art={<Mascot size={80} mood="happy" />} />
  );

  return (
    <Screen hero={hero} topColor={colors.pink}>
      <Card>
        <View style={styles.row}>
          <View style={[styles.iconBox, { backgroundColor: colors.pinkSoft }]}>
            <Ionicons name="mail" size={20} color={colors.pinkDark} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{session?.user?.email}</Text>
          </View>
        </View>
        <View style={[styles.row, styles.gap]}>
          <View style={[styles.iconBox, { backgroundColor: colors.yellowSoft }]}>
            <Ionicons name="shield-checkmark" size={20} color={colors.yellowDark} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.label}>Peran</Text>
            <Text style={styles.value}>Orang tua (pengelola akun anak)</Text>
          </View>
        </View>
      </Card>

      <SectionTitle icon="lock-closed" iconColor={colors.primary}>Privasi data anak</SectionTitle>
      <Card tone={{ bg: colors.primarySoft, border: colors.primarySoft, shadow: '#C7E8B8' }}>
        <Body>
          Data anak hanya bisa dilihat akun orang tua yang membuat profilnya. Tidak ada papan
          peringkat antaranak. Semua data saat pengembangan adalah data uji.
        </Body>
      </Card>

      <SectionTitle icon="git-network" iconColor={colors.sky}>Layanan terhubung</SectionTitle>
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

      <Button title="Keluar" variant="danger" icon="log-out" onPress={confirmSignOut} style={styles.logout} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  gap: { marginTop: spacing.md },
  iconBox: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm + 4 },
  label: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
  value: { fontFamily: fonts.heading, fontSize: 16, color: colors.text },
  serviceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: spacing.sm + 2 },
  dotOn: { backgroundColor: colors.primary },
  dotOff: { backgroundColor: colors.locked },
  serviceName: { fontFamily: fonts.heading, fontSize: 15, color: colors.text },
  small: { fontSize: 13, lineHeight: 18 },
  logout: { marginTop: spacing.lg },
});
