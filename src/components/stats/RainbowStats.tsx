import type { PlayerStats } from '../../lib/stats.ts';
import type { Player } from '../../types/index.ts';

interface RainbowStatsProps {
  players: Player[];
  statsMap: Map<string, PlayerStats>;
}

export function RainbowStats({ players, statsMap }: RainbowStatsProps) {
  const data = players
    .filter((p) => (statsMap.get(p.id)?.rainbowCount ?? 0) > 0)
    .map((p) => ({ player: p, stats: statsMap.get(p.id)! }))
    .sort((a, b) => b.stats.rainbowCount - a.stats.rainbowCount);

  if (data.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold mb-2">Rainbow Bonus</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">No rainbows earned yet.</p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <h3 className="font-bold mb-3">Rainbow Bonus</h3>
      <div className="space-y-2">
        {data.map(({ player, stats }) => (
          <div key={player.id} className="flex items-center justify-between text-sm">
            <span className="font-medium">{player.name}</span>
            <div className="flex gap-4">
              <span>{stats.rainbowCount}x</span>
              <span className="font-mono font-bold text-emerald-500">+{stats.rainbowPoints}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
