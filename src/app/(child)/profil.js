import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { FruitAvatar } from '../../components/illustrations';
import { Body, Button, Card, Hero, Screen } from '../../components/ui';
import { colors, fonts, spacing } from '../../theme';
import { confirmAction } from '../../utils/dialog';

export default function ChildProfileScreen() {
  const { session, signOut } = useAuth();
  if (!session?.player) return null;
  const player = session.player;

  const confirmSignOut = () => {
    confirmAction({
      title: 'Keluar',
      message: 'Sudah selesai belajar hari ini?',
      confirmText: 'Keluar',
      cancelText: 'Belum',
      destructive: true,
      onConfirm: signOut,
    });
  };

  const hero = (
    <Hero color={colors.primary} compact>
      <View style={styles.hero}>
        <View style={styles.avatarRing}>
          <FruitAvatar name={player.display_name} size={96} />
        </View>
        <Text style={styles.name}>{player.display_name}</Text>
        <Text style={styles.username}>@{player.username}</Text>
      </View>
    </Hero>
  );

  return (
    <Screen hero={hero} topColor={colors.primary}>
      <View style={styles.stats}>
        <Card style={styles.stat} tone={{ bg: colors.yellowSoft, border: colors.yellowSoft, shadow: '#F5DC94' }}>
          <Ionicons name="school" size={26} color={colors.yellowDark} />
          <Text style={styles.statValue}>Kelas {player.grade}</Text>
          <Text style={styles.statLabel}>jenjang</Text>
        </Card>
        <Card style={styles.stat} tone={{ bg: colors.skySoft, border: colors.skySoft, shadow: '#B9DDF5' }}>
          <Ionicons name="time" size={26} color={colors.skyDark} />
          <Text style={styles.statValue}>{player.daily_limit_minutes} menit</Text>
          <Text style={styles.statLabel}>belajar per hari</Text>
        </Card>
      </View>
      <Body muted style={styles.note}>Batas waktu belajar diatur oleh orang tuamu, supaya kamu tetap punya waktu bermain.</Body>
      <Button title="Keluar" variant="secondary" icon="log-out" onPress={confirmSignOut} style={styles.logout} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingBottom: spacing.sm },
  avatarRing: { backgroundColor: colors.white, borderRadius: 60, padding: 8 },
  name: { fontFamily: fonts.display, fontSize: 28, color: colors.white, marginTop: spacing.sm },
  username: { fontFamily: fonts.medium, fontSize: 15, color: 'rgba(255,255,255,0.9)' },
  stats: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { width: '48%', alignItems: 'center' },
  statValue: { fontFamily: fonts.heading, fontSize: 19, color: colors.text, marginTop: 4 },
  statLabel: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
  note: { textAlign: 'center', marginTop: spacing.sm },
  logout: { marginTop: spacing.lg },
});
