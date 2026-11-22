import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { PlayerApi } from '../../services/ApiService';
import ProgressView from '../../components/ProgressView';
import { Mascot } from '../../components/illustrations';
import { Button, Chip, EmptyState, ErrorState, Hero, Loading, Screen } from '../../components/ui';
import { colors, spacing } from '../../theme';
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

  const selected = players ? players.find((p) => p.id === selectedId) : null;
  const hero = (
    <Hero
      color={colors.pink}
      title="Laporan Progres"
      subtitle={selected ? `Perkembangan ${selected.display_name} hari ini` : 'Pantau perkembangan anak'}
      art={<Mascot size={84} mood="wow" />}
    />
  );

  if (!players || error || players.length === 0) {
    return (
      <Screen hero={hero} topColor={colors.pink}>
        {!players && !error ? <Loading /> : null}
        {error ? <ErrorState message={error} onRetry={load} /> : null}
        {players && players.length === 0 ? (
          <EmptyState
            title="Belum ada data progres"
            message="Tambahkan profil anak terlebih dahulu."
            action={
              <Button title="Tambah profil anak" variant="pink" onPress={() => router.push('/tambah-anak')} style={styles.action} />
            }
          />
        ) : null}
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
          color={colors.pink}
          shadow={colors.pinkDark}
          onPress={() => setSelectedId(player.id)}
        />
      ))}
    </ScrollView>
  );

  return (
    <ProgressView
      key={selectedId}
      playerId={selectedId}
      canCheckMission
      hero={hero}
      topColor={colors.pink}
      edges={['top']}
      header={players.length > 1 ? selector : null}
    />
  );
}

const styles = StyleSheet.create({
  selector: { marginBottom: spacing.sm },
  action: { marginTop: spacing.md, alignSelf: 'stretch' },
});
