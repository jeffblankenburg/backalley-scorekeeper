import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.ts';
import { useAuthContext } from '../../context/AuthContext.tsx';

const navItems = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/history', label: 'History', icon: '📋' },
  { to: '/stats', label: 'Stats', icon: '📊' },
  { to: '/players', label: 'Friends', icon: '👥' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export function BottomNav() {
  const { user } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        setIsAdmin(data?.is_admin ?? false);
      });
  }, [user]);

  const items = isAdmin
    ? [...navItems, { to: '/admin', label: 'Admin', icon: '⚙️' }]
    : navItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 safe-bottom">
      <div className="max-w-lg mx-auto flex justify-around">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 text-xs transition-colors ${
                isActive
                  ? 'text-blue-500 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`
            }
          >
            <span className="text-xl mb-0.5">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
