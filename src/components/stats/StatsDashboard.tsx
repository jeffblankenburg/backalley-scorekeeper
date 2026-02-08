import { useMemo } from 'react';
import type { Game, Player } from '../../types/index.ts';
import { computePlayerStats } from '../../lib/stats.ts';
import { PlayerStatsCard } from './PlayerStatsCard.tsx';
import { BidAccuracyChart } from './BidAccuracyChart.tsx';
import { WinRateChart } from './WinRateChart.tsx';
import { PerformanceByRound } from './PerformanceByRound.tsx';
import { BoardBidStats } from './BoardBidStats.tsx';
import { HeadToHeadTable } from './HeadToHeadTable.tsx';
import { TrendsChart } from './TrendsChart.tsx';
import { RainbowStats } from './RainbowStats.tsx';

interface StatsDashboardProps {
  games: Game[];
  players: Player[];
}

export function StatsDashboard({ games, players }: StatsDashboardProps) {
  const statsMap = useMemo(() => computePlayerStats(games, players), [games, players]);
  const completedGames = games.filter((g) => g.status === 'completed');

  if (completedGames.length === 0) {
    return (
      <p className="text-center text-slate-500 dark:text-slate-400 py-12">
        Complete a game to see statistics!
      </p>
    );
  }

  const activePlayers = players.filter((p) => (statsMap.get(p.id)?.gamesPlayed ?? 0) > 0);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {activePlayers.map((p) => (
          <PlayerStatsCard key={p.id} player={p} stats={statsMap.get(p.id)!} />
        ))}
      </div>

      <WinRateChart players={activePlayers} statsMap={statsMap} />
      <BidAccuracyChart players={activePlayers} statsMap={statsMap} />
      <PerformanceByRound games={games} players={activePlayers} />
      <BoardBidStats players={activePlayers} statsMap={statsMap} />
      <RainbowStats players={activePlayers} statsMap={statsMap} />
      <HeadToHeadTable games={games} players={activePlayers} />
      <TrendsChart games={games} players={activePlayers} />
    </div>
  );
}
