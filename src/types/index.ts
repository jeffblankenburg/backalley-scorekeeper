export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type GameStatus = 'setup' | 'in_progress' | 'completed';

export const MAX_BOARD_LEVEL = 5;
export const BOARD_LABELS: Record<number, string> = {
  0: '',
  1: 'Board',
  2: 'Dbl Board',
  3: 'Trpl Board',
  4: 'Quad Board',
  5: 'Quint Board',
};

export interface Player {
  id: string;
  name: string;
  createdAt: number;
}

export interface PlayerRound {
  playerId: string;
  bid: number;
  boardLevel: number; // 0 = normal, 1-5 = board tiers
  tricksTaken: number;
  rainbow: boolean;
  jobo: boolean;
  score: number;
  cumulativeScore: number;
}

export interface Round {
  roundIndex: number;
  handSize: number;
  trumpSuit: Suit | null;
  dealerPlayerId: string;
  playerRounds: PlayerRound[];
  bidsEntered: boolean;
  isComplete: boolean;
}

export interface Game {
  id: string;
  createdAt: number;
  completedAt?: number;
  status: GameStatus;
  playerIds: string[];
  startingDealerIndex: number;
  rounds: Round[];
  currentRoundIndex: number;
}
