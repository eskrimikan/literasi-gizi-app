import ProgressView from '../../components/ProgressView';
import { useAuth } from '../../context/AuthContext';

export default function ChildBadgesScreen() {
  const { session } = useAuth();
  if (!session?.player) return null;
  return <ProgressView playerId={session.player.id} canCheckMission={false} />;
}
