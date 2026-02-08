import type { Player } from '../../types/index.ts';

interface DealerPickerProps {
  players: Player[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

export function DealerPicker({ players, selectedIndex, onSelect }: DealerPickerProps) {
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
        Choose starting dealer
      </span>
      <div className="grid grid-cols-1 gap-2">
        {players.map((player, index) => (
          <button
            key={player.id}
            onClick={() => onSelect(index)}
            className={`p-3 rounded-xl border text-left transition-all
              ${
                selectedIndex === index
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-500'
                  : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700'
              }`}
          >
            <span className="font-medium">{player.name}</span>
            {selectedIndex === index && (
              <span className="float-right text-emerald-500 font-bold text-sm">Dealer</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
