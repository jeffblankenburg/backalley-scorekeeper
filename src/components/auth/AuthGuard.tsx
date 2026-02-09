import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext.tsx';
import { supabase } from '../../lib/supabase.ts';

export function AuthGuard() {
  const { user, loading, signOut } = useAuthContext();
  const location = useLocation();
  const [disabled, setDisabled] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('disabled')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        setDisabled(data?.disabled ?? false);
      });
  }, [user]);

  if (loading || (user && disabled === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
        <p className="text-slate-500 dark:text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (disabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Account Disabled</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Your account has been disabled. Contact an administrator if you believe this is a mistake.
          </p>
          <button
            onClick={signOut}
            className="px-6 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 font-medium transition-colors hover:bg-slate-300 dark:hover:bg-slate-600"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // New user hasn't completed profile setup yet
  const profileComplete = user.user_metadata?.profile_complete;
  if (!profileComplete && location.pathname !== '/profile-setup') {
    return <Navigate to="/profile-setup" replace />;
  }

  return <Outlet />;
}
