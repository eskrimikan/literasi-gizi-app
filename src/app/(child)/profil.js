import { StyleSheet, Text, View } from 'react-native';
import { confirmAction } from '../../utils/dialog';
import { useAuth } from '../../context/AuthContext';
import { Body, Button, Card, Screen } from '../../components/ui';
import { colors, fonts, spacing } from '../../theme';

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

  return (
    <Screen edges={[]}>
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{player.display_name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{player.display_name}</Text>
        <Body muted>@{player.username}</Body>
      </View>
      <Card>
        <Text style={styles.label}>Kelas</Text>
        <Text style={styles.value}>Kelas {player.grade}</Text>
        <Text style={[styles.label, styles.gap]}>Waktu belajar per hari</Text>
        <Text style={styles.value}>{player.daily_limit_minutes} menit</Text>
        <Body muted style={styles.note}>Batas waktu ini diatur oleh orang tuamu.</Body>
      </Card>
      <Button title="Keluar" variant="secondary" icon="log-out-outline" onPress={confirmSignOut} style={styles.logout} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginVertical: spacing.md },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: { fontFamily: fonts.bold, fontSize: 32, color: colors.white },
  name: { fontFamily: fonts.bold, fontSize: 22, color: colors.text },
  label: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  value: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  gap: { marginTop: spacing.sm },
  note: { fontSize: 12, marginTop: spacing.sm },
  logout: { marginTop: spacing.lg },
});
