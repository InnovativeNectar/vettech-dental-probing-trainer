export const SKILL_AREAS = [
  { name: 'Probe Handling', icon: '🔍', description: 'Accurate probe placement and angle' },
  { name: 'Depth Measurement', icon: '📏', description: 'Precise pocket depth readings' },
  { name: 'Charting', icon: '📋', description: 'Recording findings accurately' },
  { name: 'Anatomy Knowledge', icon: '🦷', description: 'Tooth and structure identification' },
  { name: 'Pathology Recognition', icon: '⚠️', description: 'Identifying disease signs' },
  { name: 'Species Awareness', icon: '🐕', description: 'Species-specific techniques' },
  { name: 'Client Communication', icon: '💬', description: 'Explaining findings clearly' },
] as const;

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold';
  xpReward: number;
  condition: (stats: Record<string, number>) => boolean;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first-probe',
    name: 'First Probe',
    description: 'Complete your first probing session',
    icon: '🎯',
    tier: 'bronze',
    xpReward: 50,
    condition: (stats) => (stats.totalSessions ?? 0) >= 1,
  },
  {
    id: 'dedicated-student',
    name: 'Dedicated Student',
    description: 'Complete 10 probing sessions',
    icon: '📚',
    tier: 'bronze',
    xpReward: 100,
    condition: (stats) => (stats.totalSessions ?? 0) >= 10,
  },
  {
    id: 'session-master',
    name: 'Session Master',
    description: 'Complete 50 probing sessions',
    icon: '🎓',
    tier: 'gold',
    xpReward: 500,
    condition: (stats) => (stats.totalSessions ?? 0) >= 50,
  },
  {
    id: 'high-scorer',
    name: 'High Scorer',
    description: 'Achieve a score of 90% or higher',
    icon: '🌟',
    tier: 'silver',
    xpReward: 150,
    condition: (stats) => (stats.bestScore ?? 0) >= 90,
  },
  {
    id: 'consistency-king',
    name: 'Consistency King',
    description: 'Score 80%+ in 5 consecutive sessions',
    icon: '👑',
    tier: 'gold',
    xpReward: 300,
    condition: (stats) => (stats.highScoreCount ?? 0) >= 5,
  },
  {
    id: 'streak-starter',
    name: 'Streak Starter',
    description: 'Maintain a 3-day practice streak',
    icon: '🔥',
    tier: 'bronze',
    xpReward: 75,
    condition: (stats) => (stats.streakDays ?? 0) >= 3,
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Maintain a 7-day practice streak',
    icon: '🔥',
    tier: 'silver',
    xpReward: 200,
    condition: (stats) => (stats.streakDays ?? 0) >= 7,
  },
  {
    id: 'streak-legend',
    name: 'Streak Legend',
    description: 'Maintain a 30-day practice streak',
    icon: '🔥',
    tier: 'gold',
    xpReward: 1000,
    condition: (stats) => (stats.streakDays ?? 0) >= 30,
  },
  {
    id: 'case-solver',
    name: 'Case Solver',
    description: 'Complete your first clinical case',
    icon: '🏥',
    tier: 'bronze',
    xpReward: 100,
    condition: (stats) => (stats.casesCompleted ?? 0) >= 1,
  },
  {
    id: 'species-expert',
    name: 'Species Expert',
    description: 'Practice with both canine and feline',
    icon: '🐾',
    tier: 'silver',
    xpReward: 150,
    condition: (stats) => (stats.speciesUsed ?? 0) >= 2,
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete a probing session in under 2 minutes',
    icon: '⚡',
    tier: 'bronze',
    xpReward: 75,
    condition: (stats) => (stats.fastestSession ?? 0) > 0 && (stats.fastestSession ?? 0) <= 120,
  },
  {
    id: 'accuracy-king',
    name: 'Accuracy King',
    description: 'Achieve 95%+ probe accuracy',
    icon: '🎯',
    tier: 'silver',
    xpReward: 200,
    condition: (stats) => (stats.bestProbeAccuracy ?? 0) >= 95,
  },
];

export const TIER_COLORS = {
  bronze: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  silver: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
  gold: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
} as const;

export const XP_PER_ACTION = {
  probeReading: 5,
  accurateProbe: 10,
  sessionComplete: 25,
  assessmentComplete: 50,
  caseComplete: 75,
  perfectAssessment: 100,
} as const;

export const LEVEL_THRESHOLDS = [
  0, 100, 300, 600, 1000, 1500, 2500, 4000, 6000, 10000,
] as const;

export function getLevelFromXp(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getXpForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_THRESHOLDS.length) return Infinity;
  return LEVEL_THRESHOLDS[currentLevel];
}

export function getLevelTitle(level: number): string {
  if (level >= 10) return 'Dental Legend';
  if (level >= 8) return 'Expert Prober';
  if (level >= 6) return 'Senior Technician';
  if (level >= 4) return 'Skilled Practitioner';
  if (level >= 2) return 'Apprentice';
  return 'Beginner';
}

export function checkBadges(stats: Record<string, number>, earnedIds: string[]): BadgeDefinition[] {
  const newBadges: BadgeDefinition[] = [];
  for (const def of BADGE_DEFINITIONS) {
    if (earnedIds.includes(def.id)) continue;
    try {
      if (def.condition(stats)) {
        newBadges.push(def);
      }
    } catch {
      // Condition check failed, skip
    }
  }
  return newBadges;
}
