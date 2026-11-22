import { useCallback, useState } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PlayerApi } from '../../services/ApiService';
import { FruitAvatar, Mascot } from '../../components/illustrations';
import { Button, Card, EmptyState, ErrorState, Hero, Loading, Screen, Tag } from '../../components/ui';
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

  const hero = (
    <Hero
      color={colors.pink}
      title="Halo, Ayah Bunda!"
      subtitle="Pilih anak untuk melihat jalur belajarnya."
      art={<Mascot size={92} mood="happy" />}
    />
  );

  return (
    <Screen
      hero={hero}
      topColor={colors.pink}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {!players && !error ? <Loading label="Memuat profil anak..." /> : null}
      {error ? <ErrorState message={error} onRetry={load} /> : null}

      {players && players.length === 0 ? (
        <EmptyState
          title="Belum ada profil anak"
          message="Buat profil anak dulu supaya ia bisa mulai belajar gizi seimbang."
        />
      ) : null}

      {players
        ? players.map((player) => (
            <Card
              key={player.id}
              style={styles.card}
              onPress={() => router.push({ pathname: '/jalur/[playerId]', params: { playerId: player.id } })}
            >
              <FruitAvatar name={player.display_name} size={58} />
              <View style={styles.info}>
                <Text style={styles.name}>{player.display_name}</Text>
                <Text style={styles.username}>@{player.username}</Text>
                <View style={styles.tags}>
                  <Tag label={`Kelas ${player.grade}`} color={colors.primaryDark} bg={colors.primarySoft} icon="school" />
                  <Tag label={`${player.daily_limit_minutes} menit`} color={colors.skyDark} bg={colors.skySoft} icon="time" />
                </View>
              </View>
              <View style={styles.arrow}>
                <Ionicons name="chevron-forward" size={20} color={colors.white} />
              </View>
            </Card>
          ))
        : null}

      {players ? (
        <Button
          title="Tambah profil anak"
          variant="pink"
          icon="add-circle"
          onPress={() => router.push('/tambah-anak')}
          style={styles.add}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, marginLeft: spacing.md },
  name: { fontFamily: fonts.heading, fontSize: 20, color: colors.text },
  username: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted },
  tags: { flexDirection: 'row', marginTop: 6, gap: 6, flexWrap: 'wrap' },
  arrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  add: { marginTop: spacing.sm },
});
