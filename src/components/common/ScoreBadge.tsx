interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md';
}

export function ScoreBadge({ score, size = 'md' }: ScoreBadgeProps) {
  const color =
    score > 0
      ? 'text-emerald-500 dark:text-emerald-400'
      : score < 0
        ? 'text-red-500 dark:text-red-400'
        : 'text-slate-500 dark:text-slate-400';

  const textSize = size === 'sm' ? 'text-sm' : 'text-base';

  return (
    <span className={`font-mono font-bold ${color} ${textSize}`}>
      {score > 0 ? '+' : ''}
      {score}
    </span>
  );
}
