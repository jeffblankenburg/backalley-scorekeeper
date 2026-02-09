import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext.tsx';
import { supabase } from '../lib/supabase.ts';

export function ProfileSetupPage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Already completed profile — go home
  if (user?.user_metadata?.profile_complete) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const first = firstName.trim();
    const last = lastName.trim();
    if (!first || !last || !user) return;

    setSubmitting(true);
    setError(null);

    const displayName = `${first} ${last}`;

    // Update the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ display_name: displayName, first_name: first, last_name: last })
      .eq('id', user.id);

    if (profileError) {
      setError(profileError.message);
      setSubmitting(false);
      return;
    }

    // Mark profile as complete in user metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: { profile_complete: true, display_name: displayName },
    });

    if (authError) {
      setError(authError.message);
      setSubmitting(false);
      return;
    }

    navigate('/', { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Welcome!</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Set up your player profile to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              First name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              required
              autoFocus
              maxLength={20}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              required
              maxLength={20}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Other players will see your initials on the score grid.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || !firstName.trim() || !lastName.trim()}
            className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold text-lg disabled:opacity-40 transition-colors hover:bg-emerald-600"
          >
            {submitting ? 'Saving...' : 'Let\'s Go'}
          </button>
        </form>
      </div>
    </div>
  );
}
