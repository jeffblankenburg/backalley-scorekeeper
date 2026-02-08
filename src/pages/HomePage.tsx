import { Link, useNavigate } from 'react-router-dom';
import { useGames } from '../hooks/useGames.ts';
import { useGameStore } from '../store/gameStore.ts';
import { ConfirmDialog } from '../components/common/ConfirmDialog.tsx';
import { useState } from 'react';

export function HomePage() {
  const { games } = useGames();
  const activeGame = useGameStore((s) => s.game);
  const abandonGame = useGameStore((s) => s.abandonGame);
  const navigate = useNavigate();
  const [showAbandon, setShowAbandon] = useState(false);

  const inProgressGame = games.find((g) => g.status === 'in_progress');

  function handleNewGame() {
    if (inProgressGame || activeGame) {
      setShowAbandon(true);
    } else {
      navigate('/game/setup');
    }
  }

  return (
    <div className="space-y-6 pt-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Back Alley</h2>
        <p className="text-slate-500 dark:text-slate-400">Card Game Scorekeeper</p>
      </div>

      <div className="space-y-3">
        {inProgressGame && (
          <Link
            to={`/game/${inProgressGame.id}`}
            className="block w-full py-4 rounded-xl bg-emerald-500 text-white font-bold text-center text-lg transition-colors hover:bg-emerald-600"
          >
            Continue Game
            <span className="block text-sm font-normal opacity-80">
              Round {inProgressGame.currentRoundIndex + 1} of 20
            </span>
          </Link>
        )}

        <button
          onClick={handleNewGame}
          className="w-full py-4 rounded-xl bg-blue-500 text-white font-bold text-lg transition-colors hover:bg-blue-600"
        >
          New Game
        </button>

        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/history"
            className="py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center font-medium transition-colors hover:border-blue-300 dark:hover:border-blue-700"
          >
            History
          </Link>
          <Link
            to="/stats"
            className="py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center font-medium transition-colors hover:border-blue-300 dark:hover:border-blue-700"
          >
            Stats
          </Link>
        </div>

        <Link
          to="/players"
          className="block py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center font-medium transition-colors hover:border-blue-300 dark:hover:border-blue-700"
        >
          Manage Players
        </Link>
      </div>

      <ConfirmDialog
        open={showAbandon}
        title="Abandon Current Game?"
        message="Starting a new game will discard the game in progress. This cannot be undone."
        confirmLabel="Abandon & Start New"
        onConfirm={async () => {
          await abandonGame();
          setShowAbandon(false);
          navigate('/game/setup');
        }}
        onCancel={() => setShowAbandon(false)}
      />
    </div>
  );
}
