'use client';

import type { ClinicalCase } from '@/types';
import { CaseCard } from './CaseCard';

interface CaseListProps {
  cases: ClinicalCase[];
  onSelectCase: (id: string) => void;
  completedIds?: string[];
}

export function CaseList({ cases, onSelectCase, completedIds = [] }: CaseListProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        {cases.length} clinical case{cases.length !== 1 ? 's' : ''}
      </h2>

      {cases.length === 0 ? (
        <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-300 py-16">
          <p className="text-sm text-gray-500">No cases match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <CaseCard
              key={c.id}
              case={c}
              onSelect={onSelectCase}
              isCompleted={completedIds.includes(c.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
