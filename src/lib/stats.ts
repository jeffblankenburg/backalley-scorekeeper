import type { Game, Player } from '../types/index.ts';

export interface PlayerStats {
  playerId: string;
  gamesPlayed: number;
  wins: number;
  winRate: number;
  avgFinalScore: number;
  bestScore: number;
  worstScore: number;
  bidAccuracy: number;
  perfectBidRate: number;
  zeroBidCleanRate: number;
  boardAttempts: number;
  boardSuccesses: number;
  boardSuccessRate: number;
  boardPointsNet: number;
  rainbowCount: number;
  rainbowPoints: number;
  avgScoreAsDealer: number;
  avgScoreNotDealer: number;
}

function getWinner(game: Game): string | null {
  const lastRound = game.rounds[game.rounds.length - 1];
  if (!lastRound?.isComplete) return null;
  let best = -Infinity;
  let winnerId: string | null = null;
  for (const pr of lastRound.playerRounds) {
    if (pr.cumulativeScore > best) {
      best = pr.cumulativeScore;
      winnerId = pr.playerId;
    }
  }
  return winnerId;
}

export function getFinalScore(game: Game, playerId: string): number {
  const lastComplete = [...game.rounds].reverse().find((r) => r.isComplete);
  return lastComplete?.playerRounds.find((p) => p.playerId === playerId)?.cumulativeScore ?? 0;
}

export function computePlayerStats(games: Game[], players: Player[]): Map<string, PlayerStats> {
  const completed = games.filter((g) => g.status === 'completed');
  const result = new Map<string, PlayerStats>();

  for (const player of players) {
    const pid = player.id;
    const playerGames = completed.filter((g) => g.playerIds.includes(pid));
    const gamesPlayed = playerGames.length;

    if (gamesPlayed === 0) {
      result.set(pid, {
        playerId: pid,
        gamesPlayed: 0,
        wins: 0,
        winRate: 0,
        avgFinalScore: 0,
        bestScore: 0,
        worstScore: 0,
        bidAccuracy: 0,
        perfectBidRate: 0,
        zeroBidCleanRate: 0,
        boardAttempts: 0,
        boardSuccesses: 0,
        boardSuccessRate: 0,
        boardPointsNet: 0,
        rainbowCount: 0,
        rainbowPoints: 0,
        avgScoreAsDealer: 0,
        avgScoreNotDealer: 0,
      });
      continue;
    }

    const wins = playerGames.filter((g) => getWinner(g) === pid).length;
    const finalScores = playerGames.map((g) => getFinalScore(g, pid));

    let totalNonZeroBids = 0;
    let madeBids = 0;
    let perfectBids = 0;
    let zeroBids = 0;
    let zeroBidClean = 0;
    let boardAttempts = 0;
    let boardSuccesses = 0;
    let boardPointsNet = 0;
    let rainbowCount = 0;
    let rainbowPoints = 0;
    let dealerScoreSum = 0;
    let dealerRounds = 0;
    let nonDealerScoreSum = 0;
    let nonDealerRounds = 0;

    for (const game of playerGames) {
      for (const round of game.rounds) {
        if (!round.isComplete) continue;
        const pr = round.playerRounds.find((p) => p.playerId === pid);
        if (!pr) continue;

        if (pr.boardLevel > 0) {
          boardAttempts++;
          if (pr.tricksTaken === round.handSize) {
            boardSuccesses++;
          }
          boardPointsNet += pr.score - (pr.rainbow ? 8 : 0); // exclude rainbow from board calc
        } else if (pr.bid === 0) {
          zeroBids++;
          if (pr.tricksTaken === 0) zeroBidClean++;
        } else {
          totalNonZeroBids++;
          if (pr.tricksTaken >= pr.bid) madeBids++;
          if (pr.tricksTaken === pr.bid) perfectBids++;
        }

        if (pr.rainbow) {
          rainbowCount++;
          rainbowPoints += 8;
        }

        if (round.dealerPlayerId === pid) {
          dealerScoreSum += pr.score;
          dealerRounds++;
        } else {
          nonDealerScoreSum += pr.score;
          nonDealerRounds++;
        }
      }
    }

    result.set(pid, {
      playerId: pid,
      gamesPlayed,
      wins,
      winRate: gamesPlayed > 0 ? wins / gamesPlayed : 0,
      avgFinalScore: finalScores.reduce((a, b) => a + b, 0) / gamesPlayed,
      bestScore: Math.max(...finalScores),
      worstScore: Math.min(...finalScores),
      bidAccuracy: totalNonZeroBids > 0 ? madeBids / totalNonZeroBids : 0,
      perfectBidRate: totalNonZeroBids > 0 ? perfectBids / totalNonZeroBids : 0,
      zeroBidCleanRate: zeroBids > 0 ? zeroBidClean / zeroBids : 0,
      boardAttempts,
      boardSuccesses,
      boardSuccessRate: boardAttempts > 0 ? boardSuccesses / boardAttempts : 0,
      boardPointsNet,
      rainbowCount,
      rainbowPoints,
      avgScoreAsDealer: dealerRounds > 0 ? dealerScoreSum / dealerRounds : 0,
      avgScoreNotDealer: nonDealerRounds > 0 ? nonDealerScoreSum / nonDealerRounds : 0,
    });
  }

  return result;
}

