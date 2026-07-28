'use client';

import { useState, useCallback, useEffect } from 'react';
import { type TrainingLesson } from '@/lib/training-data';
import { LessonStep } from './LessonStep';
import { LessonProgress } from './LessonProgress';
import { LessonComplete } from './LessonComplete';

interface LessonFlowProps {
  lesson: TrainingLesson;
  onComplete: (score: number, timeSpent: number) => void;
  onBackToModules: () => void;
}

export function LessonFlow({ lesson, onComplete, onBackToModules }: LessonFlowProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(() => Date.now());

  const steps = lesson.steps;
  const currentStep = steps[currentStepIdx];

  useEffect(() => {
    if (isComplete) return;
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, isComplete]);

  const finishLesson = useCallback((finalCompleted: Set<string>) => {
    const score = Math.round((finalCompleted.size / steps.length) * 100);
    const time = Math.floor((Date.now() - startTime) / 1000);
    setElapsedTime(time);
    setIsComplete(true);
    onComplete(score, time);
  }, [steps.length, startTime, onComplete]);

  const handleNext = useCallback(() => {
    if (!currentStep) return;
    const updated = new Set(completedSteps).add(currentStep.id);
    setCompletedSteps(updated);
    setShowHint(false);

    if (currentStepIdx + 1 < steps.length) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      finishLesson(updated);
    }
  }, [currentStep, currentStepIdx, steps.length, completedSteps, finishLesson]);

  const handleSkip = useCallback(() => {
    setShowHint(false);
    if (currentStepIdx + 1 < steps.length) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      finishLesson(completedSteps);
    }
  }, [currentStepIdx, steps.length, completedSteps, finishLesson]);

  const handleHint = useCallback(() => {
    setShowHint(true);
  }, []);

  if (isComplete) {
    return (
      <LessonComplete
        lessonTitle={lesson.title}
        totalSteps={steps.length}
        completedSteps={completedSteps.size}
        score={Math.round((completedSteps.size / steps.length) * 100)}
        timeSpentSeconds={elapsedTime}
        onBackToModules={onBackToModules}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <LessonProgress
        currentStep={currentStepIdx + 1}
        totalSteps={steps.length}
        completedSteps={completedSteps.size}
        lessonTitle={lesson.title}
      />

      {currentStep && (
        <LessonStep
          key={currentStep.id}
          step={currentStep}
          isCompleted={completedSteps.has(currentStep.id)}
          isActive={true}
          onNext={handleNext}
          onHint={handleHint}
          showHint={showHint}
        />
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Step {currentStepIdx + 1} of {steps.length} · {elapsedTime}s elapsed
        </span>
        <button
          onClick={handleSkip}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Skip Step →
        </button>
      </div>
    </div>
  );
}
