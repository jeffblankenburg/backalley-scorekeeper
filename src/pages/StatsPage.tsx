import { useGames } from '../hooks/useGames.ts';
import { usePlayers } from '../hooks/usePlayers.ts';
import { StatsDashboard } from '../components/stats/StatsDashboard.tsx';

export function StatsPage() {
  const { games } = useGames();
  const { players } = usePlayers();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Statistics</h2>
      <StatsDashboard games={games} players={players} />
    </div>
  );
}
