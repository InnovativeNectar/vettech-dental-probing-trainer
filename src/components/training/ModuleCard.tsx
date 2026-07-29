'use client';

import type { TrainingModule } from '@/lib/training-data';

interface ModuleCardProps {
  module: TrainingModule;
  isLocked: boolean;
  isNextUp?: boolean;
  progress?: number; // 0-100
  onSelect: (moduleId: string) => void;
  prerequisiteTitles?: string[];
}

const TYPE_ICONS: Record<string, string> = {
  orientation: '🦷',
  numbering: '🔢',
  technique: '🔬',
  measurement: '📏',
  pathology: '🩺',
  charting: '📋',
  decision: '🧠',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
  clinical: 'bg-purple-100 text-purple-700',
};

export function ModuleCard({ module, isLocked, isNextUp, progress = 0, onSelect, prerequisiteTitles }: ModuleCardProps) {
  return (
    <button
      onClick={() => onSelect(module.id)}
      className={`group flex w-full flex-col rounded-xl border p-5 text-left transition-all ${
        isLocked && !isNextUp
          ? 'border-gray-200 bg-gray-50 opacity-60'
          : isNextUp
            ? 'border-blue-300 bg-blue-50 hover:shadow-md'
            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <span className="text-2xl">{TYPE_ICONS[module.type] || '📚'}</span>
        <div className="flex items-center gap-1.5">
          {isNextUp && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              Next Up
            </span>
          )}
          {isLocked && prerequisiteTitles && prerequisiteTitles.length > 0 && (
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
              Prerequisites
            </span>
          )}
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_COLORS[module.difficulty]}`}>
            {module.difficulty}
          </span>
        </div>
      </div>

      <h3 className="mb-1 font-semibold text-gray-900 group-hover:text-blue-600">
        {isLocked && !isNextUp && '🔒 '}{module.title}
      </h3>
      <p className="mb-3 line-clamp-2 text-sm text-gray-500">{module.description}</p>
      {isLocked && prerequisiteTitles && prerequisiteTitles.length > 0 && (
        <p className="mb-2 text-xs text-orange-600">
          Complete first: {prerequisiteTitles.join(', ')}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
        <span>{module.lessonCount} lessons · {module.estimatedMinutes} min</span>
        {progress > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-medium text-blue-600">{progress}%</span>
          </div>
        )}
      </div>
    </button>
  );
}
