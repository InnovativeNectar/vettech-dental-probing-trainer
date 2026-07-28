export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'clinical';

export type ModuleType = 'orientation' | 'numbering' | 'technique' | 'measurement' | 'pathology' | 'charting' | 'decision';

export interface Module {
  id: string;
  title: string;
  description: string;
  type: ModuleType;
  difficulty: DifficultyLevel;
  lessonCount: number;
  estimatedMinutes: number;
  requiredModules: string[]; // prerequisite module IDs
  thumbnailUrl?: string;
  sortOrder: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  sortOrder: number;
  objectives: string[];
  estimatedMinutes: number;
}

export interface LessonProgress {
  lessonId: string;
  userId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number;
  attempts: number;
  bestScore?: number;
  timeSpentSeconds: number;
  startedAt?: Date;
  completedAt?: Date;
}

export interface ModuleProgress {
  moduleId: string;
  userId: string;
  completedLessons: number;
  totalLessons: number;
  averageScore: number;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
}
