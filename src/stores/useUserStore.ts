import { create } from 'zustand';
import type { User, UserProfile, Badge } from '@/types';

interface UserState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setProfile: (profile: UserProfile) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  addBadge: (badge: Badge) => void;
  updateSkillArea: (name: string, xp: number) => void;
  loadDemoUser: () => void;
}

const DEMO_USER: User = {
  id: 'demo-user-001',
  email: 'demo@vettech.edu',
  name: 'Demo Student',
  role: 'student',
  institution: 'VetTech Training Academy',
  createdAt: new Date('2026-01-15'),
  updatedAt: new Date(),
};

const DEMO_PROFILE: UserProfile = {
  ...DEMO_USER,
  totalPoints: 2450,
  badges: [
    {
      id: 'first-session',
      name: 'First Steps',
      description: 'Complete your first training session',
      iconUrl: '🎯',
      earnedAt: new Date('2026-01-20'),
    },
    {
      id: 'ten-sessions',
      name: 'Dedicated Learner',
      description: 'Complete 10 training sessions',
      iconUrl: '📚',
      earnedAt: new Date('2026-03-10'),
    },
    {
      id: 'streak-3',
      name: 'On a Roll',
      description: 'Maintain a 3-day practice streak',
      iconUrl: '🔥',
      earnedAt: new Date('2026-07-25'),
    },
    {
      id: 'accuracy-king',
      name: 'Accuracy King',
      description: 'Achieve 95%+ probe accuracy',
      iconUrl: '🎯',
      earnedAt: new Date('2026-07-26'),
    },
  ],
  skillAreas: [
    { name: 'Probe Handling', level: 6, xp: 320, maxXp: 500 },
    { name: 'Depth Measurement', level: 4, xp: 180, maxXp: 500 },
    { name: 'Charting', level: 3, xp: 120, maxXp: 500 },
    { name: 'Anatomy Knowledge', level: 5, xp: 250, maxXp: 500 },
    { name: 'Pathology Recognition', level: 2, xp: 80, maxXp: 500 },
    { name: 'Species Awareness', level: 4, xp: 200, maxXp: 500 },
    { name: 'Client Communication', level: 1, xp: 30, maxXp: 500 },
  ],
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: true }),
  setProfile: (profile) => set({ profile }),
  logout: () => set({ user: null, profile: null, isAuthenticated: false }),
  setLoading: (isLoading) => set({ isLoading }),
  addBadge: (badge) =>
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, badges: [...state.profile.badges, badge] }
        : null,
    })),
  updateSkillArea: (name, xp) =>
    set((state) => ({
      profile: state.profile
        ? {
            ...state.profile,
            skillAreas: state.profile.skillAreas.map((sa) =>
              sa.name === name
                ? { ...sa, xp: sa.xp + xp, level: Math.floor((sa.xp + xp) / sa.maxXp) + 1 }
                : sa
            ),
          }
        : null,
    })),
  loadDemoUser: () => {
    set({ user: DEMO_USER, profile: DEMO_PROFILE, isAuthenticated: true, isLoading: false });
  },
}));
