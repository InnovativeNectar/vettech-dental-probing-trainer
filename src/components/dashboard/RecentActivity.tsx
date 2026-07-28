'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  type: 'training' | 'assessment' | 'case' | 'badge';
  title: string;
  description: string;
  score?: number;
  timestamp: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const TYPE_ICONS: Record<ActivityItem['type'], string> = {
  training: '🎓',
  assessment: '📝',
  case: '🏥',
  badge: '🏆',
};

const TYPE_COLORS: Record<ActivityItem['type'], string> = {
  training: 'bg-blue-100 text-blue-800',
  assessment: 'bg-purple-100 text-purple-800',
  case: 'bg-green-100 text-green-800',
  badge: 'bg-yellow-100 text-yellow-800',
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="py-8 text-center text-gray-400">
            <span className="text-3xl">📭</span>
            <p className="mt-2 text-sm">No activity yet. Start a training session!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 10).map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
              >
                <span className="text-xl">{TYPE_ICONS[item.type]}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate text-sm font-medium text-gray-900">{item.title}</h4>
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', TYPE_COLORS[item.type])}>
                      {item.type}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-gray-500">{item.description}</p>
                  {item.score !== undefined && (
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            item.score >= 90 ? 'bg-green-500' : item.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          )}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600">{item.score}%</span>
                    </div>
                  )}
                </div>
                <span className="whitespace-nowrap text-xs text-gray-400">{item.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
