import { useGames } from '../hooks/useGames.ts';
import { usePlayers } from '../hooks/usePlayers.ts';
import { GameList } from '../components/history/GameList.tsx';

export function HistoryPage() {
  const { games } = useGames();
  const { players } = usePlayers();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Game History</h2>
      <GameList games={games} players={players} />
    </div>
  );
}
