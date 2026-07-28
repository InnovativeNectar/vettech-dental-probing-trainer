'use client';

import type { Assessment, AssessmentType } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface AssessmentCardProps {
  assessment: Assessment;
  onSelect: (id: string) => void;
  bestScore?: number;
  attempts?: number;
}

const TYPE_BADGE_VARIANT: Record<AssessmentType, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  quiz: 'default',
  practical: 'secondary',
  clinical: 'warning',
  comprehensive: 'destructive',
};

const TYPE_LABEL: Record<AssessmentType, string> = {
  quiz: 'Quiz',
  practical: 'Practical',
  clinical: 'Clinical',
  comprehensive: 'Comprehensive',
};

const DIFFICULTY_COLORS: Record<AssessmentType, string> = {
  quiz: 'bg-green-100 text-green-700',
  practical: 'bg-yellow-100 text-yellow-700',
  clinical: 'bg-orange-100 text-orange-700',
  comprehensive: 'bg-red-100 text-red-700',
};

export function AssessmentCard({ assessment, onSelect, bestScore, attempts }: AssessmentCardProps) {
  return (
    <button
      onClick={() => onSelect(assessment.id)}
      className="group flex w-full flex-col rounded-xl border border-gray-200 bg-white p-5 text-left transition-all hover:border-blue-300 hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between">
        <Badge variant={TYPE_BADGE_VARIANT[assessment.type]}>
          {TYPE_LABEL[assessment.type]}
        </Badge>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_COLORS[assessment.type]}`}>
          {assessment.type}
        </span>
      </div>

      <h3 className="mb-1 font-semibold text-gray-900 group-hover:text-blue-600">
        {assessment.title}
      </h3>
      <p className="mb-3 line-clamp-2 text-sm text-gray-500">{assessment.description}</p>

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
        <span>{assessment.questions.length} questions</span>
        <span>{assessment.timeLimitMinutes} min</span>
        <span>Pass: {assessment.passingScore}%</span>
      </div>

      {bestScore !== undefined && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
          <span className="text-xs font-medium text-gray-500">Best Score</span>
          <span className={`text-sm font-bold ${bestScore >= assessment.passingScore ? 'text-green-600' : 'text-red-600'}`}>
            {bestScore}%
          </span>
        </div>
      )}

      {attempts !== undefined && attempts > 0 && (
        <p className="mt-2 text-xs text-gray-400">
          {attempts} attempt{attempts !== 1 ? 's' : ''}
        </p>
      )}
    </button>
  );
}
