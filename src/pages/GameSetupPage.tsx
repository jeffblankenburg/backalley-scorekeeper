import { GameSetupForm } from '../components/setup/GameSetupForm.tsx';

export function GameSetupPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">New Game Setup</h2>
      <GameSetupForm />
    </div>
  );
}
