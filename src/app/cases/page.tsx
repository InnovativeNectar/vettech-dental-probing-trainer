'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CaseList } from '@/components/cases';
import { CLINICAL_CASES, getCasesBySpecies } from '@/lib/case-data';
import type { Species } from '@/types';

export default function CasesPage() {
  const router = useRouter();
  const [speciesFilter, setSpeciesFilter] = useState<Species | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const filteredCases = useMemo(() => {
    let cases = speciesFilter === 'all' ? CLINICAL_CASES : getCasesBySpecies(speciesFilter);
    if (difficultyFilter !== 'all') {
      cases = cases.filter(c => c.difficulty === difficultyFilter);
    }
    return cases;
  }, [speciesFilter, difficultyFilter]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Clinical Cases</h1>
          <p className="text-gray-500">Real-world veterinary dental scenarios</p>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Species</label>
            <select
              value={speciesFilter}
              onChange={e => setSpeciesFilter(e.target.value as Species | 'all')}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Species</option>
              <option value="canine">Canine</option>
              <option value="feline">Feline</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Difficulty</label>
            <select
              value={difficultyFilter}
              onChange={e => setDifficultyFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <CaseList cases={filteredCases} onSelectCase={id => router.push(`/cases/${id}`)} />
      </div>
    </div>
  );
}
