import { useState } from 'react';
import { usePlayers } from '../../hooks/usePlayers.ts';
import { PlayerForm } from './PlayerForm.tsx';
import { ConfirmDialog } from '../common/ConfirmDialog.tsx';

export function PlayerList() {
  const { players, addPlayer, renamePlayer, deletePlayer } = usePlayers();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <PlayerForm onSubmit={(name) => addPlayer(name)} />

      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            {editingId === player.id ? (
              <PlayerForm
                initialName={player.name}
                submitLabel="Save"
                onSubmit={(name) => {
                  renamePlayer(player.id, name);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                <span className="flex-1 font-medium">{player.name}</span>
                <button
                  onClick={() => setEditingId(player.id)}
                  className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeletingId(player.id)}
                  className="px-3 py-1.5 text-sm rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}

        {players.length === 0 && (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8">
            No players yet. Add some above!
          </p>
        )}
      </div>

      <ConfirmDialog
        open={!!deletingId}
        title="Delete Player"
        message={`Remove ${players.find((p) => p.id === deletingId)?.name ?? 'this player'}? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (deletingId) deletePlayer(deletingId);
          setDeletingId(null);
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
