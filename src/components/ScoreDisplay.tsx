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
    <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg px-3 py-1.5 border border-stone-300 shadow-sm">
      <span className="text-stone-500 text-xs font-medium">Score</span>
      <span className="font-bold text-stone-800 text-sm">
        {correct}/{attempts}
      </span>
      {attempts > 0 && (
        <span
          className={`text-xs font-semibold ${
            pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-amber-600' : 'text-red-500'
          }`}
        >
          ({pct}%)
        </span>
      )}
      {attempts > 0 && (
        <button
          onClick={onReset}
          className="ml-1.5 bg-transparent text-[#92400e] hover:bg-[#92400e] hover:text-white transition-colors duration-150 text-sm font-medium rounded-[6px]"
          style={{ border: '1.5px solid #92400e', padding: '4px 12px' }}
          aria-label="Reset score"
        >
          Reset
        </button>
      )}
    </div>
  );
}
