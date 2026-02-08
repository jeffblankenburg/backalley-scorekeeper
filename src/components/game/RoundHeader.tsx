import type { Round } from '../../types/index.ts';
import type { Player } from '../../types/index.ts';
import { SuitIcon } from '../common/SuitIcon.tsx';
import { TOTAL_ROUNDS } from '../../lib/constants.ts';

interface RoundHeaderProps {
  round: Round;
  dealer: Player | undefined;
}

export function RoundHeader({ round, dealer }: RoundHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Round {round.roundIndex + 1} of {TOTAL_ROUNDS}
        </div>
        <div className="text-xl font-bold">{round.handSize} cards</div>
      </div>
      <div className="text-right">
        <div className="text-sm text-slate-500 dark:text-slate-400">Dealer</div>
        <div className="font-medium">{dealer?.name ?? '?'}</div>
      </div>
      <div className="text-right">
        <div className="text-sm text-slate-500 dark:text-slate-400">Trump</div>
        {round.trumpSuit ? <SuitIcon suit={round.trumpSuit} size="lg" /> : <span className="text-2xl">?</span>}
      </div>
    </div>
  );
}
