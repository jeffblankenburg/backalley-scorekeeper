import type { Game, Round, PlayerRound, Suit } from '../types/index.ts';
import { ROUND_HAND_SIZES, PLAYER_COUNT, RAINBOW_HAND_SIZE } from './constants.ts';
import { calculateScore } from './scoring.ts';
import { generateId } from './utils.ts';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function distributeTricks(total: number, count: number): number[] {
  const result = new Array(count).fill(0);
  for (let i = 0; i < total; i++) {
    result[randomInt(0, count - 1)]++;
  }
  return result;
}

export function simulateGame(playerIds: string[], startingDealerIndex: number): Game {
  const id = generateId();
  const createdAt = Date.now() - randomInt(0, 30 * 24 * 60 * 60 * 1000);
  const rounds: Round[] = [];

  for (let ri = 0; ri < ROUND_HAND_SIZES.length; ri++) {
    const handSize = ROUND_HAND_SIZES[ri];
    const trumpSuit = pickRandom(SUITS);
    const dealerPlayerId = playerIds[(startingDealerIndex + ri) % PLAYER_COUNT];

    const bids: { bid: number; boardLevel: number }[] = playerIds.map(() => {
      const roll = Math.random();
      if (roll < 0.05 && handSize <= 6) {
        // ~5% chance of board bid on smaller hands, with rare higher tiers
        const tierRoll = Math.random();
        const boardLevel = tierRoll < 0.7 ? 1 : tierRoll < 0.9 ? 2 : tierRoll < 0.97 ? 3 : tierRoll < 0.99 ? 4 : 5;
        return { bid: handSize, boardLevel };
      } else if (roll < 0.25) {
        return { bid: 0, boardLevel: 0 };
      } else {
        const maxBid = Math.min(handSize, Math.ceil(handSize * 0.6));
        return { bid: randomInt(1, Math.max(1, maxBid)), boardLevel: 0 };
      }
    });

    const tricks = distributeTricks(handSize, PLAYER_COUNT);

    const playerRounds: PlayerRound[] = playerIds.map((playerId, pi) => {
      const { bid, boardLevel } = bids[pi];
      const tricksTaken = tricks[pi];
      const rainbow = handSize === RAINBOW_HAND_SIZE && tricksTaken > 0 && Math.random() < 0.3;
      const score = calculateScore(bid, boardLevel, tricksTaken, handSize, rainbow);
      return {
        playerId,
        bid,
        boardLevel,
        tricksTaken,
        rainbow,
        jobo: false,
        score,
        cumulativeScore: 0,
      };
    });

    rounds.push({
      roundIndex: ri,
      handSize,
      trumpSuit,
      dealerPlayerId,
      playerRounds,
      bidsEntered: true,
      isComplete: true,
    });
  }

  for (let ri = 0; ri < rounds.length; ri++) {
    for (const pr of rounds[ri].playerRounds) {
      if (ri === 0) {
        pr.cumulativeScore = pr.score;
      } else {
        const prev = rounds[ri - 1].playerRounds.find((p) => p.playerId === pr.playerId);
        pr.cumulativeScore = (prev?.cumulativeScore ?? 0) + pr.score;
      }
    }
  }

  return {
    id,
    createdAt,
    completedAt: createdAt + randomInt(30 * 60 * 1000, 90 * 60 * 1000),
    status: 'completed',
    playerIds,
    startingDealerIndex,
    rounds,
    currentRoundIndex: 19,
  };
}
