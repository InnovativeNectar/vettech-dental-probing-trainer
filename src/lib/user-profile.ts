import type { User, UserProfile, Badge, SkillArea } from '@/types';

/**
 * Raw row shapes from the DB schema (drizzle returns these).
 * Matches src/lib/db/schema.ts: users, badges, skillAreas tables.
 */
export interface UserRow {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl: string | null;
  institution: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BadgeRow {
  id: string;
  userId: string;
  name: string;
  description: string;
  iconUrl: string | null;
  earnedAt: Date;
}

export interface SkillAreaRow {
  id: string;
  userId: string;
  name: string;
  level: number;
  xp: number;
  maxXp: number;
}

function mapUserRole(role: string): User['role'] {
  if (role === 'student' || role === 'instructor' || role === 'admin') return role;
  return 'student';
}

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: mapUserRole(row.role),
    avatarUrl: row.avatarUrl ?? undefined,
    institution: row.institution ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapBadge(row: BadgeRow): Badge {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    iconUrl: row.iconUrl ?? '',
    earnedAt: row.earnedAt,
  };
}

function mapSkillArea(row: SkillAreaRow): SkillArea {
  return {
    name: row.name,
    level: row.level,
    xp: row.xp,
    maxXp: row.maxXp,
  };
}

/**
 * Build a UserProfile from raw db rows. Pure function — no I/O — so it's
 * straightforward to unit-test against fixtures. totalPoints is the sum of
 * all skill-area xp; badges are sorted newest-first by earnedAt.
 */
export function buildUserProfile(
  userRow: UserRow,
  badgeRows: BadgeRow[],
  skillAreaRows: SkillAreaRow[]
): UserProfile {
  const user = mapUser(userRow);
  const badges = badgeRows.map(mapBadge).sort((a, b) => b.earnedAt.getTime() - a.earnedAt.getTime());
  const skillAreas = skillAreaRows.map(mapSkillArea);
  const totalPoints = skillAreas.reduce((sum, sa) => sum + sa.xp, 0);

  return {
    ...user,
    totalPoints,
    badges,
    skillAreas,
  };
}
