import { create } from 'zustand';
import type { User, UserProfile, Badge, SkillArea } from '@/types';

const DEMO_USER: User = {
  id: 'user-001',
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
        id: 'first-probe',
        name: 'First Probe',
        description: 'Complete your first probing session',
        iconUrl: '🎯',
        earnedAt: new Date('2026-01-20'),
      },
      {
        id: 'dedicated-student',
        name: 'Dedicated Student',
        description: 'Complete 10 probing sessions',
        iconUrl: '📚',
        earnedAt: new Date('2026-03-10'),
      },
      {
        id: 'streak-starter',
        name: 'Streak Starter',
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

/**
 * Parse the JSON returned by /api/users/[id]/profile into a UserProfile.
 * Drizzle's `timestamp` mode serializes as ISO strings over the wire (next
 * Response.json), so we coerce strings back to Date. Returns null on a
 * malformed payload so the caller can fall back to demo data.
 */
function mapProfileResponse(data: Record<string, unknown>): UserProfile | null {
  if (!data || typeof data.id !== 'string') return null;
  const role = data.role;
  if (role !== 'student' && role !== 'instructor' && role !== 'admin') return null;

  const toDate = (v: unknown): Date => {
    if (v instanceof Date) return v;
    if (typeof v === 'string' || typeof v === 'number') {
      const d = new Date(v);
      return isNaN(d.getTime()) ? new Date(0) : d;
    }
    return new Date(0);
  };

  const user: User = {
    id: data.id,
    email: String(data.email ?? ''),
    name: String(data.name ?? ''),
    role,
    avatarUrl: typeof data.avatarUrl === 'string' ? data.avatarUrl : undefined,
    institution: typeof data.institution === 'string' ? data.institution : undefined,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };

  const rawBadges = Array.isArray(data.badges) ? data.badges : [];
  const badgesList: Badge[] = rawBadges.map((b) => ({
    id: String(b.id ?? ''),
    name: String(b.name ?? ''),
    description: String(b.description ?? ''),
    iconUrl: typeof b.iconUrl === 'string' ? b.iconUrl : '',
    earnedAt: toDate(b.earnedAt),
  }));

  const rawSkills = Array.isArray(data.skillAreas) ? data.skillAreas : [];
  const skillAreasList: SkillArea[] = rawSkills.map((s) => ({
    name: String(s.name ?? ''),
    level: Number(s.level ?? 1),
    xp: Number(s.xp ?? 0),
    maxXp: Number(s.maxXp ?? 100),
  }));

  const totalPoints =
    typeof data.totalPoints === 'number'
      ? data.totalPoints
      : skillAreasList.reduce((sum, sa) => sum + sa.xp, 0);

  return { ...user, totalPoints, badges: badgesList, skillAreas: skillAreasList };
}

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
  fetchUser: (userId?: string) => Promise<void>;
}

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
  fetchUser: async (userId) => {
    set({ isLoading: true });
    const id = userId || 'user-001';
    try {
      const res = await fetch(`/api/users/${id}/profile`);
      if (res.ok) {
        const data: Record<string, unknown> = await res.json();
        const profile = mapProfileResponse(data);
        if (profile) {
          // UserProfile extends User, so the profile doubles as the user record.
          const { totalPoints, badges, skillAreas, ...user } = profile;
          void totalPoints;
          void badges;
          void skillAreas;
          set({ user, profile, isAuthenticated: true, isLoading: false });
          return;
        }
      }
    } catch {
      // API unavailable — fall back to demo below
    }
    set({ user: DEMO_USER, profile: DEMO_PROFILE, isAuthenticated: true, isLoading: false });
  },
}));
