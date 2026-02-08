import Dexie, { type EntityTable } from 'dexie';
import type { Player, Game } from '../types/index.ts';

const db = new Dexie('BackAlleyDB') as Dexie & {
  players: EntityTable<Player, 'id'>;
  games: EntityTable<Game, 'id'>;
};

db.version(1).stores({
  players: 'id, name, createdAt',
  games: 'id, status, createdAt',
});

export { db };
