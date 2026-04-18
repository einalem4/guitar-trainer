export type NoteName =
  | 'C' | 'C#/Db' | 'D' | 'D#/Eb' | 'E' | 'F'
  | 'F#/Gb' | 'G' | 'G#/Ab' | 'A' | 'A#/Bb' | 'B';

export type StringIndex = 0 | 1 | 2 | 3 | 4 | 5;

export interface GuitarString {
  index: StringIndex;
  openNote: NoteName;
  label: string;
}

export type QuizMode = 'find-note' | 'name-note';

export interface QuizTarget {
  stringIndex: StringIndex;
  fret: number;
  note: NoteName;
}

export interface QuizState {
  mode: QuizMode;
  target: QuizTarget;
  answered: boolean;
  wasCorrect: boolean | null;
  choices: NoteName[];
}

export interface ScoreState {
  correct: number;
  attempts: number;
}

export interface ProgressState {
  activeIndices: StringIndex[];
  score: ScoreState;
}
