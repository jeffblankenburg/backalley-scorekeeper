import type { Round, Player } from '../../types/index.ts';
import { RAINBOW_HAND_SIZE, RAINBOW_BONUS } from '../../lib/constants.ts';

interface RainbowToggleProps {
  round: Round;
  players: Player[];
  onToggle: (playerId: string, rainbow: boolean) => void;
}

export function RainbowToggle({ round, players, onToggle }: RainbowToggleProps) {
  if (round.handSize !== RAINBOW_HAND_SIZE) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
        Rainbow (+{RAINBOW_BONUS} bonus)
      </h3>
      <div className="flex flex-wrap gap-2">
        {round.playerRounds.map((pr) => {
          const player = players.find((p) => p.id === pr.playerId);
          return (
            <button
              key={pr.playerId}
              onClick={() => onToggle(pr.playerId, !pr.rainbow)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all
                ${
                  pr.rainbow
                    ? 'bg-gradient-to-r from-red-400 via-amber-400 to-emerald-400 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}
            >
              {player?.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
