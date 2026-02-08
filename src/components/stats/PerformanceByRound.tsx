import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Game, Player } from '../../types/index.ts';
import { getHandSizePerformance } from '../../lib/stats.ts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface PerformanceByRoundProps {
  games: Game[];
  players: Player[];
}

export function PerformanceByRound({ games, players }: PerformanceByRoundProps) {
  const activePlayers = players.filter((p) =>
    games.some((g) => g.status === 'completed' && g.playerIds.includes(p.id)),
  );

  if (activePlayers.length === 0) return null;

  const allSizes = new Set<number>();
  const byPlayer = new Map<string, Map<number, number>>();

  for (const player of activePlayers) {
    const perf = getHandSizePerformance(games, player.id);
    const map = new Map<number, number>();
    for (const p of perf) {
      map.set(p.handSize, Math.round(p.avgScore * 10) / 10);
      allSizes.add(p.handSize);
    }
    byPlayer.set(player.id, map);
  }

  const data = Array.from(allSizes)
    .sort((a, b) => a - b)
    .map((hs) => {
      const point: Record<string, number> = { handSize: hs };
      for (const player of activePlayers) {
        point[player.name] = byPlayer.get(player.id)?.get(hs) ?? 0;
      }
      return point;
    });

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <h3 className="font-bold mb-3">Performance by Hand Size</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="handSize" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          {activePlayers.map((p, i) => (
            <Line
              key={p.id}
              type="monotone"
              dataKey={p.name}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
