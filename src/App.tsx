import { useCallback, useState } from 'react';
import { useProgress } from './hooks/useProgress';
import { useQuiz } from './hooks/useQuiz';
import { Fretboard } from './components/Fretboard';
import { Quiz } from './components/Quiz';
import { ScoreDisplay } from './components/ScoreDisplay';
import { StringProgress } from './components/StringProgress';
import { WelcomeScreen } from './components/WelcomeScreen';
import type { NoteName, StringIndex } from './types';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showNotes, setShowNotes] = useState(false);

  const {
    state: progressState,
    activeStringIndices,
    recordAnswer,
    toggleString,
    resetScore,
  } = useProgress();

  const {
    quiz,
    mode,
    changeMode,
    nextQuestion,
    answerFindNote,
    answerNameNote,
  } = useQuiz(activeStringIndices);

  const handleFretClick = useCallback(
    (stringIndex: StringIndex, fret: number) => {
      recordAnswer(answerFindNote(stringIndex, fret));
    },
    [answerFindNote, recordAnswer]
  );

  const handleNameNoteAnswer = useCallback(
    (note: NoteName) => {
      recordAnswer(answerNameNote(note));
    },
    [answerNameNote, recordAnswer]
  );

  if (showWelcome) return <WelcomeScreen onStart={() => setShowWelcome(false)} />;

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎸</span>
            <h1 className="text-lg font-bold text-stone-900 tracking-tight">Guitar Trainer</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotes((v) => !v)}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                showNotes
                  ? 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600'
                  : 'bg-green-700 text-white border-green-700 hover:bg-green-800'
              }`}
            >
              {showNotes ? 'Hide notes' : 'Show notes'}
            </button>
            <ScoreDisplay score={progressState.score} onReset={resetScore} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-4">
          <StringProgress
            activeIndices={progressState.activeIndices}
            onToggleString={toggleString}
          />
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4">
          <Fretboard
            quiz={quiz}
            activeStringIndices={activeStringIndices}
            showNotes={showNotes}
            onFretClick={handleFretClick}
          />
        </div>

        <Quiz
          quiz={quiz}
          mode={mode}
          onChangeMode={changeMode}
          onNameNoteAnswer={handleNameNoteAnswer}
          onNext={nextQuestion}
        />

        <p className="text-center text-xs text-stone-400 pb-4">
          Tip: tap the string name on the left to play the open string.
        </p>

      </main>
    </div>
  );
}
