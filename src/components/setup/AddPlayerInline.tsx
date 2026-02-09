import { useState } from 'react';

interface AddPlayerInlineProps {
  onAdd: (email: string, firstName: string, lastName: string) => Promise<{ success: boolean; message: string; profileId?: string }>;
  onAdded: (profileId: string) => void;
}

export function AddPlayerInline({ onAdd, onAdded }: AddPlayerInlineProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !firstName.trim() || !lastName.trim()) return;
    setSending(true);
    setError('');
    const result = await onAdd(email, firstName, lastName);
    setSending(false);
    if (result.success && result.profileId) {
      onAdded(result.profileId);
      setEmail('');
      setFirstName('');
      setLastName('');
      setOpen(false);
    } else if (!result.success) {
      if (result.profileId) {
        onAdded(result.profileId);
        setEmail('');
        setFirstName('');
        setLastName('');
        setOpen(false);
      } else {
        setError(result.message);
      }
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full p-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-sm font-medium hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        + Add New Player
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First"
          maxLength={20}
          autoFocus
          className="flex-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last"
          maxLength={20}
          className="flex-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!email.trim() || !firstName.trim() || !lastName.trim() || sending}
          className="flex-1 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium disabled:opacity-40 transition-colors hover:bg-blue-600"
        >
          {sending ? 'Adding...' : 'Add Player'}
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setError(''); }}
          className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-sm font-medium transition-colors hover:bg-slate-300 dark:hover:bg-slate-600"
        >
          Cancel
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </form>
  );
}
