import type { Game, Player } from '../../types/index.ts';
import { announceScores } from '../../lib/standings.ts';

interface AnnounceScoresButtonProps {
  game: Game;
  players: Player[];
  currentRoundIndex: number;
}

export function AnnounceScoresButton({ game, players, currentRoundIndex }: AnnounceScoresButtonProps) {
  function handleAnnounce() {
    // Find the latest completed round (current round may not have scores yet)
    const round = [...game.rounds].reverse().find((r) => r.isComplete)
      ?? game.rounds[currentRoundIndex];
    if (!round) return;

    const standings = game.playerIds
      .map((pid) => {
        const pr = round.playerRounds.find((p) => p.playerId === pid);
        const player = players.find((p) => p.id === pid);
        return { name: player?.firstName || (player?.name ?? 'Unknown'), score: pr?.cumulativeScore ?? 0 };
      })
      .sort((a, b) => b.score - a.score)
      .map((s, i) => ({ ...s, position: i + 1 }));

    announceScores(standings);
  }

  return (
    <button
      onClick={handleAnnounce}
      className="w-full py-3 rounded-xl bg-slate-200 dark:bg-slate-700 font-medium transition-colors hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center gap-2"
      aria-label="Announce current scores"
    >
      <span className="text-xl">🔊</span>
      <span>Announce Scores</span>
    </button>
  );
}
