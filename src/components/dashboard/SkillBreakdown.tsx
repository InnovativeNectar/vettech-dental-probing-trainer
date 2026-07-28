'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { SKILL_AREAS } from '@/lib/gamification';

interface SkillData {
  skill: string;
  level: number;
  xp: number;
}

interface SkillBreakdownProps {
  skills: SkillData[];
}

export function SkillBreakdown({ skills }: SkillBreakdownProps) {
  const chartData = SKILL_AREAS.map((area) => {
    const skill = skills.find((s) => s.skill === area.name);
    return {
      subject: area.name,
      level: skill?.level ?? 0,
      xp: skill?.xp ?? 0,
      fullMark: 10,
    };
  });

  const hasData = skills.length > 0 && skills.some((s) => s.level > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Skill Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-64 items-center justify-center text-gray-400">
            Start training to develop skills.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Level"
                  dataKey="level"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {chartData.map((item) => (
                <div key={item.subject} className="flex items-center gap-3">
                  <span className="text-lg">{SKILL_AREAS.find((a) => a.name === item.subject)?.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{item.subject}</span>
                      <span className="text-xs text-gray-500">Lv. {item.level}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${Math.min((item.xp / 500) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
