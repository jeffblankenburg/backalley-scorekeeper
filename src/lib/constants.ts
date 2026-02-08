import type { Suit } from '../types/index.ts';

export const ROUND_HAND_SIZES = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const TOTAL_ROUNDS = 20;
export const PLAYER_COUNT = 5;
export const RAINBOW_HAND_SIZE = 4;
export const RAINBOW_BONUS = 8;

export const SUITS: { suit: Suit; label: string; color: string; symbol: string }[] = [
  { suit: 'hearts', label: 'Hearts', color: '#ef4444', symbol: '♥' },
  { suit: 'diamonds', label: 'Diamonds', color: '#3b82f6', symbol: '♦' },
  { suit: 'clubs', label: 'Clubs', color: '#10b981', symbol: '♣' },
  { suit: 'spades', label: 'Spades', color: '#1e1e1e', symbol: '♠' },
];

export const SUIT_MAP = Object.fromEntries(SUITS.map((s) => [s.suit, s])) as Record<
  Suit,
  (typeof SUITS)[number]
>;
