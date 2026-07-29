'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { LessonFlow } from '@/components/training';
import { PracticeMode } from '@/components/training';
import { TRAINING_MODULES } from '@/lib/training-data';
import { useState, useCallback } from 'react';
import { useUserStore } from '@/stores';

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [mode, setMode] = useState<'lessons' | 'practice'>('lessons');
  const [lessonIdx, setLessonIdx] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const user = useUserStore((s) => s.user);

  const mod = TRAINING_MODULES.find((m) => m.id === moduleId);
  const currentLesson = mod?.lessons[lessonIdx];
  const allLessonsComplete = currentLesson ? completedLessonIds.size >= mod.lessons.length : false;

  const handleComplete = useCallback(async (score: number, timeSpent: number) => {
    if (!user || !currentLesson) return;
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          moduleId: moduleId,
          lessonId: currentLesson.id,
          status: 'completed',
          score,
          timeSpentSeconds: timeSpent,
        }),
      });
    } catch {
      // API unavailable — still allow progress locally
    }
    setCompletedLessonIds((prev) => new Set(prev).add(currentLesson.id));
  }, [user, moduleId, currentLesson]);

  const handleNextLesson = useCallback(() => {
    if (mod && lessonIdx + 1 < mod.lessons.length) {
      setLessonIdx((i) => i + 1);
    }
  }, [lessonIdx, mod?.lessons.length]);

  const handleRetry = useCallback(() => {
    setLessonIdx(0);
    setCompletedLessonIds(new Set());
  }, []);

  if (!mod) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Module Not Found</h2>
          <Link href="/training" className="text-blue-600 hover:underline">
            Back to Training
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <div className="border-b border-gray-200 bg-white px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/training" className="mb-1 text-sm text-gray-400 hover:text-gray-600">
                ← Training Modules
              </Link>
              <h1 className="text-2xl font-bold">{mod.title}</h1>
              <p className="text-sm text-gray-500">{mod.description}</p>
            </div>
            <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setMode('lessons')}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  mode === 'lessons'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Lessons
              </button>
              <button
                onClick={() => setMode('practice')}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  mode === 'practice'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Practice
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {mode === 'lessons' && currentLesson ? (
            <LessonFlow
              lesson={currentLesson}
              onComplete={handleComplete}
              onNextLesson={allLessonsComplete ? undefined : handleNextLesson}
              onBackToModules={() => { window.location.href = '/training'; }}
              onRetry={handleRetry}
            />
          ) : mode === 'practice' ? (
            <PracticeMode
              species="canine"
              ageGroup="adult"
              onSpeciesChange={() => {}}
              onAgeGroupChange={() => {}}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
