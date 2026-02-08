import type { Round, Player } from '../../types/index.ts';
import { MAX_BOARD_LEVEL, BOARD_LABELS } from '../../types/index.ts';

interface BidTricksPanelProps {
  round: Round;
  players: Player[];
  playerIds: string[];
  onBidChange: (playerId: string, bid: number, boardLevel: number) => void;
  onTricksChange: (playerId: string, tricks: number) => void;
}

export function BidTricksPanel({ round, players, playerIds, onBidChange, onTricksChange }: BidTricksPanelProps) {
  const totalBids = round.playerRounds.reduce((sum, pr) => sum + ((pr.boardLevel ?? 0) > 0 ? round.handSize : pr.bid), 0);
  const totalTricks = round.playerRounds.reduce((sum, pr) => sum + pr.tricksTaken, 0);
  const tricksValid = totalTricks === round.handSize;

  const maxBoardInRound = Math.max(0, ...round.playerRounds.map((pr) => pr.boardLevel ?? 0));

  // Order players starting after the dealer
  const dealerIdx = playerIds.indexOf(round.dealerPlayerId);
  const orderedPlayerRounds = Array.from({ length: playerIds.length }, (_, i) => {
    const pid = playerIds[(dealerIdx + 1 + i) % playerIds.length];
    return round.playerRounds.find((pr) => pr.playerId === pid)!;
  }).filter(Boolean);

  return (
    <div className="space-y-2">
      {/* Column headers */}
      <div className="flex items-end gap-2 px-2">
        <div className="w-24 shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400">Player</div>
        <div className="flex-1 flex items-center justify-center gap-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Bid</span>
          <span className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500">
            ({totalBids}/{round.handSize})
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center gap-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Taken</span>
          <span
            className={`text-xs font-mono font-medium ${tricksValid ? 'text-emerald-500' : 'text-amber-500'}`}
          >
            ({totalTricks}/{round.handSize})
          </span>
        </div>
      </div>

      {orderedPlayerRounds.map((pr) => {
        const player = players.find((p) => p.id === pr.playerId);
        const bl = pr.boardLevel ?? 0;
        const isBoard = bl > 0;
        const isDealer = pr.playerId === round.dealerPlayerId;
        const effectiveBid = isBoard ? round.handSize : pr.bid;
        const isMet = pr.tricksTaken >= effectiveBid;
        const tricksColor = effectiveBid === 0 && pr.tricksTaken === 0
          ? ''
          : isMet
            ? 'text-emerald-500 dark:text-emerald-400'
            : 'text-red-500 dark:text-red-400';

        const nextBoardLevel = Math.min(maxBoardInRound + 1, MAX_BOARD_LEVEL);
        const boardLabel = isBoard
          ? BOARD_LABELS[bl]
          : (BOARD_LABELS[nextBoardLevel] || 'Board');

        return (
          <div
            key={pr.playerId}
            className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            {/* Player name + board toggle */}
            <div className="w-24 shrink-0 flex flex-col gap-1">
              <span className="font-medium text-sm truncate">
                {player?.name}
                {isDealer && (
                  <span className="ml-1 text-xs text-amber-500" title="Dealer">D</span>
                )}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (isBoard) {
                    onBidChange(pr.playerId, pr.bid, 0);
                  } else {
                    onBidChange(pr.playerId, pr.bid, nextBoardLevel);
                  }
                }}
                className={`px-2 py-1.5 text-xs rounded-lg font-medium transition-colors self-start
                  ${isBoard ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
              >
                {boardLabel}
              </button>
            </div>

            {/* Bid stepper */}
            <div className="flex-1 flex items-center justify-center">
              {!isBoard ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onBidChange(pr.playerId, Math.max(0, pr.bid - 1), 0)}
                    className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 text-lg font-bold flex items-center justify-center active:bg-slate-200 dark:active:bg-slate-600"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-lg">{pr.bid}</span>
                  <button
                    type="button"
                    onClick={() =>
                      onBidChange(pr.playerId, Math.min(round.handSize, pr.bid + 1), 0)
                    }
                    className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 text-lg font-bold flex items-center justify-center active:bg-slate-200 dark:active:bg-slate-600"
                  >
                    +
                  </button>
                </div>
              ) : (
                <span className="text-sm font-medium text-amber-500">ALL</span>
              )}
            </div>

            {/* Tricks stepper */}
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onTricksChange(pr.playerId, Math.max(0, pr.tricksTaken - 1))}
                  className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 text-lg font-bold flex items-center justify-center active:bg-slate-200 dark:active:bg-slate-600"
                >
                  -
                </button>
                <span className={`w-8 text-center font-mono font-bold text-lg ${tricksColor}`}>
                  {pr.tricksTaken}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onTricksChange(pr.playerId, Math.min(round.handSize, pr.tricksTaken + 1))
                  }
                  className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 text-lg font-bold flex items-center justify-center active:bg-slate-200 dark:active:bg-slate-600"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
