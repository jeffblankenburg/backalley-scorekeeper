import { NumberPad } from './NumberPad.tsx';

interface TricksStepProps {
  playerName: string;
  bid: number;
  isBoard: boolean;
  handSize: number;
  currentTrickTotal: number;
  currentPlayerIndex: number;
  totalPlayers: number;
  isLastPlayer: boolean;
  selected: number | null;
  onTricks: (n: number) => void;
  onBack: () => void;
}

export function TricksStep({
  playerName,
  bid,
  isBoard,
  handSize,
  currentTrickTotal,
  currentPlayerIndex,
  totalPlayers,
  isLastPlayer,
  selected,
  onTricks,
  onBack,
}: TricksStepProps) {
  const remaining = handSize - currentTrickTotal;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{playerName}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Bid: <span className={isBoard ? 'text-amber-500 font-bold' : 'font-bold'}>
            {isBoard ? 'Board' : bid}
          </span>
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Tricks: {currentTrickTotal} / {handSize} cards
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {Array.from({ length: totalPlayers }, (_, i) => (
          <div
            key={i}
            className={[
              'w-2.5 h-2.5 rounded-full',
              i < currentPlayerIndex
                ? 'bg-emerald-500'
                : i === currentPlayerIndex
                  ? 'bg-emerald-500 ring-2 ring-emerald-300 dark:ring-emerald-700'
                  : 'bg-slate-300 dark:bg-slate-600',
            ].join(' ')}
          />
        ))}
      </div>

      <div className="w-full max-w-xs">
        <NumberPad
          max={handSize}
          selected={selected}
          onSelect={onTricks}
        />
      </div>

      {isLastPlayer && remaining >= 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Remaining: <span className="font-bold text-emerald-500">{remaining}</span>
        </p>
      )}

      <button
        type="button"
        onClick={onBack}
        className="text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
      >
        &larr; Back
      </button>
    </div>
  );
}
