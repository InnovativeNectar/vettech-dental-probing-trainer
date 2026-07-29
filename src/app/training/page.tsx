'use client';

import { useEffect } from 'react';
import { ModuleList } from '@/components/training';
import { useTrainingStore } from '@/stores';
import { useUserStore } from '@/stores';

export default function TrainingPage() {
  const { moduleProgress, isLoading, fetchModules } = useTrainingStore();
  const user = useUserStore((s) => s.user);

  useEffect(() => {
    fetchModules(user?.id);
  }, [fetchModules, user?.id]);

  const completedModules = moduleProgress
    .filter((p) => p.status === 'completed')
    .map((p) => p.moduleId);
  const progressMap = Object.fromEntries(
    moduleProgress.map((p) => [p.moduleId, Math.round((p.completedLessons / p.totalLessons) * 100)])
  );

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-8">
        <h1 className="mb-2 text-3xl font-bold">Training Modules</h1>
        <p className="mb-8 text-gray-500">
          4 progressive modules from basics to clinical decision making
        </p>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <span className="text-gray-400">Loading modules...</span>
          </div>
        ) : (
          <ModuleList
            completedModules={completedModules}
            moduleProgress={progressMap}
          />
        )}
      </div>
    </div>
  );
}
