'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { LessonFlow } from '@/components/training';
import { PracticeMode } from '@/components/training';
import { TRAINING_MODULES } from '@/lib/training-data';
import { useState } from 'react';

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [mode, setMode] = useState<'lessons' | 'practice'>('lessons');

  const mod = TRAINING_MODULES.find((m) => m.id === moduleId);

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

  const firstLesson = mod.lessons[0];

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
          {mode === 'lessons' && firstLesson ? (
            <LessonFlow
              lesson={firstLesson}
              onComplete={() => {}}
              onBackToModules={() => { window.location.href = '/training'; }}
            />
          ) : (
            <PracticeMode
              species="canine"
              ageGroup="adult"
              onSpeciesChange={() => {}}
              onAgeGroupChange={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
}
