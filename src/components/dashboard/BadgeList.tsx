'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';
import { BADGE_DEFINITIONS, TIER_COLORS, type BadgeDefinition } from '@/lib/gamification';

interface EarnedBadge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  earnedAt: Date;
}

interface BadgeListProps {
  earnedBadges: EarnedBadge[];
}

function BadgeCard({ def, isEarned, earnedAt }: { def: BadgeDefinition; isEarned: boolean; earnedAt?: Date }) {
  const tier = TIER_COLORS[def.tier];

  return (
    <div
      className={cn(
        'relative flex flex-col items-center rounded-xl border p-4 text-center transition-all',
        isEarned
          ? `${tier.bg} ${tier.border} shadow-sm`
          : 'border-gray-200 bg-gray-50 opacity-50 grayscale'
      )}
    >
      <span className="text-3xl">{def.icon}</span>
      <h4 className="mt-2 text-sm font-semibold text-gray-900">{def.name}</h4>
      <p className="mt-0.5 text-xs text-gray-500">{def.description}</p>
      {isEarned && earnedAt && (
        <p className="mt-1 text-[10px] text-gray-400">
          Earned {new Date(earnedAt).toLocaleDateString()}
        </p>
      )}
      {!isEarned && (
        <p className="mt-1 text-[10px] text-gray-400">+{def.xpReward} XP</p>
      )}
      <span
        className={cn(
          'mt-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase',
          tier.bg,
          tier.text
        )}
      >
        {def.tier}
      </span>
    </div>
  );
}

export function BadgeList({ earnedBadges }: BadgeListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Badges</CardTitle>
          <span className="text-sm text-gray-500">
            {earnedBadges.length} / {BADGE_DEFINITIONS.length} earned
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {BADGE_DEFINITIONS.map((def) => {
            const earned = earnedBadges.find((b) => b.id === def.id);
            return (
              <BadgeCard
                key={def.id}
                def={def}
                isEarned={!!earned}
                earnedAt={earned?.earnedAt}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
