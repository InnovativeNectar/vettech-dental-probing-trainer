'use client';

import type { Species, AgeGroup } from '@/types';

interface ToothSelectorProps {
  selectedSpecies: Species;
  selectedAgeGroup: AgeGroup;
  onSpeciesChange: (species: Species) => void;
  onAgeGroupChange: (ageGroup: AgeGroup) => void;
  disabled?: boolean;
}

export function ToothSelector({
  selectedSpecies,
  selectedAgeGroup,
  onSpeciesChange,
  onAgeGroupChange,
  disabled = false,
}: ToothSelectorProps) {
  return (
    <div className="flex gap-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Species</label>
        <div className="flex gap-1">
          {(['canine', 'feline'] as const).map((s) => (
            <button
              key={s}
              onClick={() => onSpeciesChange(s)}
              disabled={disabled}
              className={`rounded px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                selectedSpecies === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } disabled:opacity-50`}
            >
              {s === 'canine' ? '🐕 Dog' : '🐈 Cat'}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Age</label>
        <div className="flex gap-1">
          {(['adult', 'juvenile'] as const).map((a) => (
            <button
              key={a}
              onClick={() => onAgeGroupChange(a)}
              disabled={disabled}
              className={`rounded px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                selectedAgeGroup === a
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } disabled:opacity-50`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
