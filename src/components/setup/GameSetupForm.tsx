import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFriends } from '../../hooks/useFriends.ts';
import { useGameStore } from '../../store/gameStore.ts';
import { useAuthContext } from '../../context/AuthContext.tsx';
import { profileToPlayer } from '../../types/index.ts';
import { PlayerSelector } from './PlayerSelector.tsx';
import { AddPlayerInline } from './AddPlayerInline.tsx';
import { PLAYER_COUNT } from '../../lib/constants.ts';

export function GameSetupForm() {
  const { friends, loading, createPlayer } = useFriends();
  const createGame = useGameStore((s) => s.createGame);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dealerIndex, setDealerIndex] = useState<number | null>(null);

  // Build player list from friends + current user
  const players = friends.map(profileToPlayer);
  if (user) {
    const currentUserProfile = friends.find((f) => f.id === user.id);
    if (!currentUserProfile) {
      const fallbackName = user.user_metadata?.display_name ?? user.email?.split('@')[0] ?? 'You';
      const parts = fallbackName.split(' ');
      players.unshift({ id: user.id, name: fallbackName, firstName: parts[0] ?? '', lastName: parts.slice(1).join(' ') ?? '', createdAt: Date.now() });
    }
  }

  function handleToggle(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        const removedIndex = prev.indexOf(id);
        const next = prev.filter((x) => x !== id);
        if (dealerIndex !== null) {
          if (dealerIndex === removedIndex) setDealerIndex(null);
          else if (dealerIndex > removedIndex) setDealerIndex(dealerIndex - 1);
        }
        return next;
      }
      if (prev.length >= PLAYER_COUNT) return prev;
      return [...prev, id];
    });
  }

  function handlePlayerAdded(profileId: string) {
    setSelectedIds((prev) => {
      if (prev.includes(profileId)) return prev;
      if (prev.length >= PLAYER_COUNT) return prev;
      return [...prev, profileId];
    });
  }

  async function handleStart() {
    if (selectedIds.length !== PLAYER_COUNT || dealerIndex === null || !user) return;
    const id = await createGame(selectedIds, dealerIndex, user.id);
    navigate(`/game/${id}`);
  }

  if (loading) {
    return <p className="text-center py-8 text-slate-500 dark:text-slate-400">Loading friends...</p>;
  }

  return (
    <div className="space-y-6">
      <PlayerSelector
        players={players}
        selected={selectedIds}
        dealerIndex={dealerIndex}
        onToggle={handleToggle}
        onSetDealer={setDealerIndex}
      />

      {selectedIds.length < PLAYER_COUNT && (
        <AddPlayerInline onAdd={createPlayer} onAdded={handlePlayerAdded} />
      )}

      <button
        onClick={handleStart}
        disabled={selectedIds.length !== PLAYER_COUNT || dealerIndex === null}
        className="w-full py-3.5 rounded-xl bg-emerald-500 text-white font-bold text-lg disabled:opacity-40 transition-colors hover:bg-emerald-600"
      >
        Start Game
      </button>
    </div>
  );
}
