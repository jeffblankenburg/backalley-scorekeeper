export const STANDINGS_THEMES: Record<string, { label: string; positions: string[] }> = {
  default: {
    label: 'Default',
    positions: ['First Place', 'Second Place', 'Third Place', 'Fourth Place', 'Fifth Place'],
  },
  explicit: {
    label: 'Explicit',
    positions: ['Team Captain', 'Co-Captain', 'Team Member', 'Team Alternate', 'Shitboy'],
  },
  military: {
    label: 'Military',
    positions: ['General', 'Colonel', 'Major', 'Captain', 'Private'],
  },
  royalty: {
    label: 'Royalty',
    positions: ['King', 'Duke', 'Earl', 'Baron', 'Peasant'],
  },
  pirate: {
    label: 'Pirate',
    positions: ['Captain', 'First Mate', 'Quartermaster', 'Deckhand', 'Bilge Rat'],
  },
};

export function getPositionName(position: number, style = 'default'): string {
  const theme = STANDINGS_THEMES[style] ?? STANDINGS_THEMES.default;
  return theme.positions[position - 1] ?? `Position ${position}`;
}

export interface StandingEntry {
  name: string;
  score: number;
  position: number;
}

export function announceScores(standings: StandingEntry[], style = 'default'): void {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  const lines = standings.map(
    (s) => `${getPositionName(s.position, style)}: ${s.name}, with ${s.score} points.`,
  );

  const text = 'Current standings. ' + lines.join(' ');
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  window.speechSynthesis.speak(utterance);
}
