'use client';

import { useState } from 'react';
import { TRAINING_MODULES } from '@/lib/training-data';
import { ModuleCard } from './ModuleCard';
import { DifficultySelector } from './DifficultySelector';
import type { DifficultyLevel } from '@/types';

interface ModuleListProps {
  onSelectModule?: (moduleId: string) => void;
  completedModules?: string[];
  moduleProgress?: Record<string, number>;
}

export function ModuleList({ onSelectModule, completedModules = [], moduleProgress = {} }: ModuleListProps) {
  const handleSelect = onSelectModule ?? ((id: string) => { window.location.href = `/training/${id}`; });
  const [difficulty, setDifficulty] = useState<DifficultyLevel | 'all'>('all');

  const filtered = difficulty === 'all'
    ? TRAINING_MODULES
    : TRAINING_MODULES.filter((m) => m.difficulty === difficulty);

  const isModuleLocked = (module: typeof TRAINING_MODULES[0]) => {
    if (completedModules.includes(module.id)) return false;
    return module.requiredModules.some((req) => !completedModules.includes(req));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Training Modules</h1>
        <p className="mb-4 text-gray-500">Master veterinary dental probing step by step.</p>
        <DifficultySelector
          selected={difficulty === 'all' ? 'beginner' : difficulty}
          onChange={(d) => setDifficulty(d)}
        />
        <button
          onClick={() => setDifficulty('all')}
          className={`ml-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            difficulty === 'all' ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            isLocked={isModuleLocked(module)}
            progress={moduleProgress[module.id]}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-gray-400">
          No modules found for this difficulty level.
        </div>
      )}
    </div>
  );
}
