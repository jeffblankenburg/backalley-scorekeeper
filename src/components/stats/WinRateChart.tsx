import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { PlayerStats } from '../../lib/stats.ts';
import type { Player } from '../../types/index.ts';

interface WinRateChartProps {
  players: Player[];
  statsMap: Map<string, PlayerStats>;
}

export function WinRateChart({ players, statsMap }: WinRateChartProps) {
  const data = players
    .filter((p) => (statsMap.get(p.id)?.gamesPlayed ?? 0) > 0)
    .map((p) => ({
      name: p.name.slice(0, 8),
      winRate: Math.round((statsMap.get(p.id)?.winRate ?? 0) * 100),
      games: statsMap.get(p.id)?.gamesPlayed ?? 0,
    }))
    .sort((a, b) => b.winRate - a.winRate);

  if (data.length === 0) return null;

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <h3 className="font-bold mb-3">Win Rate</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis unit="%" tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Bar dataKey="winRate" name="Win %" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
