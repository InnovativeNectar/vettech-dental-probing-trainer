'use client';

import type { DifficultyLevel } from '@/types';

interface DifficultySelectorProps {
  selected: DifficultyLevel;
  onChange: (level: DifficultyLevel) => void;
  disabled?: boolean;
}

const LEVELS: { value: DifficultyLevel; label: string; color: string }[] = [
  { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-700 border-green-300' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-700 border-red-300' },
  { value: 'clinical', label: 'Clinical', color: 'bg-purple-100 text-purple-700 border-purple-300' },
];

export function DifficultySelector({ selected, onChange, disabled = false }: DifficultySelectorProps) {
  return (
    <div className="flex gap-2">
      {LEVELS.map(({ value, label, color }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          disabled={disabled}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            selected === value ? color : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
          } disabled:opacity-50`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
