'use client';

interface LessonProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
  lessonTitle: string;
}

export function LessonProgress({ currentStep: _currentStep, totalSteps, completedSteps, lessonTitle }: LessonProgressProps) {
  const pct = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="mb-4">
      <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
        <span className="font-medium text-gray-700">{lessonTitle}</span>
        <span>{completedSteps}/{totalSteps} steps</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
