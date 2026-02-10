import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext.tsx';
import { usePlayers } from '../hooks/usePlayers.ts';
import { useThemeStore } from '../store/themeStore.ts';
import { usePreferencesStore } from '../store/preferencesStore.ts';
import { STANDINGS_THEMES } from '../lib/standings.ts';

export function ProfilePage() {
  const { user } = useAuthContext();
  const { profiles, updateName } = usePlayers();
  const dark = useThemeStore((s) => s.dark);
  const toggleDark = useThemeStore((s) => s.toggle);
  const standingsStyle = usePreferencesStore((s) => s.standingsStyle);
  const setStandingsStyle = usePreferencesStore((s) => s.setStandingsStyle);

  const currentProfile = profiles.find((p) => p.id === user?.id);

  const [editingName, setEditingName] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  function startEdit() {
    if (!currentProfile) return;
    setFirstName(currentProfile.first_name);
    setLastName(currentProfile.last_name);
    setEditingName(true);
  }

  function saveEdit() {
    if (!currentProfile || !firstName.trim() || !lastName.trim()) return;
    updateName(currentProfile.id, firstName, lastName);
    setEditingName(false);
  }

  if (!currentProfile) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Profile</h2>

      {/* Profile card */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Your Info</h3>
        {editingName ? (
          <form onSubmit={(e) => { e.preventDefault(); saveEdit(); }} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First"
                maxLength={20}
                autoFocus
                className="min-w-0 flex-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last"
                maxLength={20}
                className="min-w-0 flex-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setEditingName(false)}
                className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!firstName.trim() || !lastName.trim()}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="font-medium">{currentProfile.display_name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{currentProfile.email}</p>
            </div>
            <button
              onClick={startEdit}
              className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Preferences */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Preferences</h3>

        {/* Dark mode */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Dark Mode</span>
          <button
            onClick={toggleDark}
            className={[
              'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
              dark ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600',
            ].join(' ')}
          >
            <span
              className={[
                'inline-block h-5 w-5 rounded-full bg-white transition-transform',
                dark ? 'translate-x-6' : 'translate-x-1',
              ].join(' ')}
            />
          </button>
        </div>

        {/* Standings style */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Standings Announcements</span>
          <div className="space-y-1.5">
            {Object.entries(STANDINGS_THEMES).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => setStandingsStyle(key)}
                className={[
                  'w-full text-left p-3 rounded-lg border transition-colors',
                  standingsStyle === key
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50',
                ].join(' ')}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{theme.label}</span>
                  {standingsStyle === key && (
                    <span className="text-xs text-blue-500 font-medium">Active</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {theme.positions.join(' · ')}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
