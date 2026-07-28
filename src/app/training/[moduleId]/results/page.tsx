'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { TRAINING_MODULES } from '@/lib/training-data';

export default function ResultsPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const mod = TRAINING_MODULES.find((m) => m.id === moduleId);

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-8">
        <h1 className="mb-6 text-3xl font-bold">
          Results: {mod?.title ?? moduleId}
        </h1>
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="mb-4 text-gray-500">
            Complete a training session to see your results here.
          </p>
          <Link
            href={`/training/${moduleId}`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Back to Module
          </Link>
        </div>
      </div>
    </div>
  );
}
