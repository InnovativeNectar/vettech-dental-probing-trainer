'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LessonFlow } from '@/components/training';
import { PracticeMode } from '@/components/training';
import { TRAINING_MODULES } from '@/lib/training-data';
import { useState, useCallback, useMemo } from 'react';
import { useUserStore } from '@/stores';

const SORTED_MODULES = [...TRAINING_MODULES].sort((a, b) => a.sortOrder - b.sortOrder);

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const router = useRouter();
  const [mode, setMode] = useState<'lessons' | 'practice'>('lessons');
  const [lessonIdx, setLessonIdx] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const user = useUserStore((s) => s.user);

  const mod = TRAINING_MODULES.find((m) => m.id === moduleId);
  const currentLesson = mod?.lessons[lessonIdx];
  const allLessonsComplete = currentLesson ? completedLessonIds.size >= mod.lessons.length : false;

  const modIdx = useMemo(() => SORTED_MODULES.findIndex((m) => m.id === moduleId), [moduleId]);
  const prevModule = modIdx > 0 ? SORTED_MODULES[modIdx - 1] : null;
  const nextModule = modIdx >= 0 && modIdx < SORTED_MODULES.length - 1 ? SORTED_MODULES[modIdx + 1] : null;
  const nextLessonLabel = mod && lessonIdx + 1 < mod.lessons.length ? mod.lessons[lessonIdx + 1].title : '';

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
    const m = TRAINING_MODULES.find((x) => x.id === moduleId);
    if (m && lessonIdx + 1 < m.lessons.length) {
      setLessonIdx((i) => i + 1);
    }
  }, [lessonIdx, moduleId]);

  const handleRetry = useCallback(() => {
    setLessonIdx(0);
    setCompletedLessonIds(new Set());
  }, []);

  const handlePracticeMode = useCallback(() => {
    setMode('practice');
  }, []);

  const handleNextModule = useCallback(() => {
    if (nextModule) {
      router.push(`/training/${nextModule.id}`);
    }
  }, [nextModule, router]);

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
    <div>
      {/* Module header */}
      <div className="border-b border-gray-200 bg-white px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/training" className="mb-1 text-sm text-gray-400 hover:text-gray-600">
              ← Training Modules
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{mod.title}</h1>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                Module {mod.sortOrder} of {SORTED_MODULES.length}
              </span>
            </div>
            <p className="text-sm text-gray-500">{mod.description}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Module nav */}
            <div className="flex items-center gap-1">
              {prevModule && (
                <Link
                  href={`/training/${prevModule.id}`}
                  className="rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  ← {prevModule.title}
                </Link>
              )}
              {nextModule && (
                <Link
                  href={`/training/${nextModule.id}`}
                  className="rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  {nextModule.title} →
                </Link>
              )}
            </div>
            {/* Mode toggle */}
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

        {/* Lesson progress bar when in lesson mode */}
        {mode === 'lessons' && (
          <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
            {mod.lessons.map((l, i) => (
              <button
                key={l.id}
                onClick={() => setLessonIdx(i)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  i === lessonIdx
                    ? 'bg-blue-100 text-blue-700'
                    : completedLessonIds.has(l.id)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {completedLessonIds.has(l.id) ? '✓' : i === lessonIdx ? '▶' : ''}
                {l.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8">
        {mode === 'lessons' && currentLesson ? (
          <LessonFlow
            lesson={currentLesson}
            onComplete={handleComplete}
            onNextLesson={allLessonsComplete ? undefined : handleNextLesson}
            onBackToModules={() => { router.push('/training'); }}
            onRetry={handleRetry}
            isLastLesson={allLessonsComplete}
            moduleTitle={mod.title}
            moduleProgress={completedLessonIds.size}
            moduleLessonCount={mod.lessons.length}
            nextLessonLabel={nextLessonLabel}
            onPracticeMode={handlePracticeMode}
            onNextModule={nextModule ? handleNextModule : undefined}
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
  );
}
