import { useState, useCallback } from 'react';
import type { ProgressState, StringIndex } from '../types';

export function useProgress() {
  const [state, setState] = useState<ProgressState>({
    activeIndices: [0 as StringIndex],
    score: { correct: 0, attempts: 0 },
  });

  const recordAnswer = useCallback((correct: boolean) => {
    setState((prev) => ({
      ...prev,
      score: {
        correct: prev.score.correct + (correct ? 1 : 0),
        attempts: prev.score.attempts + 1,
      },
    }));
  }, []);

  const toggleString = useCallback((index: StringIndex) => {
    setState((prev) => {
      const isActive = prev.activeIndices.includes(index);
      if (isActive && prev.activeIndices.length <= 1) return prev;
      return {
        ...prev,
        activeIndices: isActive
          ? prev.activeIndices.filter((i) => i !== index)
          : ([...prev.activeIndices, index].sort((a, b) => a - b) as StringIndex[]),
      };
    });
  }, []);

  const resetScore = useCallback(() => {
    setState((prev) => ({ ...prev, score: { correct: 0, attempts: 0 } }));
  }, []);

  return {
    state,
    activeStringIndices: state.activeIndices,
    recordAnswer,
    toggleString,
    resetScore,
  };
}
