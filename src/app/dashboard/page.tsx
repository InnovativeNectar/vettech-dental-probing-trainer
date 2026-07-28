'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAnalyticsStore } from '@/stores/useAnalyticsStore';
import { useUserStore } from '@/stores/useUserStore';
import {
  StatsOverview,
  ProgressChart,
  SkillBreakdown,
  StreakTracker,
  BadgeList,
  RecentActivity,
} from '@/components/dashboard';
import { Button } from '@/components/ui';
import { formatDuration } from '@/lib/utils';
import { getLevelFromXp, getLevelTitle, BADGE_DEFINITIONS } from '@/lib/gamification';

export default function DashboardPage() {
  const { data, isLoading, loadFromStorage } = useAnalyticsStore();
  const { profile, loadDemoUser, isLoading: userLoading } = useUserStore();

  useEffect(() => {
    loadFromStorage();
    loadDemoUser();
  }, [loadFromStorage, loadDemoUser]);

  if (isLoading || userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <span className="text-4xl">⏳</span>
          <p className="mt-2 text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalXp = profile?.skillAreas.reduce((sum, sa) => sum + sa.xp, 0) ?? 0;
  const level = getLevelFromXp(totalXp);

  const stats = [
    { label: 'Total Sessions', value: data?.totalSessions ?? 0, icon: '🎓', subtitle: 'Keep going!' },
    { label: 'Average Score', value: data?.averageScore ? `${data.averageScore}%` : '--', icon: '📊' },
    { label: 'Skills Mastered', value: `${data?.skillsCompleted ?? 0} / 7`, icon: '🦷' },
    { label: 'Total Time', value: formatDuration(data?.totalProbingTime ?? 0), icon: '⏱️' },
    { label: 'Current Level', value: level, icon: '⭐', subtitle: getLevelTitle(level) },
    { label: 'Badges Earned', value: `${data?.badgesEarned ?? 0} / ${BADGE_DEFINITIONS.length}`, icon: '🏆' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-gray-500">
              Welcome back{profile?.name ? `, ${profile.name}` : ''}! Here&apos;s your progress.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/training">
              <Button>Start Training</Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline">View Analytics</Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8">
          <StatsOverview stats={stats} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Charts */}
          <div className="space-y-6 lg:col-span-2">
            <ProgressChart data={data?.weeklyProgress ?? []} />
            <SkillBreakdown skills={data?.skillBreakdown ?? []} />
          </div>

          {/* Right Column - Streak + Activity */}
          <div className="space-y-6">
            <StreakTracker
              streakDays={data?.streakDays ?? 0}
              longestStreak={data?.longestStreak}
            />
            <RecentActivity activities={data?.recentActivity ?? []} />
          </div>
        </div>

        {/* Badges Section */}
        <div className="mt-8">
          <BadgeList earnedBadges={profile?.badges ?? []} />
        </div>
      </div>
    </div>
  );
}
