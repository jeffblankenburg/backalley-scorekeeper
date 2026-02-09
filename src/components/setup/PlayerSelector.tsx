import type { Player } from '../../types/index.ts';
import { PLAYER_COUNT } from '../../lib/constants.ts';

interface PlayerSelectorProps {
  players: Player[];
  selected: string[];
  dealerIndex: number | null;
  onToggle: (id: string) => void;
  onSetDealer: (index: number) => void;
}

export function PlayerSelector({ players, selected, dealerIndex, onToggle, onSetDealer }: PlayerSelectorProps) {
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
        const seatIndex = selected.indexOf(player.id);
        const isDealer = isSelected && dealerIndex === seatIndex;
        const disabled = !isSelected && selected.length >= PLAYER_COUNT;
        return (
          <div key={player.id} className="flex gap-2">
            <button
              onClick={() => onToggle(player.id)}
              disabled={disabled}
              className={`flex-1 text-left p-3 rounded-xl border transition-all
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
                  #{seatIndex + 1}
                </span>
              )}
            </button>
            {isSelected && (
              <button
                onClick={() => onSetDealer(seatIndex)}
                className={`w-11 rounded-xl border text-sm font-bold transition-all
                  ${
                    isDealer
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-emerald-400 hover:text-emerald-500'
                  }`}
              >
                D
              </button>
            )}
          </div>
        );
      })}

      {players.length < PLAYER_COUNT && (
        <p className="text-sm text-amber-500 dark:text-amber-400 mt-2">
          Need at least {PLAYER_COUNT} players. Add more friends on the Friends page.
        </p>
      )}
    </div>
  );
}
