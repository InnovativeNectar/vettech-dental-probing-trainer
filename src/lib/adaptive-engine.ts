import type { DifficultyLevel } from '@/types';
import { ADAPTIVE_THRESHOLDS } from './constants';

export interface AdaptiveState {
  currentDifficulty: DifficultyLevel;
  recentScores: number[];
  consecutiveHigh: number;
  consecutiveLow: number;
}

const DIFFICULTY_ORDER: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', 'clinical'];

export function getNextDifficulty(state: AdaptiveState): DifficultyLevel {
  const { currentDifficulty, recentScores } = state;
  if (recentScores.length < ADAPTIVE_THRESHOLDS.minAttemptsForAdapt) return currentDifficulty;

  const avgScore = recentScores.slice(-5).reduce((a, b) => a + b, 0) / Math.min(recentScores.length, 5);
  const currentIdx = DIFFICULTY_ORDER.indexOf(currentDifficulty);

  if (avgScore >= ADAPTIVE_THRESHOLDS.advanceScore && currentIdx < DIFFICULTY_ORDER.length - 1) {
    return DIFFICULTY_ORDER[currentIdx + 1]!;
  }
  if (avgScore <= ADAPTIVE_THRESHOLDS.demoteScore && currentIdx > 0) {
    return DIFFICULTY_ORDER[currentIdx - 1]!;
  }
  return currentDifficulty;
}

export function getAdaptiveHints(difficulty: DifficultyLevel): {
  showGuides: boolean;
  allowFreeProbe: boolean;
  timeLimitMinutes: number;
  requiredReadingsPerTooth: number;
} {
  switch (difficulty) {
    case 'beginner':
      return { showGuides: true, allowFreeProbe: false, timeLimitMinutes: 15, requiredReadingsPerTooth: 2 };
    case 'intermediate':
      return { showGuides: true, allowFreeProbe: true, timeLimitMinutes: 10, requiredReadingsPerTooth: 3 };
    case 'advanced':
      return { showGuides: false, allowFreeProbe: true, timeLimitMinutes: 8, requiredReadingsPerTooth: 4 };
    case 'clinical':
      return { showGuides: false, allowFreeProbe: true, timeLimitMinutes: 5, requiredReadingsPerTooth: 4 };
  }
}
