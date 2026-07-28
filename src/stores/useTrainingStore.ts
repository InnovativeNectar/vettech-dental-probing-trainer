import { create } from 'zustand';
import type { Module, Lesson, LessonProgress, ModuleProgress, DifficultyLevel } from '@/types';

interface TrainingState {
  modules: Module[];
  currentModule: Module | null;
  currentLesson: Lesson | null;
  moduleProgress: ModuleProgress[];
  lessonProgress: LessonProgress[];
  selectedSpecies: 'canine' | 'feline';
  selectedAgeGroup: 'adult' | 'juvenile';
  difficulty: DifficultyLevel;
  isSessionActive: boolean;
  sessionScore: number;
  sessionTimeSeconds: number;
  setModules: (modules: Module[]) => void;
  setCurrentModule: (module: Module | null) => void;
  setCurrentLesson: (lesson: Lesson | null) => void;
  setModuleProgress: (progress: ModuleProgress[]) => void;
  setLessonProgress: (progress: LessonProgress[]) => void;
  setSelectedSpecies: (species: 'canine' | 'feline') => void;
  setSelectedAgeGroup: (ageGroup: 'adult' | 'juvenile') => void;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  startSession: () => void;
  endSession: () => void;
  addScore: (points: number) => void;
  updateTime: (seconds: number) => void;
}

export const useTrainingStore = create<TrainingState>((set) => ({
  modules: [],
  currentModule: null,
  currentLesson: null,
  moduleProgress: [],
  lessonProgress: [],
  selectedSpecies: 'canine',
  selectedAgeGroup: 'adult',
  difficulty: 'beginner',
  isSessionActive: false,
  sessionScore: 0,
  sessionTimeSeconds: 0,
  setModules: (modules) => set({ modules }),
  setCurrentModule: (currentModule) => set({ currentModule }),
  setCurrentLesson: (currentLesson) => set({ currentLesson }),
  setModuleProgress: (moduleProgress) => set({ moduleProgress }),
  setLessonProgress: (lessonProgress) => set({ lessonProgress }),
  setSelectedSpecies: (selectedSpecies) => set({ selectedSpecies }),
  setSelectedAgeGroup: (selectedAgeGroup) => set({ selectedAgeGroup }),
  setDifficulty: (difficulty) => set({ difficulty }),
  startSession: () => set({ isSessionActive: true, sessionScore: 0, sessionTimeSeconds: 0 }),
  endSession: () => set({ isSessionActive: false }),
  addScore: (points) => set((state) => ({ sessionScore: state.sessionScore + points })),
  updateTime: (seconds) => set({ sessionTimeSeconds: seconds }),
}));
