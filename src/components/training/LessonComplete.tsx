'use client';

interface LessonCompleteProps {
  lessonTitle: string;
  totalSteps: number;
  completedSteps: number;
  score: number;
  timeSpentSeconds: number;
  onNextLesson?: () => void;
  onRetry?: () => void;
  onBackToModules?: () => void;
}

export function LessonComplete({
  lessonTitle,
  totalSteps,
  completedSteps,
  score,
  timeSpentSeconds,
  onNextLesson,
  onRetry,
  onBackToModules,
}: LessonCompleteProps) {
  const minutes = Math.floor(timeSpentSeconds / 60);
  const seconds = timeSpentSeconds % 60;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 text-6xl">🎉</div>
      <h2 className="mb-2 text-2xl font-bold text-gray-900">Lesson Complete!</h2>
      <p className="mb-6 text-gray-500">{lessonTitle}</p>

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

      <div className="flex gap-3">
        {onNextLesson && (
          <button
            onClick={onNextLesson}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Next Lesson →
          </button>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Retry
          </button>
        )}
        {onBackToModules && (
          <button
            onClick={onBackToModules}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Modules
          </button>
        )}
      </div>
    </div>
  );
}
