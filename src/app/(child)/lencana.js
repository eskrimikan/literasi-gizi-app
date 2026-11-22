import ProgressView from '../../components/ProgressView';
import { Mascot } from '../../components/illustrations';
import { Hero } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';

export default function ChildBadgesScreen() {
  const { session } = useAuth();
  if (!session?.player) return null;

  const hero = (
    <Hero
      color={colors.primary}
      title="Poin & Lencanaku"
      subtitle="Kumpulkan poin dan buka semua lencana!"
      art={<Mascot size={88} mood="wow" />}
    />
  );

  return (
    <ProgressView
      playerId={session.player.id}
      canCheckMission={false}
      hero={hero}
      topColor={colors.primary}
      edges={['top']}
    />
  );
}
