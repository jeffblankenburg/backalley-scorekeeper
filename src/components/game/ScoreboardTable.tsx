import type { Game, Player } from '../../types/index.ts';
import { ScoreBadge } from '../common/ScoreBadge.tsx';

interface ScoreboardTableProps {
  game: Game;
  players: Player[];
  currentRoundIndex: number;
}

export function ScoreboardTable({ game, players, currentRoundIndex }: ScoreboardTableProps) {
  const lastCompleteRound = game.rounds
    .slice(0, currentRoundIndex + 1)
    .filter((r) => r.isComplete)
    .pop();

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-800">
            <th className="text-left p-2 font-medium text-slate-500 dark:text-slate-400">Player</th>
            <th className="text-right p-2 font-medium text-slate-500 dark:text-slate-400">Round</th>
            <th className="text-right p-2 font-medium text-slate-500 dark:text-slate-400">Total</th>
          </tr>
        </thead>
        <tbody>
          {game.playerIds.map((pid) => {
            const player = players.find((p) => p.id === pid);
            const currentPr = game.rounds[currentRoundIndex]?.playerRounds.find(
              (p) => p.playerId === pid,
            );
            const lastPr = lastCompleteRound?.playerRounds.find((p) => p.playerId === pid);
            return (
              <tr
                key={pid}
                className="border-t border-slate-100 dark:border-slate-800"
              >
                <td className="p-2 font-medium truncate max-w-[120px]">{player?.name}</td>
                <td className="p-2 text-right">
                  <ScoreBadge score={currentPr?.score ?? 0} size="sm" />
                </td>
                <td className="p-2 text-right">
                  <ScoreBadge
                    score={lastPr?.cumulativeScore ?? currentPr?.cumulativeScore ?? 0}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
