'use client';

import type { LessonStep as LessonStepType } from '@/lib/training-data';

interface LessonStepProps {
  step: LessonStepType;
  isCompleted: boolean;
  isActive: boolean;
  onNext?: () => void;
  onHint?: () => void;
  showHint: boolean;
}

export function LessonStep({ step, isCompleted, isActive, onNext, onHint, showHint }: LessonStepProps) {
  if (!isActive) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
          {step.sortOrder}
        </span>
        <h3 className="font-semibold text-gray-900">{step.title}</h3>
        {isCompleted && (
          <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            Done
          </span>
        )}
      </div>

      <p className="mb-3 text-sm text-gray-600">{step.instruction}</p>

      {step.targetTooth && (
        <div className="mb-2 rounded bg-blue-50 px-3 py-1.5 text-xs text-blue-700">
          Target: Tooth #{step.targetTooth}
          {step.targetLocation && ` — ${step.targetLocation}`}
          {step.targetDepthRange && ` (${step.targetDepthRange[0]}-${step.targetDepthRange[1]}mm)`}
        </div>
      )}

      {showHint && (
        <div className="mb-3 rounded bg-amber-50 px-3 py-2 text-xs text-amber-700">
          💡 {step.hint}
        </div>
      )}

      <div className="flex gap-2">
        {!isCompleted && (
          <>
            <button
              onClick={onHint}
              className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              Hint
            </button>
            <button
              onClick={onNext}
              className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
            >
              Skip Step
            </button>
          </>
        )}
        {isCompleted && (
          <button
            onClick={onNext}
            className="rounded bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
