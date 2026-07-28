'use client';

import { useEffect } from 'react';
import { useAnalyticsStore } from '@/stores/useAnalyticsStore';
import { useUserStore } from '@/stores/useUserStore';
import {
  ScoreTrendChart,
  TimeSpentChart,
  SkillBreakdown,
} from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
  const { data, timeRange, setTimeRange, loadFromStorage } = useAnalyticsStore();
  const { profile, loadDemoUser } = useUserStore();

  useEffect(() => {
    loadFromStorage();
    loadDemoUser();
  }, [loadFromStorage, loadDemoUser]);

  const totalXp = profile?.skillAreas.reduce((sum, sa) => sum + sa.xp, 0) ?? 0;
  const weeklyMinutes = data?.weeklyProgress.reduce((sum, d) => sum + d.minutes, 0) ?? 0;
  const avgScore = data?.averageScore ?? 0;


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Learning Analytics</h1>
            <p className="mt-1 text-gray-500">Track your progress and skill development over time</p>
          </div>
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                )}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total XP Earned</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{totalXp.toLocaleString()}</p>
                </div>
                <span className="text-3xl">⭐</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${Math.min((totalXp / 10000) * 100, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">{totalXp.toLocaleString()} / 10,000 XP to next level</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Weekly Practice</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{weeklyMinutes}m</p>
                </div>
                <span className="text-3xl">⏱️</span>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                {weeklyMinutes >= 300 ? '🎯 Great weekly goal!' : `${300 - weeklyMinutes}m to reach 5h goal`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Assessment Avg</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{avgScore}%</p>
                </div>
                <span className="text-3xl">📊</span>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                {avgScore >= 90 ? '🏆 Excellent performance' : avgScore >= 70 ? '📈 Good progress' : '💪 Keep practicing'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Skills Developed</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    {profile?.skillAreas.filter((s) => s.level >= 3).length ?? 0}/7
                  </p>
                </div>
                <span className="text-3xl">🦷</span>
              </div>
              <p className="mt-2 text-xs text-gray-400">Skills at level 3+</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ScoreTrendChart data={data?.weeklyProgress ?? []} />
          <TimeSpentChart data={data?.weeklyProgress ?? []} />
        </div>

        {/* Skill Breakdown */}
        <div className="mb-8">
          <SkillBreakdown skills={data?.skillBreakdown ?? []} />
        </div>

        {/* Skill Details Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Skill Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="pb-3 pr-4 font-medium">Skill</th>
                    <th className="pb-3 pr-4 font-medium">Level</th>
                    <th className="pb-3 pr-4 font-medium">XP Progress</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(profile?.skillAreas ?? []).map((skill) => (
                    <tr key={skill.name} className="border-b border-gray-100">
                      <td className="py-3 pr-4 font-medium text-gray-900">{skill.name}</td>
                      <td className="py-3 pr-4">
                        <Badge variant={skill.level >= 5 ? 'success' : skill.level >= 3 ? 'default' : 'secondary'}>
                          Level {skill.level}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-blue-500"
                              style={{ width: `${(skill.xp / skill.maxXp) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {skill.xp}/{skill.maxXp}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-xs text-gray-500">
                          {skill.level >= 5 ? '🏆 Mastered' : skill.level >= 3 ? '📈 Developing' : '🌱 Learning'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
