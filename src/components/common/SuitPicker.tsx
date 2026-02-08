import type { Suit } from '../../types/index.ts';
import { SUITS } from '../../lib/constants.ts';

interface SuitPickerProps {
  value: Suit | null;
  onChange: (suit: Suit) => void;
}

export function SuitPicker({ value, onChange }: SuitPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {SUITS.map((s) => (
        <button
          key={s.suit}
          onClick={() => onChange(s.suit)}
          className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl text-3xl transition-all
            ${
              value === s.suit
                ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30 scale-105'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
        >
          <span className="suit-symbol" style={{ color: s.color }}>{s.symbol}</span>
          <span className="text-xs mt-1 text-slate-600 dark:text-slate-400">{s.label}</span>
        </button>
      ))}
    </div>
  );
}
