'use client';

import type { ClinicalCase } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface CaseCardProps {
  case: ClinicalCase;
  onSelect: (id: string) => void;
  isCompleted?: boolean;
}

const SEVERITY_STYLES: Record<string, string> = {
  mild: 'bg-green-100 text-green-700',
  moderate: 'bg-yellow-100 text-yellow-700',
  severe: 'bg-red-100 text-red-700',
};

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-blue-100 text-blue-700',
  intermediate: 'bg-purple-100 text-purple-700',
  advanced: 'bg-red-100 text-red-700',
};

export function CaseCard({ case: clinicalCase, onSelect, isCompleted }: CaseCardProps) {
  return (
    <button
      onClick={() => onSelect(clinicalCase.id)}
      className="group flex w-full flex-col text-left"
    >
      <Card className="flex h-full flex-col p-5 transition-all hover:border-blue-300 hover:shadow-md">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex flex-wrap gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${SEVERITY_STYLES[clinicalCase.severity]}`}>
              {clinicalCase.severity}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[clinicalCase.difficulty]}`}>
              {clinicalCase.difficulty}
            </span>
          </div>
          {isCompleted && (
            <Badge variant="success" className="text-xs">
              &#10003; Completed
            </Badge>
          )}
        </div>

        <h3 className="mb-1 font-semibold text-gray-900 group-hover:text-blue-600">
          {clinicalCase.title}
        </h3>

        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary">
            {clinicalCase.species === 'canine' ? '\u2640 Canine' : 'Feline'}
          </Badge>
          <span className="text-xs text-gray-500">{clinicalCase.breed}</span>
        </div>

        <p className="mb-3 line-clamp-2 text-sm text-gray-500">
          {clinicalCase.presentingComplaint}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-gray-400">
          <Badge variant="outline">{clinicalCase.pathologyType.replace(/_/g, ' ')}</Badge>
          <span>{clinicalCase.estimatedMinutes} min</span>
          <span>{clinicalCase.affectedTeeth.length} teeth</span>
        </div>
      </Card>
    </button>
  );
}
