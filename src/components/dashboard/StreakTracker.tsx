'use client';

import { Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';

interface StreakTrackerProps {
  streakDays: number;
  longestStreak?: number;
  lastPracticeDate?: string;
}

export function StreakTracker({ streakDays, longestStreak = 0, lastPracticeDate }: StreakTrackerProps) {
  const streakColor =
    streakDays >= 7 ? 'text-orange-500' : streakDays >= 3 ? 'text-yellow-500' : 'text-gray-600';

  const streakMessage =
    streakDays >= 30
      ? 'Incredible dedication!'
      : streakDays >= 7
        ? 'Great momentum!'
        : streakDays >= 3
          ? 'Building a habit!'
          : streakDays > 0
            ? 'Good start!'
            : 'Start your streak today!';

  const days = Array.from({ length: 7 }, (_, i) => {
    const isActive = i < streakDays;
    const isToday = i === streakDays - 1;
    return { day: i, isActive, isToday };
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Practice Streak</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className={cn('text-4xl font-bold', streakColor)}>{streakDays}</span>
              <span className="text-sm text-gray-500">days</span>
            </div>
            <p className="mt-1 text-xs text-gray-400">{streakMessage}</p>
          </div>
          <span className="text-4xl">
            {streakDays >= 7 ? '🔥' : streakDays >= 3 ? '✨' : '📅'}
          </span>
        </div>
        <div className="mt-4 flex gap-2">
          {days.map((d) => (
            <div
              key={d.day}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors',
                d.isActive
                  ? d.isToday
                    ? 'bg-orange-500 text-white'
                    : 'bg-orange-200 text-orange-800'
                  : 'bg-gray-100 text-gray-400'
              )}
            >
              {d.day + 1}
            </div>
          ))}
        </div>
        {longestStreak > 0 && (
          <p className="mt-3 text-xs text-gray-400">
            Longest streak: {longestStreak} days
            {lastPracticeDate && ` · Last practice: ${lastPracticeDate}`}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
