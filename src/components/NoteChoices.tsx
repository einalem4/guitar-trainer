import type { NoteName } from '../types';

interface NoteChoicesProps {
  choices: NoteName[];
  correctNote: NoteName;
  answered: boolean;
  onAnswer: (note: NoteName) => void;
}

export function NoteChoices({
  choices,
  correctNote,
  answered,
  onAnswer,
}: NoteChoicesProps) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto">
      {choices.map((note) => {
        let style =
          'bg-amber-50 text-stone-800 border-amber-200 hover:bg-amber-100 hover:border-amber-400 active:scale-95';

        if (answered) {
          if (note === correctNote) {
            style = 'bg-green-100 text-green-800 border-green-500';
          } else {
            style = 'bg-stone-100 text-stone-400 border-stone-200 opacity-60';
          }
        }

        return (
          <button
            key={note}
            disabled={answered}
            onClick={() => onAnswer(note)}
            className={`py-4 px-2 rounded-xl border-2 font-bold text-lg transition-all duration-100 select-none ${style}`}
            aria-label={`Choose ${note}`}
          >
            {note}
          </button>
        );
      })}
    </div>
  );
}
