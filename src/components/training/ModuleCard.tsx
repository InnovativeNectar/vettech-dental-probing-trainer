'use client';

import type { TrainingModule } from '@/lib/training-data';

interface ModuleCardProps {
  module: TrainingModule;
  isLocked: boolean;
  progress?: number; // 0-100
  onSelect: (moduleId: string) => void;
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

export function ModuleCard({ module, isLocked, progress = 0, onSelect }: ModuleCardProps) {
  return (
    <button
      onClick={() => !isLocked && onSelect(module.id)}
      disabled={isLocked}
      className={`group flex w-full flex-col rounded-xl border p-5 text-left transition-all ${
        isLocked
          ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-60'
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <span className="text-2xl">{TYPE_ICONS[module.type] || '📚'}</span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_COLORS[module.difficulty]}`}>
          {module.difficulty}
        </span>
      </div>

      <h3 className="mb-1 font-semibold text-gray-900 group-hover:text-blue-600">
        {isLocked && '🔒 '}{module.title}
      </h3>
      <p className="mb-3 line-clamp-2 text-sm text-gray-500">{module.description}</p>

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
