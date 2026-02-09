import type { Game, Player, Suit } from '../../types/index.ts';
import { SUITS } from '../../lib/constants.ts';

const SUIT_CLASS: Record<Suit, string> = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-slate-800 dark:text-slate-200',
  spades: 'text-slate-800 dark:text-slate-200',
};

interface RoundInfoPanelProps {
  game: Game;
  players: Player[];
  onEnterTricks: (roundIndex: number) => void;
}

export function RoundInfoPanel({ game, players, onEnterTricks }: RoundInfoPanelProps) {
  const round = game.rounds[game.currentRoundIndex];
  if (!round || !round.bidsEntered || round.isComplete) return null;

  // Determine who leads: highest bidder, ties broken by bid order (left of dealer first)
  const dealerIdx = game.playerIds.indexOf(round.dealerPlayerId);
  let leadPlayerId = game.playerIds[0];
  let highestBid = -1;
  let bestBidPos = Infinity;
  for (let pi = 0; pi < game.playerIds.length; pi++) {
    const pr = round.playerRounds[pi];
    const effectiveBid = (pr.boardLevel ?? 0) > 0 ? round.handSize : pr.bid;
    const bidPos = ((pi - dealerIdx + game.playerIds.length) % game.playerIds.length) || game.playerIds.length;
    if (effectiveBid > highestBid || (effectiveBid === highestBid && bidPos < bestBidPos)) {
      highestBid = effectiveBid;
      bestBidPos = bidPos;
      leadPlayerId = game.playerIds[pi];
    }
  }

  const leadPlayer = players.find((p) => p.id === leadPlayerId);
  const leadName = leadPlayer?.firstName || leadPlayer?.name || 'Unknown';

  // Over/underbid
  const totalBids = round.playerRounds.reduce(
    (sum, pr) => sum + ((pr.boardLevel ?? 0) > 0 ? round.handSize : pr.bid),
    0,
  );
  const diff = totalBids - round.handSize;

  const suitInfo = SUITS.find((s) => s.suit === round.trumpSuit);

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <div className="w-full max-w-md pointer-events-auto rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg shadow-black/15 dark:shadow-black/40 p-4 space-y-3">
        {/* Lead player */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Lead</span>
            <span className="font-bold text-lg">{leadName}</span>
          </div>
          {suitInfo && (
            <span className={['text-2xl suit-symbol', SUIT_CLASS[suitInfo.suit]].join(' ')}>
              {suitInfo.symbol}
            </span>
          )}
        </div>

        {/* Over/underbid */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500 dark:text-slate-400">Bids: {totalBids}/{round.handSize}</span>
          <span className={[
            'font-bold px-2 py-0.5 rounded-full text-xs',
            diff === 0
              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
              : diff > 0
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
          ].join(' ')}>
            {diff === 0 ? 'Even' : diff > 0 ? `Over ${diff}` : `Under ${Math.abs(diff)}`}
          </span>
        </div>

        {/* Enter Tricks button */}
        <button
          type="button"
          onClick={() => onEnterTricks(game.currentRoundIndex)}
          className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold text-lg transition-all active:scale-[0.98] hover:bg-emerald-600"
        >
          Enter Tricks
        </button>
      </div>
    </div>
  );
}
