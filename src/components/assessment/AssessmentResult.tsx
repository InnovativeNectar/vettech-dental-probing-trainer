'use client';

import type { AssessmentResult as AssessmentResultType } from '@/types';
import { Button } from '@/components/ui/Button';
import { formatDuration } from '@/lib/utils';

interface AssessmentResultProps {
  result: AssessmentResultType;
  onRetry?: () => void;
  onBackToList: () => void;
}

export function AssessmentResult({ result, onRetry, onBackToList }: AssessmentResultProps) {
  const { attempt, assessment, feedback } = result;
  const passed = attempt.passed;
  const score = attempt.score;

  const correctCount = feedback.filter((f) => f.isCorrect).length;
  const totalQuestions = feedback.length;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className={`mb-8 rounded-2xl p-8 text-center ${passed ? 'bg-green-50' : 'bg-red-50'}`}>
        <p className="mb-2 text-sm font-medium text-gray-500">
          {passed ? 'Assessment Passed' : 'Assessment Not Passed'}
        </p>
        <p className={`text-6xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
          {score}%
        </p>
        <p className="mt-2 text-sm text-gray-500">
          {correctCount} of {totalQuestions} questions correct
        </p>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
          <span>Score Progress</span>
          <span className="font-medium">{score}% / {assessment.passingScore}% to pass</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full transition-all ${passed ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${Math.min(score, 100)}%` }}
          />
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Time Taken</p>
            <p className="font-medium text-gray-900">
              {formatDuration(attempt.timeSpentSeconds)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Assessment Type</p>
            <p className="font-medium capitalize text-gray-900">{assessment.type}</p>
          </div>
        </div>
      </div>

      <h3 className="mb-4 text-lg font-semibold text-gray-900">Question Review</h3>
      <div className="space-y-3">
        {feedback.map((item, index) => {
          const question = assessment.questions.find((q) => q.id === item.questionId);
          return (
            <div
              key={item.questionId}
              className={`rounded-xl border p-4 ${
                item.isCorrect
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-gray-900">
                  Q{index + 1}. {question?.content ?? 'Unknown question'}
                </span>
                <span
                  className={`shrink-0 text-lg ${
                    item.isCorrect ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {item.isCorrect ? '✓' : '✗'}
                </span>
              </div>

              {!item.isCorrect && (
                <div className="mt-2 space-y-1 text-sm">
                  <p className="text-red-700">
                    <span className="font-medium">Your answer:</span>{' '}
                    {assessment.questions
                      .find((q) => q.id === item.questionId)
                      ?.options?.find((o) => o.id === item.correctAnswer)?.text ?? '—'}
                  </p>
                  <p className="text-green-700">
                    <span className="font-medium">Correct answer:</span> {item.correctAnswer}
                  </p>
                </div>
              )}

              <p className="mt-2 text-sm text-gray-600">{item.explanation}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center gap-3">
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Retry Assessment
          </Button>
        )}
        <Button onClick={onBackToList}>
          Back to Assessments
        </Button>
      </div>
    </div>
  );
}
