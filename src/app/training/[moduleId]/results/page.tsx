'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { TRAINING_MODULES, SORTED_MODULES } from '@/lib/training-data';
import { useTrainingStore, useUserStore } from '@/stores';
import { useEffect } from 'react';

export default function ResultsPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const user = useUserStore((s) => s.user);
  const { moduleProgress, lessonProgress, fetchProgress } = useTrainingStore();
  const mod = TRAINING_MODULES.find((m) => m.id === moduleId);
  const modIdx = SORTED_MODULES.findIndex((m) => m.id === moduleId);
  const nextModule = modIdx >= 0 && modIdx < SORTED_MODULES.length - 1 ? SORTED_MODULES[modIdx + 1] : null;

  useEffect(() => {
    if (user) fetchProgress(user.id);
  }, [user, fetchProgress]);

  if (!mod) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Module Not Found</h2>
          <Link href="/training" className="text-blue-600 hover:underline">Back to Training</Link>
        </div>
      </div>
    );
  }

  const mp = moduleProgress.find((p) => p.moduleId === moduleId);
  const completedLessons = mp?.completedLessons ?? 0;
  const totalLessons = mod.lessonCount;
  const avgScore = mp?.averageScore ?? 0;

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href={`/training/${moduleId}`}
          className="mb-2 text-sm text-gray-400 hover:text-gray-600"
        >
          ← Back to {mod.title}
        </Link>
        <h1 className="text-3xl font-bold">Results: {mod.title}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Summary */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Module Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-blue-600">{completedLessons}/{totalLessons}</div>
              <div className="text-xs text-gray-500">Lessons completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{avgScore}%</div>
              <div className="text-xs text-gray-500">Average score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{mp?.status === 'completed' ? '✓' : '—'}</div>
              <div className="text-xs text-gray-500">Status</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-700">{mp?.status ?? 'not started'}</div>
              <div className="text-xs text-gray-500">Module status</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-gray-500">
              <span>Completion</span>
              <span>{Math.round((completedLessons / totalLessons) * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Lessons</h2>
          <div className="space-y-2">
            {mod.lessons.map((l) => {
              const lp = lessonProgress.find((p) => p.lessonId === l.id);
              return (
                <div key={l.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <span className="text-sm text-gray-700">{l.title}</span>
                  <span className={`text-sm font-medium ${
                    lp?.status === 'completed' ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {lp?.status === 'completed' ? `${lp.score ?? 100}%` : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next steps */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Next Steps</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/training/${moduleId}`}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Continue Module →
            </Link>
            {nextModule && (
              <Link
                href={`/training/${nextModule.id}`}
                className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
              >
                Next: {nextModule.title} →
              </Link>
            )}
            <Link
              href="/training"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              All Modules
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
