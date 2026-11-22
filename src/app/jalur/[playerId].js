import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { confirmAction, notify } from '../../utils/dialog';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { PlayerApi } from '../../services/ApiService';
import PathView from '../../components/PathView';
import { Button, Card } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { colors, fonts, spacing } from '../../theme';
import { friendlyError } from '../../utils/labels';

// Jalur belajar satu anak, dibuka orang tua dari tab Anak.
export default function PlayerPathScreen() {
  const { playerId } = useLocalSearchParams();
  const { session } = useAuth();
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    PlayerApi.get(playerId).then(setPlayer).catch(() => setPlayer(null));
  }, [playerId]);

  const confirmDelete = () => {
    confirmAction({
      title: 'Hapus profil anak',
      message: `Profil ${player ? player.display_name : 'anak'} beserta seluruh progres belajarnya akan dihapus permanen.`,
      confirmText: 'Hapus',
      destructive: true,
      onConfirm: async () => {
        try {
          await PlayerApi.remove(playerId);
          router.back();
        } catch (e) {
          notify('Gagal', friendlyError(e));
        }
      },
    });
  };

  const header = player ? (
    <Card style={styles.header}>
      <Text style={styles.name}>{player.display_name}</Text>
      <Text style={styles.meta}>
        Kelas {player.grade} · @{player.username} · {player.daily_limit_minutes} menit/hari
      </Text>
      {session?.role === 'parent' ? (
        <View style={styles.actions}>
          <Button
            title="Hapus profil"
            variant="dangerGhost"
            icon="trash-outline"
            onPress={confirmDelete}
            style={styles.delete}
          />
        </View>
      ) : null}
    </Card>
  ) : null;

  return (
    <>
      <Stack.Screen options={{ title: player ? `Jalur ${player.display_name}` : 'Jalur Belajar' }} />
      <PathView playerId={playerId} header={header} />
    </>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.primarySoft, borderColor: colors.primarySoft },
  name: { fontFamily: fonts.bold, fontSize: 18, color: colors.primaryDark },
  meta: { fontFamily: fonts.regular, fontSize: 12, color: colors.text, marginTop: 2 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: spacing.xs },
  delete: { minHeight: 36, paddingHorizontal: 0 },
});
