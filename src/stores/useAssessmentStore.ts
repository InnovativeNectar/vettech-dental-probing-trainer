import { create } from 'zustand';
import type { Assessment, AssessmentAttempt, Answer } from '@/types';

interface AssessmentState {
  assessments: Assessment[];
  currentAssessment: Assessment | null;
  currentAttempt: AssessmentAttempt | null;
  answers: Answer[];
  timeRemaining: number;
  isAssessmentActive: boolean;
  currentQuestionIndex: number;
  setAssessments: (assessments: Assessment[]) => void;
  setCurrentAssessment: (assessment: Assessment | null) => void;
  startAttempt: (assessment: Assessment) => void;
  submitAnswer: (answer: Answer) => void;
  completeAttempt: (attempt: AssessmentAttempt) => void;
  updateTimeRemaining: (time: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set) => ({
  assessments: [],
  currentAssessment: null,
  currentAttempt: null,
  answers: [],
  timeRemaining: 0,
  isAssessmentActive: false,
  currentQuestionIndex: 0,
  setAssessments: (assessments) => set({ assessments }),
  setCurrentAssessment: (currentAssessment) => set({ currentAssessment }),
  startAttempt: (assessment) =>
    set({
      currentAssessment: assessment,
      isAssessmentActive: true,
      answers: [],
      timeRemaining: assessment.timeLimitMinutes * 60,
      currentQuestionIndex: 0,
    }),
  submitAnswer: (answer) =>
    set((state) => ({ answers: [...state.answers, answer] })),
  completeAttempt: (attempt) =>
    set({ currentAttempt: attempt, isAssessmentActive: false }),
  updateTimeRemaining: (timeRemaining) => set({ timeRemaining }),
  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1,
    })),
  previousQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
    })),
  resetAssessment: () =>
    set({
      currentAssessment: null,
      currentAttempt: null,
      answers: [],
      timeRemaining: 0,
      isAssessmentActive: false,
      currentQuestionIndex: 0,
    }),
}));
