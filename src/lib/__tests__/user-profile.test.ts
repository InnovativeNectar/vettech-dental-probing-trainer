import { describe, it, expect } from 'vitest';
import { buildUserProfile } from '@/lib/user-profile';
import type { UserRow, BadgeRow, SkillAreaRow } from '@/lib/user-profile';

const baseUser: UserRow = {
  id: 'user-001',
  email: 'student@vettech.edu',
  name: 'Alex Rivera',
  role: 'student',
  avatarUrl: null,
  institution: 'Pinnacle Vet College',
  createdAt: new Date('2025-09-01'),
  updatedAt: new Date('2026-07-29'),
};

const badges: BadgeRow[] = [
  {
    id: 'b1',
    userId: 'user-001',
    name: 'Quick Learner',
    description: 'Complete first module',
    iconUrl: '/badges/quick-learner.svg',
    earnedAt: new Date('2026-07-20'),
  },
  {
    id: 'b2',
    userId: 'user-001',
    name: 'Sharp Eye',
    description: '95%+ probe accuracy',
    iconUrl: '/badges/sharp-eye.svg',
    earnedAt: new Date('2026-07-25'),
  },
];

const skillAreas: SkillAreaRow[] = [
  { id: 's1', userId: 'user-001', name: 'Probe Handling', level: 3, xp: 150, maxXp: 500 },
  { id: 's2', userId: 'user-001', name: 'Depth Measurement', level: 2, xp: 80, maxXp: 500 },
  { id: 's3', userId: 'user-001', name: 'Charting', level: 1, xp: 30, maxXp: 500 },
];

describe('buildUserProfile', () => {
  it('computes totalPoints as sum of skill-area xp', () => {
    const profile = buildUserProfile(baseUser, badges, skillAreas);
    expect(profile.totalPoints).toBe(150 + 80 + 30);
  });

  it('maps user fields correctly', () => {
    const profile = buildUserProfile(baseUser, [], []);
    expect(profile.id).toBe('user-001');
    expect(profile.email).toBe('student@vettech.edu');
    expect(profile.name).toBe('Alex Rivera');
    expect(profile.role).toBe('student');
    expect(profile.institution).toBe('Pinnacle Vet College');
  });

  it('returns badges sorted newest-first by earnedAt', () => {
    const profile = buildUserProfile(baseUser, badges, []);
    expect(profile.badges).toHaveLength(2);
    expect(profile.badges[0]).toMatchObject({ name: 'Sharp Eye' });
    expect(profile.badges[1]).toMatchObject({ name: 'Quick Learner' });
  });

  it('maps skillAreas preserving name/level/xp/maxXp', () => {
    const profile = buildUserProfile(baseUser, [], skillAreas);
    expect(profile.skillAreas).toHaveLength(3);
    expect(profile.skillAreas[0]).toMatchObject({
      name: 'Probe Handling',
      level: 3,
      xp: 150,
      maxXp: 500,
    });
  });

  it('handles empty badges and skillAreas gracefully', () => {
    const profile = buildUserProfile(baseUser, [], []);
    expect(profile.badges).toEqual([]);
    expect(profile.skillAreas).toEqual([]);
    expect(profile.totalPoints).toBe(0);
  });

  it('preserves avatarUrl when set', () => {
    const userWithAvatar: UserRow = { ...baseUser, avatarUrl: 'https://example.com/avatar.png' };
    const profile = buildUserProfile(userWithAvatar, [], []);
    expect(profile.avatarUrl).toBe('https://example.com/avatar.png');
  });

  it('maps an instructor role correctly', () => {
    const instructor: UserRow = { ...baseUser, role: 'instructor' };
    const profile = buildUserProfile(instructor, [], []);
    expect(profile.role).toBe('instructor');
  });

  it('defaults unknown role to student', () => {
    const unknown: UserRow = { ...baseUser, role: 'unknown_role' };
    const profile = buildUserProfile(unknown, [], []);
    expect(profile.role).toBe('student');
  });
});