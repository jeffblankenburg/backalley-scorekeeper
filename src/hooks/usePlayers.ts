import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/index.ts';
import type { Player } from '../types/index.ts';
import { generateId } from '../lib/utils.ts';

export function usePlayers() {
  const players = useLiveQuery(() => db.players.orderBy('name').toArray()) ?? [];

  async function addPlayer(name: string): Promise<Player> {
    const player: Player = { id: generateId(), name: name.trim(), createdAt: Date.now() };
    await db.players.add(player);
    return player;
  }

  async function renamePlayer(id: string, name: string) {
    await db.players.update(id, { name: name.trim() });
  }

  async function deletePlayer(id: string) {
    await db.players.delete(id);
  }

  return { players, addPlayer, renamePlayer, deletePlayer };
}
