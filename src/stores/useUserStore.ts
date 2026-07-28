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
}));
