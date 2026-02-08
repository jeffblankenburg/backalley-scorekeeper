import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/index.ts';

export function useGames() {
  const games = useLiveQuery(() => db.games.orderBy('createdAt').reverse().toArray()) ?? [];
  return { games };
}
