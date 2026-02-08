import { useRef, useEffect } from 'react';
import type { Game, Player, Suit } from '../../types/index.ts';
import { MAX_BOARD_LEVEL } from '../../types/index.ts';
import { SUITS, RAINBOW_HAND_SIZE } from '../../lib/constants.ts';

const SUIT_CLASS: Record<Suit, string> = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-slate-800 dark:text-slate-200',
  spades: 'text-slate-800 dark:text-slate-200',
};

interface PaperScoresheetProps {
  game: Game;
  players: Player[];
  onBidChange: (playerId: string, bid: number, boardLevel: number) => void;
  onTricksChange: (playerId: string, tricks: number) => void;
  onTrumpChange: (suit: Suit) => void;
  onRainbowToggle: (playerId: string, rainbow: boolean) => void;
  onCompleteRound: () => void;
  onNavigate: (roundIndex: number) => void;
}

export function PaperScoresheet({
  game,
  players,
  onBidChange,
  onTricksChange,
  onTrumpChange,
  onRainbowToggle,
  onCompleteRound,
  onNavigate,
}: PaperScoresheetProps) {
  const currentRowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      currentRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    return () => clearTimeout(t);
  }, [game.currentRoundIndex]);

  const currentRound = game.rounds[game.currentRoundIndex];
  const totalTricks = currentRound.playerRounds.reduce((sum, pr) => sum + pr.tricksTaken, 0);
  const tricksValid = totalTricks === currentRound.handSize;
  const hasTrump = currentRound.trumpSuit !== null;
  const canComplete = hasTrump && tricksValid && !currentRound.isComplete;

  const maxBoardInRound = Math.max(
    0,
    ...currentRound.playerRounds.map((pr) => pr.boardLevel ?? 0),
  );
  const nextBoardLevel = Math.min(maxBoardInRound + 1, MAX_BOARD_LEVEL);

  return (
    <div className="space-y-3">
      {/* Scoresheet table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80">
              <th className="py-2 px-1 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 w-7 border-r border-slate-200 dark:border-slate-700">
                #
              </th>
              {game.playerIds.map((pid) => {
                const player = players.find((p) => p.id === pid);
                return (
                  <th
                    key={pid}
                    className="py-2 px-1 text-center text-[11px] font-bold text-slate-600 dark:text-slate-300 min-w-[68px] border-r border-slate-200 dark:border-slate-700"
                  >
                    {player?.name ?? '?'}
                  </th>
                );
              })}
              <th className="py-2 px-1 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 w-9 border-r border-slate-200 dark:border-slate-700">
                T
              </th>
              <th className="py-2 px-1 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 w-10">
                &Sigma;
              </th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {game.rounds.map((round, ri) => {
              const isCurrent = ri === game.currentRoundIndex;
              const isEditable = isCurrent && !round.isComplete;
              const isComplete = round.isComplete;
              const isFuture = !isComplete && !isCurrent;
              const isRainbowRound = round.handSize === RAINBOW_HAND_SIZE;

              const roundBids = round.playerRounds.reduce(
                (sum, pr) => sum + ((pr.boardLevel ?? 0) > 0 ? round.handSize : pr.bid),
                0,
              );

              return (
                <tr
                  key={ri}
                  ref={isCurrent ? currentRowRef : undefined}
                  onClick={() => {
                    if (isComplete && !isCurrent) onNavigate(ri);
                  }}
                  className={[
                    'border-t',
                    isCurrent
                      ? 'border-blue-300 dark:border-blue-700 bg-blue-50/80 dark:bg-blue-950/30'
                      : 'border-slate-100 dark:border-slate-800',
                    isComplete && !isCurrent
                      ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      : '',
                    isFuture ? 'opacity-25' : '',
                  ].join(' ')}
                >
                  {/* Hand size */}
                  <td
                    className={[
                      'py-1 px-1 text-center font-bold border-r border-slate-200 dark:border-slate-700',
                      isCurrent ? 'text-blue-600 dark:text-blue-400' : '',
                      isRainbowRound && !isCurrent ? 'text-amber-500' : '',
                    ].join(' ')}
                  >
                    {round.handSize}
                  </td>

                  {/* Player cells */}
                  {game.playerIds.map((pid) => {
                    const pr = round.playerRounds.find((p) => p.playerId === pid);
                    if (!pr)
                      return (
                        <td
                          key={pid}
                          className="border-r border-slate-200 dark:border-slate-700"
                        />
                      );

                    const isDealer = pid === round.dealerPlayerId;
                    const bl = pr.boardLevel ?? 0;
                    const isBoard = bl > 0;
                    const effectiveBid = isBoard ? round.handSize : pr.bid;

                    // === EDITABLE CELL ===
                    if (isEditable) {
                      const boardBtnLabel = isBoard
                        ? bl === 1
                          ? 'B'
                          : `B${bl}`
                        : nextBoardLevel === 1
                          ? 'B'
                          : `B${nextBoardLevel}`;

                      return (
                        <td
                          key={pid}
                          className={[
                            'py-1 px-0.5 text-center border-r border-slate-200 dark:border-slate-700 relative',
                            isBoard ? 'bg-amber-50 dark:bg-amber-950/20' : '',
                          ].join(' ')}
                        >
                          {isDealer && (
                            <div className="absolute top-0 left-0.5 text-[8px] font-bold text-amber-500 leading-none">
                              D
                            </div>
                          )}

                          {/* Bid controls */}
                          {!isBoard ? (
                            <div className="flex items-center justify-center gap-px">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onBidChange(pid, Math.max(0, pr.bid - 1), 0);
                                }}
                                className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-700 text-[10px] font-bold flex items-center justify-center active:bg-slate-300 dark:active:bg-slate-600"
                              >
                                &minus;
                              </button>
                              <span className="w-5 text-center font-bold text-sm leading-none">
                                {pr.bid}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onBidChange(
                                    pid,
                                    Math.min(round.handSize, pr.bid + 1),
                                    0,
                                  );
                                }}
                                className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-700 text-[10px] font-bold flex items-center justify-center active:bg-slate-300 dark:active:bg-slate-600"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <div className="text-[10px] font-bold text-amber-500 leading-tight">
                              ALL
                            </div>
                          )}

                          {/* Fraction bar */}
                          <div className="border-t border-slate-300 dark:border-slate-600 mx-1 my-px" />

                          {/* Taken controls */}
                          <div className="flex items-center justify-center gap-px">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onTricksChange(pid, Math.max(0, pr.tricksTaken - 1));
                              }}
                              className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-700 text-[10px] font-bold flex items-center justify-center active:bg-slate-300 dark:active:bg-slate-600"
                            >
                              &minus;
                            </button>
                            <span
                              className={[
                                'w-5 text-center font-bold text-sm leading-none',
                                effectiveBid === 0 && pr.tricksTaken === 0
                                  ? ''
                                  : pr.tricksTaken >= effectiveBid
                                    ? 'text-emerald-500'
                                    : 'text-red-500',
                              ].join(' ')}
                            >
                              {pr.tricksTaken}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onTricksChange(
                                  pid,
                                  Math.min(round.handSize, pr.tricksTaken + 1),
                                );
                              }}
                              className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-700 text-[10px] font-bold flex items-center justify-center active:bg-slate-300 dark:active:bg-slate-600"
                            >
                              +
                            </button>
                          </div>

                          {/* Cumulative + Board + Rainbow */}
                          <div className="flex items-center justify-center gap-0.5 mt-0.5">
                            <span
                              className={[
                                'text-[10px] leading-none',
                                pr.cumulativeScore > 0
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : pr.cumulativeScore < 0
                                    ? 'text-red-500'
                                    : 'text-slate-400',
                              ].join(' ')}
                            >
                              {pr.cumulativeScore}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isBoard) onBidChange(pid, pr.bid, 0);
                                else onBidChange(pid, pr.bid, nextBoardLevel);
                              }}
                              className={[
                                'text-[8px] font-bold px-1 py-0.5 rounded leading-none',
                                isBoard
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400',
                              ].join(' ')}
                            >
                              {boardBtnLabel}
                            </button>
                            {isRainbowRound && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRainbowToggle(pid, !pr.rainbow);
                                }}
                                className={[
                                  'text-[8px] px-1 py-0.5 rounded leading-none font-bold',
                                  pr.rainbow
                                    ? 'bg-gradient-to-r from-red-400 to-emerald-400 text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400',
                                ].join(' ')}
                              >
                                R
                              </button>
                            )}
                          </div>
                        </td>
                      );
                    }

                    // === FUTURE CELL ===
                    if (isFuture) {
                      return (
                        <td
                          key={pid}
                          className="py-1 px-1 text-center text-slate-300 dark:text-slate-700 border-r border-slate-200 dark:border-slate-700"
                        >
                          &middot;
                        </td>
                      );
                    }

                    // === COMPLETED CELL ===
                    return (
                      <td
                        key={pid}
                        className={[
                          'py-1 px-1 text-center border-r border-slate-200 dark:border-slate-700',
                          isBoard ? 'bg-amber-50/40 dark:bg-amber-950/10' : '',
                        ].join(' ')}
                      >
                        <div className="leading-tight">
                          {isDealer && (
                            <span className="text-[8px] text-amber-500 font-bold">D </span>
                          )}
                          <span className={isBoard ? 'font-bold text-amber-500' : ''}>
                            {isBoard ? `B${bl > 1 ? bl : ''}` : pr.bid}
                          </span>
                          <span className="text-slate-400 dark:text-slate-600">/</span>
                          <span
                            className={
                              effectiveBid === 0 && pr.tricksTaken === 0
                                ? 'text-slate-400'
                                : pr.tricksTaken >= effectiveBid
                                  ? 'text-emerald-500 dark:text-emerald-400'
                                  : 'text-red-500 dark:text-red-400'
                            }
                          >
                            {pr.tricksTaken}
                          </span>
                          {pr.rainbow && <span className="text-[7px]"> R</span>}
                        </div>
                        <div
                          className={[
                            'text-[10px] leading-tight font-semibold',
                            pr.cumulativeScore > 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : pr.cumulativeScore < 0
                                ? 'text-red-500 dark:text-red-400'
                                : 'text-slate-400',
                          ].join(' ')}
                        >
                          {pr.cumulativeScore}
                        </div>
                      </td>
                    );
                  })}

                  {/* Trump column */}
                  <td className="py-1 px-1 text-center border-r border-slate-200 dark:border-slate-700">
                    {isEditable ? (
                      <div className="grid grid-cols-2 gap-px">
                        {SUITS.map((s) => (
                          <button
                            key={s.suit}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTrumpChange(s.suit);
                            }}
                            className={[
                              'text-sm leading-none p-0.5 rounded transition-all',
                              SUIT_CLASS[s.suit],
                              round.trumpSuit === s.suit
                                ? 'ring-1 ring-blue-500 bg-blue-50 dark:bg-blue-900/40 scale-110 font-bold'
                                : 'opacity-50 hover:opacity-100',
                            ].join(' ')}
                          >
                            {s.symbol}
                          </button>
                        ))}
                      </div>
                    ) : round.trumpSuit ? (
                      <span className={['font-bold text-sm', SUIT_CLASS[round.trumpSuit]].join(' ')}>
                        {round.trumpSuit.charAt(0).toUpperCase()}
                      </span>
                    ) : null}
                  </td>

                  {/* Bid total */}
                  <td className="py-1 px-1 text-center text-slate-500 dark:text-slate-400">
                    {(isComplete || isCurrent) && (
                      <>
                        <span
                          className={
                            roundBids === round.handSize ? 'text-amber-500 font-bold' : ''
                          }
                        >
                          {roundBids}
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">
                          /{round.handSize}
                        </span>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Complete Round button */}
      <button
        type="button"
        onClick={onCompleteRound}
        disabled={!canComplete}
        className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold text-lg disabled:opacity-40 transition-colors hover:bg-emerald-600"
      >
        {currentRound.isComplete ? 'Round Complete' : 'Complete Round'}
      </button>
    </div>
  );
}
