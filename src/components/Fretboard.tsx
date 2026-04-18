import type { NoteName, QuizState, StringIndex } from '../types';
import {
  FRETBOARD,
  FRET_COUNT,
  GUITAR_STRINGS,
  DOT_FRETS,
  DOUBLE_DOT_FRET,
} from '../utils/noteUtils';

interface FretboardProps {
  quiz: QuizState;
  activeStringIndices: StringIndex[];
  showNotes: boolean;
  onFretClick: (stringIndex: StringIndex, fret: number) => void;
}

const FRETS = Array.from({ length: FRET_COUNT }, (_, i) => i + 1);

function getFretCellStyle(
  stringIndex: StringIndex,
  fret: number,
  note: NoteName,
  quiz: QuizState,
  activeStringIndices: StringIndex[]
): string {
  const isActive = activeStringIndices.includes(stringIndex);
  const { target, answered, wasCorrect, mode } = quiz;
  const isTarget = target.stringIndex === stringIndex && target.fret === fret;

  let bg = 'bg-transparent';
  let textColor = isActive ? 'text-amber-100' : 'text-stone-600';
  let ring = '';

  if (mode === 'name-note' && isTarget) {
    bg = 'bg-amber-500';
    textColor = 'text-white';
    if (!answered) ring = 'ring-2 ring-amber-300';
  } else if (answered && mode === 'find-note') {
    if (isTarget) {
      bg = wasCorrect ? 'bg-green-600' : 'bg-red-600';
      textColor = 'text-white';
    } else if (note === target.note && isActive) {
      bg = 'bg-green-800';
      textColor = 'text-white';
    }
  }

  const interactive =
    mode === 'find-note' && isActive && !answered
      ? 'cursor-pointer hover:bg-stone-600/60 active:scale-95'
      : '';

  return [bg, textColor, ring, interactive].filter(Boolean).join(' ');
}

export function Fretboard({
  quiz,
  activeStringIndices,
  showNotes,
  onFretClick,
}: FretboardProps) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="min-w-[580px]">
        <div className="flex">
          <div className="w-16 shrink-0" />
          {FRETS.map((fret) => (
            <div
              key={fret}
              className="flex-1 text-center text-xs text-stone-500 font-mono pb-1 select-none"
            >
              {fret}
            </div>
          ))}
        </div>

        <div className="rounded-lg overflow-hidden border border-stone-700 bg-stone-900">
          {GUITAR_STRINGS.map(({ index, label }) => {
            const isActive = activeStringIndices.includes(index);
            const openNote = FRETBOARD[index][0];
            const openCellStyle = getFretCellStyle(index, 0, openNote, quiz, activeStringIndices);
            const isInteractive = isActive && quiz.mode === 'find-note' && !quiz.answered;

            return (
              <div key={index} className="flex items-stretch border-b border-stone-700 last:border-b-0">
                <div
                  className={`w-16 shrink-0 flex flex-col items-center justify-center border-r-2 border-r-stone-500 py-1 select-none transition-all duration-100 ${openCellStyle}`}
                  style={{ minHeight: '2.75rem' }}
                  onClick={() => isInteractive && onFretClick(index, 0)}
                  role={isInteractive ? 'button' : undefined}
                  aria-label={`${label} string, open, note ${openNote}`}
                >
                  <span className={`text-xs font-bold leading-tight ${isActive ? 'text-amber-300' : 'text-stone-600'}`}>
                    {label}
                  </span>
                  {(showNotes || !isActive || quiz.answered) && (
                    <span className="text-[10px] font-semibold leading-tight opacity-80">
                      ({openNote})
                    </span>
                  )}
                </div>

                {FRETS.map((fret) => {
                  const note = FRETBOARD[index][fret];
                  const cellStyle = getFretCellStyle(index, fret, note, quiz, activeStringIndices);
                  const isDot = DOT_FRETS.includes(fret) && index === 2;
                  const isDoubleDot = fret === DOUBLE_DOT_FRET && (index === 1 || index === 3);

                  return (
                    <div
                      key={fret}
                      className={`flex-1 relative flex items-center justify-center border-r border-stone-700 last:border-r-0 transition-all duration-100 select-none ${cellStyle}`}
                      style={{ minHeight: '2.75rem' }}
                      onClick={() => isInteractive && onFretClick(index, fret)}
                      role={isInteractive ? 'button' : undefined}
                      aria-label={`${label} string, fret ${fret}, note ${note}`}
                    >
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 left-0 right-0 w-full pointer-events-none ${
                          isActive ? 'bg-amber-200/30' : 'bg-stone-700/30'
                        }`}
                        style={{ height: `${1 + (5 - Number(index)) * 0.4}px` }}
                      />

                      {(isDot || isDoubleDot) && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-stone-500 pointer-events-none z-10" />
                      )}

                      {(showNotes || !isActive || quiz.answered) && (
                        <span
                          className={`relative z-20 text-center font-semibold leading-tight pointer-events-none ${
                            isActive ? 'text-[10px]' : 'text-[9px] opacity-40'
                          }`}
                        >
                          {note}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="flex mt-1">
          <div className="w-16 shrink-0" />
          {FRETS.map((fret) => (
            <div key={fret} className="flex-1 flex justify-center">
              {fret === DOUBLE_DOT_FRET ? (
                <div className="flex gap-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-500" />
                </div>
              ) : DOT_FRETS.includes(fret) ? (
                <div className="w-1.5 h-1.5 rounded-full bg-stone-500" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
