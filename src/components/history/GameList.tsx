import { Link } from 'react-router-dom';
import type { Game, Player } from '../../types/index.ts';
import { formatDateTime } from '../../lib/utils.ts';

interface GameListProps {
  games: Game[];
  players: Player[];
}

export function GameList({ games, players }: GameListProps) {
  const completed = games.filter((g) => g.status === 'completed');

  if (completed.length === 0) {
    return (
      <p className="text-center text-slate-500 dark:text-slate-400 py-12">
        No completed games yet. Play a game first!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {completed.map((game) => {
        const lastRound = game.rounds[game.rounds.length - 1];
        const standings = game.playerIds
          .map((pid) => {
            const pr = lastRound?.playerRounds.find((p) => p.playerId === pid);
            const player = players.find((p) => p.id === pid);
            return { name: player?.name ?? '?', score: pr?.cumulativeScore ?? 0 };
          })
          .sort((a, b) => b.score - a.score);

        return (
          <Link
            key={game.id}
            to={`/history/${game.id}`}
            className="block p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {formatDateTime(game.createdAt)}
              </span>
              <span className="text-sm font-medium text-emerald-500">
                🏆 {standings[0].name}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {standings.map((s, i) => (
                <span key={i} className={i === 0 ? 'font-bold' : 'text-slate-600 dark:text-slate-400'}>
                  {s.name}: {s.score}
                </span>
              ))}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
