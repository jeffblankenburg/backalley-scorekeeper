import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { PlayerStats } from '../../lib/stats.ts';
import type { Player } from '../../types/index.ts';

interface BidAccuracyChartProps {
  players: Player[];
  statsMap: Map<string, PlayerStats>;
}

export function BidAccuracyChart({ players, statsMap }: BidAccuracyChartProps) {
  const data = players
    .filter((p) => (statsMap.get(p.id)?.gamesPlayed ?? 0) > 0)
    .map((p) => {
      const stats = statsMap.get(p.id)!;
      return {
        name: p.name.slice(0, 8),
        accuracy: Math.round(stats.bidAccuracy * 100),
        perfect: Math.round(stats.perfectBidRate * 100),
      };
    });

  if (data.length === 0) return null;

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <h3 className="font-bold mb-3">Bid Accuracy</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis unit="%" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="accuracy" name="Made %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="perfect" name="Perfect %" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
