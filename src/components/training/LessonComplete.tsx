'use client';

interface LessonCompleteProps {
  lessonTitle: string;
  lessonLabel: string;
  totalSteps: number;
  completedSteps: number;
  score: number;
  timeSpentSeconds: number;
  isLastLesson: boolean;
  moduleTitle: string;
  moduleProgress: number;
  moduleLessonCount: number;
  onNextLesson?: () => void;
  onRetry?: () => void;
  onBackToModules?: () => void;
  onPracticeMode?: () => void;
  onNextModule?: () => void;
}

export function LessonComplete({
  lessonTitle,
  lessonLabel,
  totalSteps,
  completedSteps,
  score,
  timeSpentSeconds,
  isLastLesson,
  moduleTitle,
  moduleProgress,
  moduleLessonCount,
  onNextLesson,
  onRetry,
  onBackToModules,
  onPracticeMode,
  onNextModule,
}: LessonCompleteProps) {
  const minutes = Math.floor(timeSpentSeconds / 60);
  const seconds = timeSpentSeconds % 60;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 text-6xl">{isLastLesson ? '🏆' : '🎉'}</div>
      <h2 className="mb-2 text-2xl font-bold text-gray-900">
        {isLastLesson ? 'Module Complete!' : 'Lesson Complete!'}
      </h2>
      <p className="mb-1 text-gray-500">{lessonTitle}</p>

      {isLastLesson && (
        <p className="mb-6 text-sm font-medium text-blue-600">
          You finished all {moduleLessonCount} lessons in {moduleTitle}
        </p>
      )}

      <div className="mb-6 grid grid-cols-3 gap-6">
        <div>
          <div className="text-3xl font-bold text-blue-600">{completedSteps}/{totalSteps}</div>
          <div className="text-xs text-gray-500">Steps</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-green-600">{score}%</div>
          <div className="text-xs text-gray-500">Score</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-700">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500">Time</div>
        </div>
      </div>

      {!isLastLesson && moduleProgress > 0 && (
        <div className="mb-6 w-full max-w-xs">
          <div className="mb-1 flex justify-between text-xs text-gray-500">
            <span>Module progress</span>
            <span>{moduleProgress}/{moduleLessonCount} lessons</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${(moduleProgress / moduleLessonCount) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        {onNextLesson && !isLastLesson && (
          <button
            onClick={onNextLesson}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Next Lesson: {lessonLabel} →
          </button>
        )}

        {isLastLesson && onPracticeMode && (
          <button
            onClick={onPracticeMode}
            className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-green-700"
          >
            Practice Mode →
          </button>
        )}

        {isLastLesson && onNextModule && (
          <button
            onClick={onNextModule}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Next Module →
          </button>
        )}

        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Retry This Lesson
          </button>
        )}

        {onBackToModules && (
          <button
            onClick={onBackToModules}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            All Modules
          </button>
        )}
      </div>
    </div>
  );
}
