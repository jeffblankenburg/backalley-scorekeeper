import { useState } from 'react';

interface InviteFormProps {
  onInvite: (email: string) => Promise<{ success: boolean; message: string; profileId?: string }>;
}

export function InviteForm({ onInvite }: InviteFormProps) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setFeedback(null);
    const result = await onInvite(email);
    setFeedback(result);
    setSending(false);
    if (result.success) setEmail('');
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
        Invite by Email
      </label>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setFeedback(null); }}
          placeholder="friend@example.com"
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!email.trim() || sending}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-medium disabled:opacity-40 transition-colors hover:bg-emerald-600"
        >
          {sending ? 'Sending...' : 'Invite'}
        </button>
      </form>

      {feedback && (
        <p className={`text-sm ${feedback.success ? 'text-emerald-500' : 'text-red-500'}`}>
          {feedback.message}
        </p>
      )}
    </div>
  );
}
