import type { GuitarString, NoteName, StringIndex } from '../types';

export const CHROMATIC_SCALE: NoteName[] = [
  'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F',
  'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B',
];

export const GUITAR_STRINGS: GuitarString[] = [
  { index: 0, openNote: 'E', label: 'Low E' },
  { index: 1, openNote: 'A', label: 'A' },
  { index: 2, openNote: 'D', label: 'D' },
  { index: 3, openNote: 'G', label: 'G' },
  { index: 4, openNote: 'B', label: 'B' },
  { index: 5, openNote: 'E', label: 'High e' },
];

export const FRET_COUNT = 12;

export const DOT_FRETS: number[] = [3, 5, 7, 9, 12];
export const DOUBLE_DOT_FRET = 12;

export function getNoteAtFret(openNote: NoteName, fret: number): NoteName {
  const openIndex = CHROMATIC_SCALE.indexOf(openNote);
  return CHROMATIC_SCALE[(openIndex + fret) % 12];
}

export function buildFretboard(): NoteName[][] {
  return GUITAR_STRINGS.map(({ openNote }) =>
    Array.from({ length: FRET_COUNT + 1 }, (_, fret) =>
      getNoteAtFret(openNote, fret)
    )
  );
}

export const FRETBOARD: NoteName[][] = buildFretboard();

export function getFretsForNote(
  note: NoteName,
  stringIndex: StringIndex
): number[] {
  return FRETBOARD[stringIndex]
    .map((n, fret) => ({ n, fret }))
    .filter(({ n }) => n === note)
    .map(({ fret }) => fret);
}

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function buildNoteChoices(correct: NoteName, count = 4): NoteName[] {
  const distractors = shuffle(
    CHROMATIC_SCALE.filter((n) => n !== correct)
  ).slice(0, count - 1);
  return shuffle([correct, ...distractors]);
}
