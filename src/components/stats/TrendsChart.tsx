import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Game, Player } from '../../types/index.ts';
import { getScoreTrends } from '../../lib/stats.ts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface TrendsChartProps {
  games: Game[];
  players: Player[];
}

export function TrendsChart({ games, players }: TrendsChartProps) {
  const activePlayers = players.filter((p) =>
    games.some((g) => g.status === 'completed' && g.playerIds.includes(p.id)),
  );

  const [selectedId, setSelectedId] = useState<string | 'all'>('all');

  if (activePlayers.length === 0) return null;

  const displayPlayers =
    selectedId === 'all' ? activePlayers : activePlayers.filter((p) => p.id === selectedId);

  // Build merged data
  const maxGames = Math.max(
    ...displayPlayers.map((p) => getScoreTrends(games, p.id).length),
  );

  const data: Record<string, number | string>[] = [];
  for (let i = 0; i < maxGames; i++) {
    const point: Record<string, number | string> = { game: i + 1 };
    for (const p of displayPlayers) {
      const trends = getScoreTrends(games, p.id);
      if (trends[i]) {
        point[p.name] = Math.round(trends[i].rollingAvg);
      }
    }
    data.push(point);
  }

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold">Score Trends</h3>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="text-sm px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 border-none"
        >
          <option value="all">All Players</option>
          {activePlayers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="game" tick={{ fontSize: 12 }} label={{ value: 'Game #', position: 'bottom', fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          {displayPlayers.map((p, i) => (
            <Line
              key={p.id}
              type="monotone"
              dataKey={p.name}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 2 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
