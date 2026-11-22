import { StyleSheet, Text } from 'react-native';
import PathView from '../../components/PathView';
import { Body, Card } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { colors, fonts } from '../../theme';

export default function ChildLearnScreen() {
  const { session } = useAuth();
  if (!session?.player) return null;
  const player = session.player;

  const header = (
    <Card style={styles.hello}>
      <Text style={styles.helloTitle}>Halo, {player.display_name}!</Text>
      <Body>Pilih modul yang terbuka, baca materinya, lalu kerjakan kuisnya.</Body>
    </Card>
  );

  return <PathView playerId={player.id} header={header} />;
}

const styles = StyleSheet.create({
  hello: { backgroundColor: colors.accentSoft, borderColor: colors.accentSoft },
  helloTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.text },
});
