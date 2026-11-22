import { useCallback, useState } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PlayerApi } from '../../services/ApiService';
import { Body, Button, Card, EmptyState, ErrorState, Loading, Screen } from '../../components/ui';
import { colors, fonts, spacing } from '../../theme';
import { friendlyError } from '../../utils/labels';

// Daftar profil anak milik orang tua yang sedang login.
export default function ChildrenScreen() {
  const [players, setPlayers] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      setPlayers(await PlayerApi.list());
    } catch (e) {
      setError(friendlyError(e, 'Gagal memuat profil anak.'));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (!players && !error) return <Loading label="Memuat profil anak..." />;

  return (
    <Screen edges={[]} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {error ? <ErrorState message={error} onRetry={load} /> : null}

      {players && players.length === 0 ? (
        <EmptyState
          icon="happy-outline"
          title="Belum ada profil anak"
          message="Buat profil anak agar ia bisa mulai belajar gizi seimbang."
        />
      ) : null}

      {players
        ? players.map((player) => (
            <Card
              key={player.id}
              style={styles.card}
              onPress={() => router.push({ pathname: '/jalur/[playerId]', params: { playerId: player.id } })}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{player.display_name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{player.display_name}</Text>
                <Body muted style={styles.meta}>
                  Kelas {player.grade} · @{player.username}
                </Body>
                <Body muted style={styles.meta}>
                  Batas belajar {player.daily_limit_minutes} menit per hari
                </Body>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </Card>
          ))
        : null}

      <Button
        title="Tambah profil anak"
        icon="add"
        onPress={() => router.push('/tambah-anak')}
        style={styles.add}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: { fontFamily: fonts.bold, fontSize: 18, color: colors.accent },
  info: { flex: 1 },
  name: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  meta: { fontSize: 12, lineHeight: 18 },
  add: { marginTop: spacing.md },
});
