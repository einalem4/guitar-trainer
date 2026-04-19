import { GUITAR_STRINGS } from '../utils/noteUtils';
import type { StringIndex } from '../types';

interface StringProgressProps {
  activeIndices: StringIndex[];
  onToggleString: (index: StringIndex) => void;
}

export function StringProgress({ activeIndices, onToggleString }: StringProgressProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm text-stone-500 font-medium">Strings:</span>
      <div className="flex gap-2">
        {GUITAR_STRINGS.map(({ index, label }) => {
          const isActive = activeIndices.includes(index);
          const isOnlyActive = isActive && activeIndices.length === 1;

          return (
            <button
              key={index}
              onClick={() => onToggleString(index)}
              disabled={isOnlyActive}
              className={`shrink-0 px-3 py-2 min-h-[44px] rounded text-xs sm:text-sm font-bold border transition-colors select-none ${
                isActive
                  ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600'
                  : 'bg-stone-100 text-stone-700 border-stone-300 hover:border-amber-400 hover:bg-stone-200'
              } ${isOnlyActive ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
              title={
                isOnlyActive
                  ? 'At least one string must be active'
                  : isActive
                  ? 'Click to deactivate'
                  : 'Click to activate'
              }
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
