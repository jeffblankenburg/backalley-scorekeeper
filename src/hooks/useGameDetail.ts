import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/index.ts';

export function useGameDetail(id: string | undefined) {
  const game = useLiveQuery(() => (id ? db.games.get(id) : undefined), [id]);
  return { game };
}
