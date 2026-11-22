import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { PlayerApi } from '../../services/ApiService';
import PathView from '../../components/PathView';
import { FruitAvatar } from '../../components/illustrations';
import { Button, Card, Tag } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { colors, fonts, spacing } from '../../theme';
import { confirmAction, notify } from '../../utils/dialog';
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
      <View style={styles.row}>
        <FruitAvatar name={player.display_name} size={56} />
        <View style={styles.info}>
          <Text style={styles.name}>{player.display_name}</Text>
          <View style={styles.tags}>
            <Tag label={`Kelas ${player.grade}`} color={colors.primaryDark} bg={colors.primarySoft} icon="school" />
            <Tag label={`${player.daily_limit_minutes} menit/hari`} color={colors.skyDark} bg={colors.skySoft} icon="time" />
          </View>
        </View>
      </View>
      {session?.role === 'parent' ? (
        <Button
          title="Hapus profil"
          variant="dangerGhost"
          icon="trash-outline"
          onPress={confirmDelete}
          style={styles.delete}
        />
      ) : null}
    </Card>
  ) : null;

  return (
    <>
      <Stack.Screen options={{ title: player ? `Peta ${player.display_name}` : 'Jalur Belajar' }} />
      <PathView playerId={playerId} header={header} />
    </>
  );
}

const styles = StyleSheet.create({
  header: {},
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, marginLeft: spacing.md },
  name: { fontFamily: fonts.heading, fontSize: 20, color: colors.text },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  delete: { alignSelf: 'flex-end', marginTop: spacing.xs, paddingHorizontal: 0 },
});
