import { create } from 'zustand';

interface AnalyticsData {
  totalSessions: number;
  totalProbingTime: number;
  averageScore: number;
  skillsCompleted: number;
  badgesEarned: number;
  streakDays: number;
  longestStreak: number;
  weeklyProgress: { day: string; minutes: number; score: number }[];
  skillBreakdown: { skill: string; level: number; xp: number }[];
  recentActivity: {
    id: string;
    type: 'training' | 'assessment' | 'case' | 'badge';
    title: string;
    description: string;
    score?: number;
    timestamp: string;
  }[];
}

interface AnalyticsState {
  data: AnalyticsData | null;
  timeRange: 'week' | 'month' | 'year';
  isLoading: boolean;
  setData: (data: AnalyticsData) => void;
  setTimeRange: (range: 'week' | 'month' | 'year') => void;
  setLoading: (loading: boolean) => void;
  loadFromStorage: () => void;
  fetchAnalytics: (userId?: string) => Promise<void>;
}

const DEMO_DATA: AnalyticsData = {
  totalSessions: 12,
  totalProbingTime: 5400,
  averageScore: 82,
  skillsCompleted: 3,
  badgesEarned: 4,
  streakDays: 5,
  longestStreak: 8,
  weeklyProgress: [
    { day: 'Mon', minutes: 25, score: 75 },
    { day: 'Tue', minutes: 40, score: 82 },
    { day: 'Wed', minutes: 15, score: 78 },
    { day: 'Thu', minutes: 55, score: 88 },
    { day: 'Fri', minutes: 35, score: 85 },
    { day: 'Sat', minutes: 60, score: 92 },
    { day: 'Sun', minutes: 45, score: 90 },
  ],
  skillBreakdown: [
    { skill: 'Probe Handling', level: 6, xp: 320 },
    { skill: 'Depth Measurement', level: 4, xp: 180 },
    { skill: 'Charting', level: 3, xp: 120 },
    { skill: 'Anatomy Knowledge', level: 5, xp: 250 },
    { skill: 'Pathology Recognition', level: 2, xp: 80 },
    { skill: 'Species Awareness', level: 4, xp: 200 },
    { skill: 'Client Communication', level: 1, xp: 30 },
  ],
  recentActivity: [
    {
      id: '1',
      type: 'assessment',
      title: 'Probe Accuracy Assessment',
      description: 'Scored 92% on probe placement accuracy',
      score: 92,
      timestamp: '2h ago',
    },
    {
      id: '2',
      type: 'training',
      title: 'Lesson 3: Depth Measurement',
      description: 'Completed guided probing depth practice',
      score: 85,
      timestamp: '5h ago',
    },
    {
      id: '3',
      type: 'case',
      title: 'Max - Grade 2 Periodontitis',
      description: 'Clinical case with 6 pathological sites identified',
      score: 78,
      timestamp: '1d ago',
    },
    {
      id: '4',
      type: 'badge',
      title: 'Badge Earned: On a Roll',
      description: 'Maintained a 3-day practice streak',
      timestamp: '1d ago',
    },
    {
      id: '5',
      type: 'training',
      title: 'Lesson 1: Anatomy Review',
      description: 'Canine dental anatomy basics',
      score: 95,
      timestamp: '2d ago',
    },
  ],
};

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  data: null,
  timeRange: 'week',
  isLoading: false,
  setData: (data) => set({ data }),
  setTimeRange: (timeRange) => set({ timeRange }),
  setLoading: (isLoading) => set({ isLoading }),
  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem('vettech-analytics');
      if (stored) {
        const parsed = JSON.parse(stored) as AnalyticsData;
        set({ data: parsed });
      } else {
        set({ data: DEMO_DATA });
        localStorage.setItem('vettech-analytics', JSON.stringify(DEMO_DATA));
      }
    } catch {
      set({ data: DEMO_DATA });
    }
  },
  fetchAnalytics: async (userId) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/analytics?userId=${userId || 'user-001'}`);
      if (res.ok) {
        const stats: Record<string, unknown> = await res.json();
        set({
          data: {
            ...DEMO_DATA,
            totalSessions: stats.totalSessions as number,
            totalProbingTime: stats.totalProbingTime as number,
            averageScore: stats.averageScore as number,
            skillsCompleted: stats.skillsCompleted as number,
          },
          isLoading: false,
        });
        return;
      }
    } catch {
      // API unavailable
    }
    set({ data: DEMO_DATA, isLoading: false });
  },
}));
