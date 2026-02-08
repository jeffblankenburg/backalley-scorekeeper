import type { Game, Player } from '../../types/index.ts';
import { getHeadToHead } from '../../lib/stats.ts';

interface HeadToHeadTableProps {
  games: Game[];
  players: Player[];
}

export function HeadToHeadTable({ games, players }: HeadToHeadTableProps) {
  const activePlayers = players.filter((p) =>
    games.some((g) => g.status === 'completed' && g.playerIds.includes(p.id)),
  );

  if (activePlayers.length < 2) return null;

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <h3 className="font-bold mb-3">Head-to-Head Wins</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="p-1" />
              {activePlayers.map((p) => (
                <th key={p.id} className="p-1 font-medium text-slate-500 dark:text-slate-400">
                  {p.name.slice(0, 5)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activePlayers.map((p1) => (
              <tr key={p1.id}>
                <td className="p-1 font-medium">{p1.name.slice(0, 5)}</td>
                {activePlayers.map((p2) => {
                  if (p1.id === p2.id)
                    return (
                      <td key={p2.id} className="p-1 text-center text-slate-300 dark:text-slate-700">
                        -
                      </td>
                    );
                  const h2h = getHeadToHead(games, p1.id, p2.id);
                  return (
                    <td key={p2.id} className="p-1 text-center font-mono">
                      <span
                        className={
                          h2h.player1Wins > h2h.player2Wins
                            ? 'text-emerald-500'
                            : h2h.player1Wins < h2h.player2Wins
                              ? 'text-red-500'
                              : ''
                        }
                      >
                        {h2h.player1Wins}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