export interface HandSizePerformance {
  handSize: number;
  avgScore: number;
  rounds: number;
}

export function getHandSizePerformance(
  games: Game[],
  playerId: string,
): HandSizePerformance[] {
  const completed = games.filter((g) => g.status === 'completed' && g.playerIds.includes(playerId));
  const bySize = new Map<number, { total: number; count: number }>();

  for (const game of completed) {
    for (const round of game.rounds) {
      if (!round.isComplete) continue;
      const pr = round.playerRounds.find((p) => p.playerId === playerId);
      if (!pr) continue;
      const entry = bySize.get(round.handSize) ?? { total: 0, count: 0 };
      entry.total += pr.score;
      entry.count++;
      bySize.set(round.handSize, entry);
    }
  }

  return Array.from(bySize.entries())
    .map(([handSize, data]) => ({
      handSize,
      avgScore: data.count > 0 ? data.total / data.count : 0,
      rounds: data.count,
    }))
    .sort((a, b) => a.handSize - b.handSize);
}

export interface HeadToHeadRecord {
  player1Id: string;
  player2Id: string;
  player1Wins: number;
  player2Wins: number;
  ties: number;
  avgDifferential: number;
}

export function getHeadToHead(
  games: Game[],
  player1Id: string,
  player2Id: string,
): HeadToHeadRecord {
  const completed = games.filter(
    (g) =>
      g.status === 'completed' &&
      g.playerIds.includes(player1Id) &&
      g.playerIds.includes(player2Id),
  );

  let p1Wins = 0;
  let p2Wins = 0;
  let ties = 0;
  let diffSum = 0;

  for (const game of completed) {
    const s1 = getFinalScore(game, player1Id);
    const s2 = getFinalScore(game, player2Id);
    if (s1 > s2) p1Wins++;
    else if (s2 > s1) p2Wins++;
    else ties++;
    diffSum += s1 - s2;
  }

  return {
    player1Id,
    player2Id,
    player1Wins: p1Wins,
    player2Wins: p2Wins,
    ties,
    avgDifferential: completed.length > 0 ? diffSum / completed.length : 0,
  };
}

export interface TrendPoint {
  gameIndex: number;
  score: number;
  rollingAvg: number;
}

export function getScoreTrends(games: Game[], playerId: string, windowSize = 5): TrendPoint[] {
  const completed = games
    .filter((g) => g.status === 'completed' && g.playerIds.includes(playerId))
    .sort((a, b) => a.createdAt - b.createdAt);

  const points: TrendPoint[] = [];
  for (let i = 0; i < completed.length; i++) {
    const score = getFinalScore(completed[i], playerId);
    const windowStart = Math.max(0, i - windowSize + 1);
    const window = completed.slice(windowStart, i + 1);
    const rollingAvg =
      window.reduce((sum, g) => sum + getFinalScore(g, playerId), 0) / window.length;
    points.push({ gameIndex: i + 1, score, rollingAvg });
  }
  return points;
}
