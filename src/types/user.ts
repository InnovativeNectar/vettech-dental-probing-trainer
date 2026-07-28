export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  institution?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  totalPoints: number;
  badges: Badge[];
  skillAreas: SkillArea[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  earnedAt: Date;
}

export interface SkillArea {
  name: string;
  level: number; // 1-10
  xp: number;
  maxXp: number;
}
