import type { PlayerStats } from '../../lib/stats.ts';
import type { Player } from '../../types/index.ts';

interface BoardBidStatsProps {
  players: Player[];
  statsMap: Map<string, PlayerStats>;
}

export function BoardBidStats({ players, statsMap }: BoardBidStatsProps) {
  const data = players
    .filter((p) => (statsMap.get(p.id)?.boardAttempts ?? 0) > 0)
    .map((p) => ({ player: p, stats: statsMap.get(p.id)! }));

  if (data.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold mb-2">Board Bids</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">No board bids yet.</p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <h3 className="font-bold mb-3">Board Bids</h3>
      <div className="space-y-2">
        {data.map(({ player, stats }) => (
          <div key={player.id} className="flex items-center justify-between text-sm">
            <span className="font-medium">{player.name}</span>
            <div className="flex gap-4 text-right">
              <span>
                {stats.boardSuccesses}/{stats.boardAttempts}{' '}
                <span className="text-slate-500">
                  ({(stats.boardSuccessRate * 100).toFixed(0)}%)
                </span>
              </span>
              <span
                className={`font-mono font-bold ${stats.boardPointsNet >= 0 ? 'text-emerald-500' : 'text-red-500'}`}
              >
                {stats.boardPointsNet > 0 ? '+' : ''}
                {stats.boardPointsNet}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
