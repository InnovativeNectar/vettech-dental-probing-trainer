'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { CaseViewer, CaseAssessment } from '@/components/cases';
import { getCaseById } from '@/lib/case-data';

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showAssessment, setShowAssessment] = useState(false);

  const caseId = params.caseId as string;
  const caseData = getCaseById(caseId);

  if (!caseData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Case Not Found</h1>
          <p className="mb-6 text-gray-500">The case &quot;{caseId}&quot; could not be found.</p>
          <button
            onClick={() => router.push('/cases')}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Cases
          </button>
        </div>
      </div>
    );
  }

  if (showAssessment) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 p-8">
          <button
            onClick={() => setShowAssessment(false)}
            className="mb-6 text-sm text-blue-600 hover:text-blue-800"
          >
            ← Back to case details
          </button>
          <CaseAssessment
            caseData={caseData}
            onComplete={() => {
              setShowAssessment(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8">
        <button
          onClick={() => router.push('/cases')}
          className="mb-6 text-sm text-blue-600 hover:text-blue-800"
        >
          ← Back to cases
        </button>
        <CaseViewer caseData={caseData} onStartAssessment={() => setShowAssessment(true)} />
      </div>
    </div>
  );
}
