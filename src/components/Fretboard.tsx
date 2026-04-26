import { useEffect, useRef, useState } from 'react';
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
const MOBILE_VISIBLE = 5;

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
  let textColor = isActive ? 'text-amber-100' : 'text-stone-300';
  let ring = '';

  if (mode === 'name-note' && isTarget) {
    if (answered) {
      bg = 'bg-green-600';
    } else {
      bg = 'bg-amber-500';
      ring = 'ring-2 ring-amber-300';
    }
    textColor = 'text-white';
  } else if (answered && mode === 'find-note') {
    const isAnsweredAt =
      !wasCorrect &&
      quiz.answeredAt?.stringIndex === stringIndex &&
      quiz.answeredAt?.fret === fret;

    if (isTarget) {
      bg = 'bg-green-600';
      textColor = 'text-white';
    } else if (isAnsweredAt) {
      bg = 'bg-red-600';
      textColor = 'text-white';
    } else if (wasCorrect && note === target.note && isActive && stringIndex === target.stringIndex) {
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
  const [fretWindowStart, setFretWindowStart] = useState(1);
  const touchStartX = useRef<number | null>(null);

  const endFret = Math.min(fretWindowStart + MOBILE_VISIBLE - 1, FRET_COUNT);
  const canGoLeft = fretWindowStart > 1;
  const canGoRight = endFret < FRET_COUNT;
  const navigateLeft = () => setFretWindowStart(s => Math.max(1, s - MOBILE_VISIBLE));
  const navigateRight = () => setFretWindowStart(s => Math.min(FRET_COUNT - MOBILE_VISIBLE + 1, s + MOBILE_VISIBLE));
  const mobileFrets = FRETS.filter(f => f >= fretWindowStart && f <= endFret);

  useEffect(() => {
    const t = quiz.target.fret;
    if (t === 0) return;
    if (t < fretWindowStart || t > endFret) {
      setFretWindowStart(Math.min(Math.max(t - 2, 1), FRET_COUNT - MOBILE_VISIBLE + 1));
    }
  }, [quiz.target.fret, quiz.target.stringIndex]);

  const thumbLeft = `${((fretWindowStart - 1) / FRET_COUNT) * 100}%`;
  const thumbWidth = `${(MOBILE_VISIBLE / FRET_COUNT) * 100}%`;
  const reversedStrings = [...GUITAR_STRINGS].reverse();

  // 3 frets centered on the target fret for condensed name-note view
  const nameNoteCenter = quiz.target.fret === 0 ? 2 : Math.min(Math.max(quiz.target.fret, 2), FRET_COUNT - 1);
  const nameNoteFrets = [nameNoteCenter - 1, nameNoteCenter, nameNoteCenter + 1];

  return (
    <>
      {/* ── Mobile view ── */}
      <div className="sm:hidden w-full pb-2">
        {quiz.mode === 'name-note' ? (
          /* Condensed view: 3 frets centered on target, no nav, shorter rows */
          <>
            <div className="flex">
              <div className="w-16 shrink-0" />
              {nameNoteFrets.map(fret => (
                <div key={fret} className="flex-1 text-center text-sm font-semibold text-amber-700 font-mono pb-1 select-none">
                  {fret}
                </div>
              ))}
            </div>

            <div className="rounded-lg overflow-hidden border border-stone-700 bg-stone-900">
              {reversedStrings.map(({ index, label }) => {
                const isActive = activeStringIndices.includes(index);
                const openNote = FRETBOARD[index][0];
                const openCellStyle = getFretCellStyle(index, 0, openNote, quiz, activeStringIndices);

                return (
                  <div key={index} className="flex items-stretch border-b border-stone-700 last:border-b-0">
                    <div
                      className={`w-16 shrink-0 flex flex-col items-center justify-center border-r-2 border-r-stone-500 py-0.5 select-none min-h-8 ${openCellStyle}`}
                      aria-label={`${label} string, open, note ${openNote}`}
                    >
                      <span className={`text-xs font-bold leading-tight ${isActive ? 'text-amber-300' : 'text-stone-500'}`}>
                        {label}
                      </span>
                      {(showNotes || !isActive || quiz.answered) && (
                        <span className="text-[10px] font-semibold leading-tight opacity-80">({openNote})</span>
                      )}
                    </div>

                    {nameNoteFrets.map(fret => {
                      const note = FRETBOARD[index][fret];
                      const cellStyle = getFretCellStyle(index, fret, note, quiz, activeStringIndices);
                      const isDot = DOT_FRETS.includes(fret) && index === 2;
                      const isDoubleDot = fret === DOUBLE_DOT_FRET && (index === 1 || index === 3);

                      return (
                        <div
                          key={fret}
                          className={`flex-1 relative flex items-center justify-center border-r border-stone-700 last:border-r-0 transition-all duration-100 select-none min-h-8 ${cellStyle}`}
                          aria-label={`${label} string, fret ${fret}, note ${note}`}
                        >
                          <div
                            className={`absolute top-1/2 -translate-y-1/2 left-0 right-0 w-full pointer-events-none ${
                              isActive ? 'bg-amber-200/30' : 'bg-stone-500/50'
                            }`}
                            style={{ height: `${1 + (5 - Number(index)) * 0.4}px` }}
                          />
                          {(isDot || isDoubleDot) && (
                            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-stone-500 pointer-events-none z-10" />
                          )}
                          {(showNotes || !isActive || quiz.answered) ? (
                            <span className={`relative z-20 text-center font-semibold leading-tight pointer-events-none ${isActive ? 'text-[10px]' : 'text-[9px] opacity-90'}`}>
                              {note}
                            </span>
                          ) : (
                            <span className="relative z-20 text-[9px] font-semibold text-amber-600/60 pointer-events-none select-none">?</span>
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
              {nameNoteFrets.map(fret => (
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
          </>
        ) : (
          /* Find-note view: 5-fret windowed layout with nav and progress bar */
          <>
            <div className="flex items-center justify-between mb-2 px-1">
              <button
                onClick={navigateLeft}
                disabled={!canGoLeft}
                className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-500 text-white shadow-sm disabled:opacity-40 disabled:cursor-default active:scale-95 transition-all select-none"
                aria-label="Previous frets"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M13 15L8 10L13 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span className="text-base font-bold text-amber-700">
                Frets {fretWindowStart}–{endFret}
              </span>
              <button
                onClick={navigateRight}
                disabled={!canGoRight}
                className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-500 text-white shadow-sm disabled:opacity-40 disabled:cursor-default active:scale-95 transition-all select-none"
                aria-label="Next frets"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 5L12 10L7 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div
              onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
              onTouchEnd={e => {
                if (touchStartX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchStartX.current;
                if (Math.abs(dx) > 40) dx < 0 ? navigateRight() : navigateLeft();
                touchStartX.current = null;
              }}
            >
              <div className="flex">
                <div className="w-16 shrink-0" />
                {mobileFrets.map(fret => (
                  <div key={fret} className="flex-1 text-center text-sm font-semibold text-amber-700 font-mono pb-1 select-none">
                    {fret}
                  </div>
                ))}
              </div>

              <div className="rounded-lg overflow-hidden border border-stone-700 bg-stone-900">
                {reversedStrings.map(({ index, label }) => {
                  const isActive = activeStringIndices.includes(index);
                  const openNote = FRETBOARD[index][0];
                  const openCellStyle = getFretCellStyle(index, 0, openNote, quiz, activeStringIndices);
                  const isInteractive = isActive && !quiz.answered;

                  return (
                    <div key={index} className="flex items-stretch border-b border-stone-700 last:border-b-0">
                      <div
                        className={`group w-16 shrink-0 flex flex-col items-center justify-center border-r-2 border-r-stone-500 py-1 select-none transition-all duration-100 min-h-[44px] ${
                          isInteractive ? 'cursor-pointer hover:bg-amber-500/15 active:scale-95' : ''
                        } ${openCellStyle}`}
                        onClick={() => isInteractive && onFretClick(index, 0)}
                        role={isInteractive ? 'button' : undefined}
                        aria-label={`${label} string, open, note ${openNote}`}
                      >
                        <span className={`text-xs font-bold leading-tight ${isActive ? 'text-amber-300' : 'text-stone-500'}`}>
                          {label}
                        </span>
                        {(showNotes || !isActive || quiz.answered) && (
                          <span className="text-[10px] font-semibold leading-tight opacity-80">({openNote})</span>
                        )}
                        {isInteractive && (
                          <span className="text-[9px] text-amber-400 opacity-0 group-hover:opacity-70 transition-opacity leading-none mt-0.5">tap</span>
                        )}
                      </div>

                      {mobileFrets.map(fret => {
                        const note = FRETBOARD[index][fret];
                        const cellStyle = getFretCellStyle(index, fret, note, quiz, activeStringIndices);
                        const isDot = DOT_FRETS.includes(fret) && index === 2;
                        const isDoubleDot = fret === DOUBLE_DOT_FRET && (index === 1 || index === 3);

                        return (
                          <div
                            key={fret}
                            className={`flex-1 relative flex items-center justify-center border-r border-stone-700 last:border-r-0 transition-all duration-100 select-none min-h-[44px] ${cellStyle}`}
                            onClick={() => isInteractive && onFretClick(index, fret)}
                            role={isInteractive ? 'button' : undefined}
                            aria-label={`${label} string, fret ${fret}, note ${note}`}
                          >
                            <div
                              className={`absolute top-1/2 -translate-y-1/2 left-0 right-0 w-full pointer-events-none ${
                                isActive ? 'bg-amber-200/30' : 'bg-stone-500/50'
                              }`}
                              style={{ height: `${1 + (5 - Number(index)) * 0.4}px` }}
                            />
                            {(isDot || isDoubleDot) && (
                              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-stone-500 pointer-events-none z-10" />
                            )}
                            {(showNotes || !isActive || quiz.answered) ? (
                              <span className={`relative z-20 text-center font-semibold leading-tight pointer-events-none ${isActive ? 'text-[10px]' : 'text-[9px] opacity-90'}`}>
                                {note}
                              </span>
                            ) : (
                              <span className="relative z-20 text-[9px] font-semibold text-amber-600/60 pointer-events-none select-none">?</span>
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
                {mobileFrets.map(fret => (
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

              <div className="mt-2 mx-1 h-1 rounded-full bg-stone-300 relative overflow-hidden">
                <div
                  className="absolute top-0 h-full rounded-full bg-amber-500 transition-all duration-200"
                  style={{ left: thumbLeft, width: thumbWidth }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Desktop view — unchanged ── */}
      <div className="hidden sm:block w-full overflow-x-auto pb-2">
        <div className="min-w-[460px] sm:min-w-[580px]">
          <div className="flex">
            <div className="w-16 shrink-0" />
            {FRETS.map((fret) => (
              <div key={fret} className="flex-1 text-center text-sm font-semibold text-amber-700 font-mono pb-1 select-none">
                {fret}
              </div>
            ))}
          </div>

          <div className="rounded-lg overflow-hidden border border-stone-700 bg-stone-900">
            {reversedStrings.map(({ index, label }) => {
              const isActive = activeStringIndices.includes(index);
              const openNote = FRETBOARD[index][0];
              const openCellStyle = getFretCellStyle(index, 0, openNote, quiz, activeStringIndices);
              const isInteractive = isActive && quiz.mode === 'find-note' && !quiz.answered;

              return (
                <div key={index} className="flex items-stretch border-b border-stone-700 last:border-b-0">
                  <div
                    className={`group w-16 shrink-0 flex flex-col items-center justify-center border-r-2 border-r-stone-500 py-1 select-none transition-all duration-100 min-h-8 sm:min-h-11 ${
                      isInteractive ? 'cursor-pointer hover:bg-amber-500/15 active:scale-95' : ''
                    } ${openCellStyle}`}
                    onClick={() => isInteractive && onFretClick(index, 0)}
                    role={isInteractive ? 'button' : undefined}
                    aria-label={`${label} string, open, note ${openNote}`}
                  >
                    <span className={`text-xs font-bold leading-tight ${isActive ? 'text-amber-300' : 'text-stone-500'}`}>
                      {label}
                    </span>
                    {(showNotes || !isActive || quiz.answered) && (
                      <span className="text-[10px] font-semibold leading-tight opacity-80">({openNote})</span>
                    )}
                    {isInteractive && (
                      <span className="text-[9px] text-amber-400 opacity-0 group-hover:opacity-70 transition-opacity leading-none mt-0.5">tap</span>
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
                        className={`flex-1 relative flex items-center justify-center border-r border-stone-700 last:border-r-0 transition-all duration-100 select-none min-h-8 sm:min-h-11 ${cellStyle}`}
                        onClick={() => isInteractive && onFretClick(index, fret)}
                        role={isInteractive ? 'button' : undefined}
                        aria-label={`${label} string, fret ${fret}, note ${note}`}
                      >
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 left-0 right-0 w-full pointer-events-none ${
                            isActive ? 'bg-amber-200/30' : 'bg-stone-500/50'
                          }`}
                          style={{ height: `${1 + (5 - Number(index)) * 0.4}px` }}
                        />
                        {(isDot || isDoubleDot) && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-stone-500 pointer-events-none z-10" />
                        )}
                        {(showNotes || !isActive || quiz.answered) ? (
                          <span className={`relative z-20 text-center font-semibold leading-tight pointer-events-none ${isActive ? 'text-[10px]' : 'text-[9px] opacity-90'}`}>
                            {note}
                          </span>
                        ) : (
                          <span className="relative z-20 text-[9px] font-semibold text-amber-600/60 pointer-events-none select-none">?</span>
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
    </>
  );
}
