'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AssessmentList } from '@/components/assessment';
import { ASSESSMENTS } from '@/lib/assessment-data';

export default function AssessmentPage() {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredAssessments = useMemo(() => {
    if (typeFilter === 'all') return ASSESSMENTS;
    return ASSESSMENTS.filter(a => a.type === typeFilter);
  }, [typeFilter]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Assessments</h1>
          <p className="text-gray-500">Timed quizzes and practical evaluations</p>
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">Type</label>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="quiz">Quiz</option>
            <option value="practical">Practical</option>
            <option value="clinical">Clinical</option>
            <option value="comprehensive">Comprehensive</option>
          </select>
        </div>

        <AssessmentList
          assessments={filteredAssessments}
          onSelectAssessment={id => router.push(`/assessment/${id}`)}
        />
      </div>
    </div>
  );
}
