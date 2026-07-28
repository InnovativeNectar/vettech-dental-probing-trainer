import type { Assessment, Answer, AssessmentAttempt, FeedbackItem } from '@/types';

export function calculateAssessmentScore(assessment: Assessment, answers: Answer[]): number {
  const totalPoints = assessment.questions.reduce((sum, q) => sum + q.points, 0);
  const earnedPoints = answers.reduce((sum, a) => sum + a.pointsEarned, 0);
  return totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
}

export function gradeAnswer(
  questionId: string,
  userAnswer: string | string[],
  assessment: Assessment
): { isCorrect: boolean; pointsEarned: number; explanation: string; correctAnswer: string } {
  const question = assessment.questions.find((q) => q.id === questionId);
  if (!question) return { isCorrect: false, pointsEarned: 0, explanation: 'Question not found', correctAnswer: '' };

  const isCorrect = Array.isArray(question.correctAnswer) && Array.isArray(userAnswer)
    ? JSON.stringify([...userAnswer].sort()) === JSON.stringify([...question.correctAnswer].sort())
    : userAnswer === question.correctAnswer;

  return {
    isCorrect,
    pointsEarned: isCorrect ? question.points : 0,
    explanation: question.explanation,
    correctAnswer: Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer,
  };
}

export function generateFeedback(assessment: Assessment, answers: Answer[]): FeedbackItem[] {
  return answers.map((answer) => {
    const question = assessment.questions.find((q) => q.id === answer.questionId);
    return {
      questionId: answer.questionId,
      isCorrect: answer.isCorrect,
      explanation: question?.explanation ?? 'No explanation available',
      correctAnswer: Array.isArray(question?.correctAnswer)
        ? (question!.correctAnswer as string[]).join(', ')
        : (question?.correctAnswer as string ?? ''),
    };
  });
}

export function createAttempt(
  assessment: Assessment,
  answers: Answer[],
  timeSpentSeconds: number
): AssessmentAttempt {
  const score = calculateAssessmentScore(assessment, answers);
  return {
    id: crypto.randomUUID(),
    assessmentId: assessment.id,
    userId: '', // set by caller
    answers,
    score,
    passed: score >= assessment.passingScore,
    timeSpentSeconds,
    startedAt: new Date(Date.now() - timeSpentSeconds * 1000),
    completedAt: new Date(),
  };
}
