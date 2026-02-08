import type { Suit } from '../../types/index.ts';
import { SUIT_MAP } from '../../lib/constants.ts';

interface SuitIconProps {
  suit: Suit;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
};

export function SuitIcon({ suit, size = 'md' }: SuitIconProps) {
  const info = SUIT_MAP[suit];
  return (
    <span className={`${sizeClasses[size]} leading-none suit-symbol`} style={{ color: info.color }}>
      {info.symbol}
    </span>
  );
}
