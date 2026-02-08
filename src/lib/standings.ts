// Position names for auditory score announcements
// These can be customized later
export const POSITION_NAMES: Record<number, string> = {
  1: 'Team Captain',
  2: 'Co-Captain',
  3: 'Team Member',
  4: 'Team Alternate',
  5: 'Shitboy',
};

export interface StandingEntry {
  name: string;
  score: number;
  position: number;
}

export function announceScores(standings: StandingEntry[]): void {
  if (!('speechSynthesis' in window)) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const lines = standings.map(
    (s) => `${POSITION_NAMES[s.position] ?? `Position ${s.position}`}: ${s.name}, with ${s.score} points.`,
  );

  const text = 'Current standings. ' + lines.join(' ');
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  window.speechSynthesis.speak(utterance);
}
