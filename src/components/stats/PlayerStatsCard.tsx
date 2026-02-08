import type { PlayerStats } from '../../lib/stats.ts';
import type { Player } from '../../types/index.ts';

interface PlayerStatsCardProps {
  player: Player;
  stats: PlayerStats;
}

function pct(v: number): string {
  return `${(v * 100).toFixed(0)}%`;
}

export function PlayerStatsCard({ player, stats }: PlayerStatsCardProps) {
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
      <h3 className="font-bold text-lg">{player.name}</h3>
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <div className="font-mono font-bold text-lg">{stats.gamesPlayed}</div>
          <div className="text-slate-500 dark:text-slate-400">Games</div>
        </div>
        <div>
          <div className="font-mono font-bold text-lg text-emerald-500">{stats.wins}</div>
          <div className="text-slate-500 dark:text-slate-400">Wins</div>
        </div>
        <div>
          <div className="font-mono font-bold text-lg">{pct(stats.winRate)}</div>
          <div className="text-slate-500 dark:text-slate-400">Win %</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <div className="font-mono font-bold">{stats.avgFinalScore.toFixed(0)}</div>
          <div className="text-slate-500 dark:text-slate-400">Avg Score</div>
        </div>
        <div>
          <div className="font-mono font-bold text-emerald-500">{stats.bestScore}</div>
          <div className="text-slate-500 dark:text-slate-400">Best</div>
        </div>
        <div>
          <div className="font-mono font-bold text-red-500">{stats.worstScore}</div>
          <div className="text-slate-500 dark:text-slate-400">Worst</div>
        </div>
      </div>
      <div className="border-t border-slate-100 dark:border-slate-700 pt-2">
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <div className="font-mono font-bold">{pct(stats.bidAccuracy)}</div>
            <div className="text-slate-500 dark:text-slate-400">Bid Made</div>
          </div>
          <div>
            <div className="font-mono font-bold">{pct(stats.perfectBidRate)}</div>
            <div className="text-slate-500 dark:text-slate-400">Perfect</div>
          </div>
          <div>
            <div className="font-mono font-bold">{pct(stats.zeroBidCleanRate)}</div>
            <div className="text-slate-500 dark:text-slate-400">0-Bid Clean</div>
          </div>
        </div>
      </div>
    </div>
  );
}
