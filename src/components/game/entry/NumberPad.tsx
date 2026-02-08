interface NumberPadProps {
  max: number;
  selected: number | null;
  onSelect: (n: number) => void;
}

export function NumberPad({ max, selected, onSelect }: NumberPadProps) {
  const cols = max <= 6 ? 3 : 4;
  const numbers = Array.from({ length: max + 1 }, (_, i) => i);

  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {numbers.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onSelect(n)}
          className={[
            'h-14 min-w-14 rounded-xl text-2xl font-bold transition-all',
            selected === n
              ? 'bg-blue-500 text-white ring-2 ring-blue-300 dark:ring-blue-700 scale-105'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 active:scale-95',
          ].join(' ')}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
