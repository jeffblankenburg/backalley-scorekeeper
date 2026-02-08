import type { Suit } from '../../../types/index.ts';
import { SUITS } from '../../../lib/constants.ts';

const SUIT_CLASS: Record<Suit, string> = {
  hearts: 'text-red-500 border-red-300 dark:border-red-700',
  diamonds: 'text-red-500 border-red-300 dark:border-red-700',
  clubs: 'text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600',
  spades: 'text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600',
};

interface TrumpStepProps {
  handSize: number;
  dealerName: string;
  onSelect: (suit: Suit) => void;
}

export function TrumpStep({ handSize, dealerName, onSelect }: TrumpStepProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <p className="text-lg text-slate-500 dark:text-slate-400">
          {handSize} cards &middot; Dealer: <span className="font-bold text-amber-500">{dealerName}</span>
        </p>
        <h2 className="text-2xl font-bold mt-1">Select Trump Suit</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {SUITS.map((s) => (
          <button
            key={s.suit}
            type="button"
            onClick={() => onSelect(s.suit)}
            className={[
              'h-24 rounded-2xl border-2 text-5xl flex items-center justify-center transition-all active:scale-95 suit-symbol',
              'bg-white dark:bg-slate-800',
              SUIT_CLASS[s.suit],
            ].join(' ')}
          >
            {s.symbol}
          </button>
        ))}
      </div>
    </div>
  );
}
