import type { QuizMode, QuizState } from '../types';
import { GUITAR_STRINGS } from '../utils/noteUtils';
import { NoteChoices } from './NoteChoices';

const QUIZ_MODES: { value: QuizMode; label: string }[] = [
  { value: 'find-note', label: 'Find the Note' },
  { value: 'name-note', label: 'Name the Note' },
];

interface QuizProps {
  quiz: QuizState;
  mode: QuizMode;
  onChangeMode: (mode: QuizMode) => void;
  onNameNoteAnswer: (note: string) => void;
  onNext: () => void;
}

export function Quiz({
  quiz,
  mode,
  onChangeMode,
  onNameNoteAnswer,
  onNext,
}: QuizProps) {
  const { target, answered, wasCorrect, choices } = quiz;
  const stringLabel = GUITAR_STRINGS[target.stringIndex].label;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 bg-stone-100 rounded-xl p-1 w-fit">
        {QUIZ_MODES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onChangeMode(value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === value
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
        {mode === 'find-note' ? (
          <div className="text-center">
            <p className="text-stone-500 text-sm mb-2">Find this note on the fretboard</p>
            <p className="text-5xl font-black text-stone-900 tracking-tight mb-3">
              {target.note}
            </p>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
              <span className="text-stone-500 text-sm">on the</span>
              <span className="text-amber-800 font-bold text-sm">{stringLabel} string</span>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-stone-500 text-sm mb-1">What note is highlighted?</p>
            <p className="text-stone-700 font-semibold">
              {stringLabel} string — {target.fret === 0 ? 'open' : `fret ${target.fret}`}
            </p>
          </div>
        )}

        {answered && (
          <div
            className={`mt-4 rounded-xl py-3 px-4 text-center font-semibold text-base ${
              wasCorrect
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}
          >
            {wasCorrect ? '✓ Correct!' : `✗ The note is ${target.note}`}
          </div>
        )}

        {mode === 'name-note' && (
          <div className="mt-4">
            <NoteChoices
              choices={choices}
              correctNote={target.note}
              answered={answered}
              onAnswer={onNameNoteAnswer}
            />
          </div>
        )}

        {answered && (
          <button
            onClick={onNext}
            className="mt-4 w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold py-3 rounded-xl text-lg transition-all"
          >
            Next Question →
          </button>
        )}
      </div>
    </div>
  );
}
