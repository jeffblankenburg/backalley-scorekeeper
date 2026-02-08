// Position names for auditory score announcements
// These can be customized later
export const POSITION_NAMES: Record<number, string> = {
  1: 'First Place',
  2: 'Second Place',
  3: 'Third Place',
  4: 'Fourth Place',
  5: 'Fifth Place',
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
