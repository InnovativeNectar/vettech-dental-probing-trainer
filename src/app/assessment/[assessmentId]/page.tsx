'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { AssessmentFlow, AssessmentResult } from '@/components/assessment';
import { getAssessmentById } from '@/lib/assessment-data';
import type { AssessmentResult as AssessmentResultType } from '@/types';

export default function AssessmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<AssessmentResultType | null>(null);

  const assessmentId = params.assessmentId as string;
  const assessment = getAssessmentById(assessmentId);

  if (!assessment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Assessment Not Found</h1>
          <p className="mb-6 text-gray-500">The assessment &quot;{assessmentId}&quot; could not be found.</p>
          <button
            onClick={() => router.push('/assessment')}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 p-8">
          <AssessmentResult
            result={result}
            onRetry={() => setResult(null)}
            onBackToList={() => router.push('/assessment')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8">
        <button
          onClick={() => router.push('/assessment')}
          className="mb-6 text-sm text-blue-600 hover:text-blue-800"
        >
          ← Back to assessments
        </button>
        <AssessmentFlow
          assessment={assessment}
          userId="user-001"
          onComplete={setResult}
          onExit={() => router.push('/assessment')}
        />
      </div>
    </div>
  );
}
