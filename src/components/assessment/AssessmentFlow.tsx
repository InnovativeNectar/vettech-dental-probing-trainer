'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import type { Assessment, AssessmentResult, Answer } from '@/types';
import { useAssessmentStore } from '@/stores';
import { gradeAnswer, createAttempt, generateFeedback } from '@/lib/assessment-engine';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogHeader, DialogContent, DialogFooter } from '@/components/ui/Dialog';
import { QuestionRenderer } from './QuestionRenderer';

interface AssessmentFlowProps {
  assessment: Assessment;
  onComplete: (result: AssessmentResult) => void;
  onExit: () => void;
}

export function AssessmentFlow({ assessment, onComplete, onExit }: AssessmentFlowProps) {
  const {
    currentQuestionIndex,
    answers,
    timeRemaining,
    isAssessmentActive,
    startAttempt,
    submitAnswer,
    updateTimeRemaining,
    nextQuestion,
    previousQuestion,
    resetAssessment,
  } = useAssessmentStore();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const timeUpRef = useRef(false);

  const handleSubmit = useCallback(() => {
    const gradedAnswers = assessment.questions.map((question) => {
      const answer = answers.find((a) => a.questionId === question.id);
      const result = gradeAnswer(question.id, answer?.userAnswer ?? '', assessment);
      return {
        questionId: question.id,
        userAnswer: answer?.userAnswer ?? '',
        isCorrect: result.isCorrect,
        pointsEarned: result.pointsEarned,
      };
    });

    const totalSeconds = assessment.timeLimitMinutes * 60 - timeRemaining;
    const attempt = createAttempt(assessment, gradedAnswers, totalSeconds);
    const feedback = generateFeedback(assessment, gradedAnswers);

    resetAssessment();
    onComplete({ attempt, assessment, feedback });
  }, [assessment, answers, timeRemaining, resetAssessment, onComplete]);

  useEffect(() => {
    if (isAssessmentActive) return;
    startAttempt(assessment);
  }, [assessment, isAssessmentActive, startAttempt]);

  useEffect(() => {
    if (timeRemaining <= 0 && isAssessmentActive) {
      if (!timeUpRef.current) {
        timeUpRef.current = true;
        setShowTimeUp(true);
        handleSubmit();
      }
      return;
    }

    const timer = setInterval(() => {
      updateTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isAssessmentActive, updateTimeRemaining, handleSubmit]);

  const existingAnswer = answers.find(
    (a) => a.questionId === assessment.questions[currentQuestionIndex]?.id
  );

  const handleAnswer = useCallback(
    (answer: string | string[]) => {
      const question = assessment.questions[currentQuestionIndex];
      if (!question) return;

      const newAnswer: Answer = {
        questionId: question.id,
        userAnswer: answer,
        isCorrect: false,
        pointsEarned: 0,
      };

      if (existingAnswer) {
        const updatedAnswers = answers.map((a) =>
          a.questionId === question.id ? newAnswer : a
        );
        useAssessmentStore.setState({ answers: updatedAnswers });
      } else {
        submitAnswer(newAnswer);
      }
    },
    [assessment, currentQuestionIndex, existingAnswer, answers, submitAnswer]
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const question = assessment.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === assessment.questions.length - 1;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{assessment.title}</h2>
        <div
          className={`rounded-lg px-3 py-1.5 font-mono text-lg font-bold ${
            timeRemaining <= 60
              ? 'bg-red-100 text-red-700'
              : timeRemaining <= 300
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
          }`}
        >
          {formatTime(timeRemaining)}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-1.5">
        {assessment.questions.map((q, i) => {
          const hasAnswer = answers.some((a) => a.questionId === q.id);
          return (
            <button
              key={q.id}
              onClick={() => {
                if (i < currentQuestionIndex) previousQuestion();
                if (i > currentQuestionIndex) nextQuestion();
              }}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                i === currentQuestionIndex
                  ? 'bg-blue-600 scale-125'
                  : hasAnswer
                    ? 'bg-green-400'
                    : 'bg-gray-300'
              }`}
            />
          );
        })}
      </div>

      <p className="mb-4 text-sm text-gray-500">
        Question {currentQuestionIndex + 1} of {assessment.questions.length}
      </p>

      {question && (
        <QuestionRenderer
          key={question.id}
          question={question}
          answer={existingAnswer?.userAnswer}
          onAnswer={handleAnswer}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={assessment.questions.length}
        />
      )}

      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        {isLastQuestion ? (
          <Button onClick={() => setShowConfirm(true)}>
            Submit Assessment
          </Button>
        ) : (
          <Button onClick={nextQuestion}>
            Next
          </Button>
        )}
      </div>

      <div className="mt-4 text-center">
        <Button variant="ghost" onClick={() => { resetAssessment(); onExit(); }}>
          Exit Assessment
        </Button>
      </div>

      <Dialog open={showConfirm} onClose={() => setShowConfirm(false)}>
        <DialogHeader>
          <h2 className="text-lg font-semibold text-gray-900">Submit Assessment?</h2>
        </DialogHeader>
        <DialogContent>
          <p className="text-sm text-gray-500">
            You have answered {answers.length} of {assessment.questions.length} questions.
            Are you sure you want to submit?
          </p>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={showTimeUp} onClose={() => {}}>
        <DialogHeader>
          <h2 className="text-lg font-semibold text-red-700">Time&apos;s up!</h2>
        </DialogHeader>
        <DialogContent>
          <p className="text-sm text-gray-500">
            Your assessment has been submitted automatically.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
