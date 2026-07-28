'use client';

import { Card, CardContent } from '@/components/ui';

interface StatCard {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

interface StatsOverviewProps {
  stats: StatCard[];
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.subtitle && (
                  <p className="mt-0.5 text-xs text-gray-400">{stat.subtitle}</p>
                )}
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            {stat.trend && stat.trendValue && (
              <div className="mt-2 flex items-center gap-1">
                <span
                  className={
                    stat.trend === 'up'
                      ? 'text-green-600'
                      : stat.trend === 'down'
                        ? 'text-red-600'
                        : 'text-gray-500'
                  }
                >
                  {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'} {stat.trendValue}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
