import { TOTAL_ROUNDS } from '../../lib/constants.ts';

interface RoundNavigatorProps {
  currentRoundIndex: number;
  furthestRoundIndex: number;
  onNavigate: (roundIndex: number) => void;
}

export function RoundNavigator({
  currentRoundIndex,
  furthestRoundIndex,
  onNavigate,
}: RoundNavigatorProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => onNavigate(currentRoundIndex - 1)}
        disabled={currentRoundIndex === 0}
        className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 font-medium disabled:opacity-30 transition-colors hover:bg-slate-300 dark:hover:bg-slate-600"
      >
        Prev
      </button>
      <div className="flex gap-1 flex-wrap justify-center max-w-[200px]">
        {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
          <button
            key={i}
            onClick={() => onNavigate(i)}
            disabled={i > furthestRoundIndex}
            className={`w-6 h-6 rounded text-xs font-mono transition-all
              ${
                i === currentRoundIndex
                  ? 'bg-blue-500 text-white'
                  : i < furthestRoundIndex
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                    : i === furthestRoundIndex
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
              }
              ${i > furthestRoundIndex ? 'opacity-30' : 'cursor-pointer'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <button
        onClick={() => onNavigate(currentRoundIndex + 1)}
        disabled={currentRoundIndex >= furthestRoundIndex}
        className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 font-medium disabled:opacity-30 transition-colors hover:bg-slate-300 dark:hover:bg-slate-600"
      >
        Next
      </button>
    </div>
  );
}
