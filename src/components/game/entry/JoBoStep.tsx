interface JoBoStepProps {
  players: { id: string; name: string }[];
  jobos: Record<string, boolean>;
  onToggle: (playerId: string) => void;
  onDone: () => void;
  onBack: () => void;
}

export function JoBoStep({ players, jobos, onToggle, onDone, onBack }: JoBoStepProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">JoeBow</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          All suits except trump &middot; Worth 0 pts but tracked as a stat
        </p>
      </div>

      <div className="w-full max-w-xs space-y-3">
        {players.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onToggle(p.id)}
            className={[
              'w-full py-3 px-4 rounded-xl font-bold text-lg flex items-center justify-between transition-all',
              jobos[p.id]
                ? 'bg-purple-500 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
            ].join(' ')}
          >
            <span>{p.name}</span>
            <span>{jobos[p.id] ? 'JoeBow' : ''}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onDone}
        className="w-full max-w-xs py-3 rounded-xl bg-emerald-500 text-white font-bold text-lg transition-all active:scale-95"
      >
        Done
      </button>

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
