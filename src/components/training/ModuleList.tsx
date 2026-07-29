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

const MODULES_BY_ID = Object.fromEntries(TRAINING_MODULES.map((m) => [m.id, m]));

export function ModuleList({ onSelectModule, completedModules = [], moduleProgress = {} }: ModuleListProps) {
  const handleSelect = onSelectModule ?? ((id: string) => { window.location.href = `/training/${id}`; });
  const [difficulty, setDifficulty] = useState<DifficultyLevel | 'all'>('all');

  const sorted = [...TRAINING_MODULES].sort((a, b) => a.sortOrder - b.sortOrder);
  const filtered = difficulty === 'all'
    ? sorted
    : sorted.filter((m) => m.difficulty === difficulty);

  const isModuleLocked = (module: typeof TRAINING_MODULES[0]) => {
    if (completedModules.includes(module.id)) return false;
    return module.requiredModules.some((req) => !completedModules.includes(req));
  };

  const prerequisiteTitles = (module: typeof TRAINING_MODULES[0]) => {
    return module.requiredModules
      .filter((req) => !completedModules.includes(req))
      .map((req) => MODULES_BY_ID[req]?.title)
      .filter(Boolean);
  };

  const nextUpModule = sorted.find((m) => !completedModules.includes(m.id));

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
            isNextUp={nextUpModule?.id === module.id}
            progress={moduleProgress[module.id]}
            onSelect={handleSelect}
            prerequisiteTitles={prerequisiteTitles(module)}
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
