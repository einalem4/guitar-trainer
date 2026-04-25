import { useState, useCallback } from 'react';
import type { NoteName, QuizMode, QuizState, StringIndex } from '../types';
import {
  FRETBOARD,
  FRET_COUNT,
  buildNoteChoices,
  randomChoice,
} from '../utils/noteUtils';

function generateQuestion(
  mode: QuizMode,
  activeStringIndices: StringIndex[]
): QuizState {
  const stringIndex = randomChoice(activeStringIndices);
  const fret = Math.floor(Math.random() * (FRET_COUNT + 1));
  const note = FRETBOARD[stringIndex][fret];
  return {
    mode,
    target: { stringIndex, fret, note },
    answered: false,
    wasCorrect: null,
    choices: mode === 'name-note' ? buildNoteChoices(note) : [],
  };
}

export function useQuiz(activeStringIndices: StringIndex[]) {
  const [mode, setMode] = useState<QuizMode>('find-note');
  const [quiz, setQuiz] = useState<QuizState>(() =>
    generateQuestion('find-note', activeStringIndices)
  );

  const nextQuestion = useCallback(() => {
    setQuiz(generateQuestion(mode, activeStringIndices));
  }, [mode, activeStringIndices]);

  const changeMode = useCallback(
    (newMode: QuizMode) => {
      setMode(newMode);
      setQuiz(generateQuestion(newMode, activeStringIndices));
    },
    [activeStringIndices]
  );

  const answerFindNote = useCallback(
    (clickedStringIndex: StringIndex, clickedFret: number): boolean => {
      if (quiz.answered) return false;
      const clickedNote = FRETBOARD[clickedStringIndex][clickedFret];
      const correct =
        clickedStringIndex === quiz.target.stringIndex &&
        clickedNote === quiz.target.note;
      setQuiz((prev) => ({ ...prev, answered: true, wasCorrect: correct, answeredAt: { stringIndex: clickedStringIndex, fret: clickedFret } }));
      return correct;
    },
    [quiz.answered, quiz.target.note, quiz.target.stringIndex]
  );

  const answerNameNote = useCallback(
    (chosenNote: NoteName): boolean => {
      if (quiz.answered) return false;
      const correct = chosenNote === quiz.target.note;
      setQuiz((prev) => ({ ...prev, answered: true, wasCorrect: correct, answeredNote: chosenNote }));
      return correct;
    },
    [quiz.answered, quiz.target.note]
  );

  return { quiz, mode, changeMode, nextQuestion, answerFindNote, answerNameNote };
}
