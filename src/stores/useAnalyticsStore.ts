import { create } from 'zustand';

interface AnalyticsData {
  totalSessions: number;
  totalProbingTime: number;
  averageScore: number;
  skillsCompleted: number;
  badgesEarned: number;
  streakDays: number;
  weeklyProgress: { day: string; minutes: number; score: number }[];
  skillBreakdown: { skill: string; level: number; xp: number }[];
}

interface AnalyticsState {
  data: AnalyticsData | null;
  timeRange: 'week' | 'month' | 'year';
  isLoading: boolean;
  setData: (data: AnalyticsData) => void;
  setTimeRange: (range: 'week' | 'month' | 'year') => void;
  setLoading: (loading: boolean) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  data: null,
  timeRange: 'week',
  isLoading: false,
  setData: (data) => set({ data }),
  setTimeRange: (timeRange) => set({ timeRange }),
  setLoading: (isLoading) => set({ isLoading }),
}));
