import PathView from '../../components/PathView';
import { Mascot } from '../../components/illustrations';
import { Hero } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';

export default function ChildLearnScreen() {
  const { session } = useAuth();
  if (!session?.player) return null;
  const player = session.player;

  const hero = (
    <Hero
      color={colors.primary}
      title={`Halo, ${player.display_name}!`}
      subtitle="Ayo jelajahi peta belajar gizi hari ini."
      art={<Mascot size={96} mood="party" />}
    />
  );

  return <PathView playerId={player.id} hero={hero} topColor={colors.primary} edges={['top']} />;
}
