import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  standingsStyle: string;
  setStandingsStyle: (style: string) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      standingsStyle: 'default',
      setStandingsStyle: (style) => set({ standingsStyle: style }),
    }),
    { name: 'backalley-preferences' },
  ),
);
