import { useState } from 'react';

interface PlayerFormProps {
  initialName?: string;
  onSubmit: (name: string) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function PlayerForm({ initialName = '', onSubmit, onCancel, submitLabel = 'Add' }: PlayerFormProps) {
  const [name, setName] = useState(initialName);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      if (!initialName) setName('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Player name"
        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        maxLength={20}
        autoFocus
      />
      <button
        type="submit"
        disabled={!name.trim()}
        className="px-5 py-2.5 rounded-xl bg-blue-500 text-white font-medium disabled:opacity-40 transition-colors hover:bg-blue-600"
      >
        {submitLabel}
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 font-medium transition-colors hover:bg-slate-300 dark:hover:bg-slate-600"
        >
          Cancel
        </button>
      )}
    </form>
  );
}
