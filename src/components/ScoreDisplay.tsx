import type { ScoreState } from '../types';

interface ScoreDisplayProps {
  score: ScoreState;
  onReset: () => void;
}

export function ScoreDisplay({ score, onReset }: ScoreDisplayProps) {
  const { correct, attempts } = score;
  const pct =
    attempts === 0 ? 0 : Math.round((correct / attempts) * 100);

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2 bg-stone-100 rounded-lg px-4 py-2 border border-stone-200">
        <span className="text-stone-500 text-sm">Score</span>
        <span className="font-bold text-stone-800">
          {correct} / {attempts}
        </span>
        {attempts > 0 && (
          <span
            className={`text-sm font-semibold ${
              pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-amber-600' : 'text-red-500'
            }`}
          >
            ({pct}%)
          </span>
        )}
      </div>
      <button
        onClick={onReset}
        className="text-sm text-stone-400 hover:text-stone-600 underline underline-offset-2 transition-colors"
        aria-label="Reset score"
      >
        Reset
      </button>
    </div>
  );
}
