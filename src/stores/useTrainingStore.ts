import { create } from 'zustand';
import type { Module, Lesson, LessonProgress, ModuleProgress, DifficultyLevel } from '@/types';

function mapModule(row: Record<string, unknown>): Module {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    type: row.type as Module['type'],
    difficulty: row.difficulty as DifficultyLevel,
    lessonCount: row.lesson_count as number,
    estimatedMinutes: row.estimated_minutes as number,
    requiredModules: JSON.parse((row.required_modules as string) || '[]'),
    sortOrder: row.sort_order as number,
  };
}

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
  isLoading: boolean;
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
  fetchModules: (userId?: string) => Promise<void>;
  fetchProgress: (userId: string) => Promise<void>;
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
  isLoading: true,
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
  fetchModules: async (userId) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/modules');
      if (res.ok) {
        const rows: Record<string, unknown>[] = await res.json();
        const modules = rows.map(mapModule);
        set({ modules, isLoading: false });
        if (userId) {
          const progRes = await fetch(`/api/progress?userId=${userId}`);
          if (progRes.ok) {
            const progress: Record<string, unknown>[] = await progRes.json();
            const completedIds = new Set(progress.filter(p => p.status === 'completed').map(p => p.module_id as string));
            const moduleProgress: ModuleProgress[] = modules.map(m => ({
              moduleId: m.id,
              userId,
              completedLessons: completedIds.has(m.id) ? m.lessonCount : 0,
              totalLessons: m.lessonCount,
              averageScore: 0,
              status: completedIds.has(m.id) ? 'completed' : 'available' as ModuleProgress['status'],
            }));
            set({ moduleProgress });
          }
        }
        return;
      }
    } catch {
      // API unavailable — fall back to empty
    }
    set({ isLoading: false });
  },
  fetchProgress: async (userId) => {
    try {
      const res = await fetch(`/api/progress?userId=${userId}`);
      if (res.ok) {
        const progress: Record<string, unknown>[] = await res.json();
        set({ lessonProgress: progress as unknown as LessonProgress[] });
      }
    } catch {
      // silent
    }
  },
}));
