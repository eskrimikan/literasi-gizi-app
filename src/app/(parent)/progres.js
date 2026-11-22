import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { PlayerApi } from '../../services/ApiService';
import ProgressView from '../../components/ProgressView';
import { Button, Chip, EmptyState, ErrorState, Loading, Screen } from '../../components/ui';
import { spacing } from '../../theme';
import { friendlyError } from '../../utils/labels';

// Laporan progres untuk orang tua: pilih anak, lalu lihat poin, misi, dan lencana.
export default function ParentProgressScreen() {
  const [players, setPlayers] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const list = await PlayerApi.list();
      setPlayers(list);
      setSelectedId((current) =>
        current && list.some((p) => p.id === current) ? current : list[0] ? list[0].id : null
      );
    } catch (e) {
      setError(friendlyError(e, 'Gagal memuat profil anak.'));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (!players && !error) return <Loading />;

  if (error) {
    return (
      <Screen edges={[]}>
        <ErrorState message={error} onRetry={load} />
      </Screen>
    );
  }

  if (players.length === 0) {
    return (
      <Screen edges={[]}>
        <EmptyState
          icon="stats-chart-outline"
          title="Belum ada data progres"
          message="Tambahkan profil anak terlebih dahulu."
          action={
            <Button title="Tambah profil anak" onPress={() => router.push('/tambah-anak')} style={styles.action} />
          }
        />
      </Screen>
    );
  }

  const selector = (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selector}>
      {players.map((player) => (
        <Chip
          key={player.id}
          label={player.display_name}
          selected={player.id === selectedId}
          onPress={() => setSelectedId(player.id)}
        />
      ))}
    </ScrollView>
  );

  return <ProgressView key={selectedId} playerId={selectedId} canCheckMission header={selector} />;
}

const styles = StyleSheet.create({
  selector: { marginBottom: spacing.sm },
  action: { marginTop: spacing.md, alignSelf: 'stretch' },
});
