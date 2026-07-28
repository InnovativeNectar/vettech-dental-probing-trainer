'use client';

import type { Assessment } from '@/types';
import { AssessmentCard } from './AssessmentCard';

interface AssessmentListProps {
  assessments: Assessment[];
  onSelectAssessment: (id: string) => void;
}

export function AssessmentList({ assessments, onSelectAssessment }: AssessmentListProps) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Assessments</h1>
        <p className="text-gray-500">
          {assessments.length} assessment{assessments.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {assessments.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          No assessments available.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assessments.map((assessment) => (
            <AssessmentCard
              key={assessment.id}
              assessment={assessment}
              onSelect={onSelectAssessment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
