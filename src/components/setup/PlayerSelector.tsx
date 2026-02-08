import type { Player } from '../../types/index.ts';
import { PLAYER_COUNT } from '../../lib/constants.ts';

interface PlayerSelectorProps {
  players: Player[];
  selected: string[];
  onToggle: (id: string) => void;
}

export function PlayerSelector({ players, selected, onToggle }: PlayerSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Select {PLAYER_COUNT} players
        </span>
        <span className="text-sm font-mono text-slate-500">
          {selected.length}/{PLAYER_COUNT}
        </span>
      </div>
      {players.map((player) => {
        const isSelected = selected.includes(player.id);
        const disabled = !isSelected && selected.length >= PLAYER_COUNT;
        return (
          <button
            key={player.id}
            onClick={() => onToggle(player.id)}
            disabled={disabled}
            className={`w-full text-left p-3 rounded-xl border transition-all
              ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500'
                  : disabled
                    ? 'border-slate-200 dark:border-slate-700 opacity-40'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
          >
            <span className="font-medium">{player.name}</span>
            {isSelected && (
              <span className="float-right text-blue-500 font-bold">
                #{selected.indexOf(player.id) + 1}
              </span>
            )}
          </button>
        );
      })}

      {players.length < PLAYER_COUNT && (
        <p className="text-sm text-amber-500 dark:text-amber-400 mt-2">
          Need at least {PLAYER_COUNT} players. Go to Players to add more.
        </p>
      )}
    </div>
  );
}
