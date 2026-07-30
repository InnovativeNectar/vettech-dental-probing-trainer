'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useProbeStore } from '@/stores';
import { useKeyboard } from '@/hooks/useKeyboard';
import { ProbeOverlay } from './ProbeOverlay';
import { ToothSelector } from './ToothSelector';
import type { Species, AgeGroup } from '@/types';

const Scene = dynamic(() => import('@/components/3d/Scene').then((m) => m.Scene), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="mb-4 text-4xl">🦷</div>
        <p className="text-gray-400">Loading 3D scene...</p>
      </div>
    </div>
  ),
});

interface PracticeModeProps {
  species: Species;
  ageGroup: AgeGroup;
  onSpeciesChange: (species: Species) => void;
  onAgeGroupChange: (ageGroup: AgeGroup) => void;
}

export function PracticeMode({ species: speciesProp, ageGroup: ageGroupProp, onSpeciesChange, onAgeGroupChange }: PracticeModeProps) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [highlightedTooth] = useState<number | null>(null);
  const [showProbe, setShowProbe] = useState(true);
  const [probeActive, setProbeActive] = useState(true);
  const [species, setSpecies] = useState<Species>(speciesProp);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(ageGroupProp);

  const { readings, currentProbe } = useProbeStore();
  const setProbePosition = useProbeStore((s) => s.setProbePosition);
  const setProbeDepth = useProbeStore((s) => s.setProbeDepth);
  const setProbeRotation = useProbeStore((s) => s.setProbeRotation);
  const addReading = useProbeStore((s) => s.addReading);
  const probeState = useProbeStore((s) => s.currentProbe);
  const { depth, isInSulcus, currentTooth, currentLocation } = currentProbe;
  const [tasks, setTasks] = useState<{ id: string; description: string; completed: boolean }[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const probeStore = useProbeStore();

  useKeyboard([
    { key: 'w', description: 'Move probe forward', action: () => setProbePosition([probeState.position[0], probeState.position[1], probeState.position[2] + 0.5]) },
    { key: 's', description: 'Move probe back', action: () => setProbePosition([probeState.position[0], probeState.position[1], probeState.position[2] - 0.5]) },
    { key: 'a', description: 'Move probe left', action: () => setProbePosition([probeState.position[0] - 0.5, probeState.position[1], probeState.position[2]]) },
    { key: 'd', description: 'Move probe right', action: () => setProbePosition([probeState.position[0] + 0.5, probeState.position[1], probeState.position[2]]) },
    { key: 'q', description: 'Withdraw probe', action: () => setProbeDepth(Math.max(0, probeState.depth - 0.5)) },
    { key: 'e', description: 'Insert probe', action: () => setProbeDepth(probeState.depth + 0.5) },
    { key: 'r', description: 'Rotate probe right', action: () => setProbeRotation([probeState.rotation[0], probeState.rotation[1] + 0.1, probeState.rotation[2]]) },
    { key: 'f', description: 'Rotate probe left', action: () => setProbeRotation([probeState.rotation[0], probeState.rotation[1] - 0.1, probeState.rotation[2]]) },
    { key: ' ', description: 'Take reading', action: () => {
      if (probeState.isInSulcus && probeState.currentTooth !== null && probeState.currentLocation !== null) {
        addReading({
          id: crypto.randomUUID(),
          toothNumber: probeState.currentTooth,
          sulcusLocation: probeState.currentLocation,
          depthMm: probeState.depth,
          bleedingOnProbing: false,
          timestamp: new Date(),
        });
      }
    } },
  ]);

  useEffect(() => {
    if (tasks.length === 0 && selectedTooth !== null) {
      setTasks([
        { id: 't1', description: `Probing tooth #${selectedTooth} — measure sulcus depth`, completed: false },
      ]);
      setActiveTaskId('t1');
    }
  }, [selectedTooth, tasks.length]);

  useEffect(() => {
    if (isInSulcus && currentTooth !== null && activeTaskId !== null) {
      setTasks((prev) => prev.map((t) => (t.id === activeTaskId ? { ...t, completed: true } : t)));
      setActiveTaskId(null);
    }
  }, [isInSulcus, currentTooth, activeTaskId]);

  const handleToothClick = useCallback((toothNumber: number) => {
    setSelectedTooth((prev) => (prev === toothNumber ? null : toothNumber));
  }, []);

  return (
    <div className="relative flex h-[calc(100vh-3.5rem)]">
      {/* 3D Viewport */}
      <div className="flex-1 bg-gray-900">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-400">Loading...</p>
            </div>
          }
        >
          <Scene
            selectedTooth={selectedTooth}
            highlightedTooth={highlightedTooth}
            onToothClick={handleToothClick}
            showProbe={showProbe}
            probeActive={probeActive}
            species={species}
            ageGroup={ageGroup}
          />
        </Suspense>
      </div>

      {/* Probe overlay */}
      <ProbeOverlay
        depth={depth}
        isInSulcus={isInSulcus}
        currentTooth={currentTooth}
        currentLocation={currentLocation}
        readingsCount={readings.length}
      />

      {/* Controls panel */}
      <div className="flex w-72 flex-col border-l border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-4">
          <h2 className="mb-3 text-lg font-semibold">Practice Mode</h2>
          <ToothSelector
            selectedSpecies={species}
            selectedAgeGroup={ageGroup}
            onSpeciesChange={(s) => { setSpecies(s); onSpeciesChange(s); }}
            onAgeGroupChange={(a) => { setAgeGroup(a); onAgeGroupChange(a); }}
          />
        </div>

        <div className="flex-1 space-y-4 p-4">
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">Probe Controls</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showProbe}
                  onChange={() => setShowProbe(!showProbe)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">Show probe</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={probeActive}
                  onChange={() => setProbeActive(!probeActive)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">Probe active</span>
              </label>
            </div>
          </div>

        {/* Task list */}
        {tasks.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">Current Task</h3>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-2 rounded-lg border p-2 ${
                    task.completed ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300"
                    readOnly
                  />
                  <span className={`text-sm ${task.completed ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                    {task.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected tooth info */}
        {selectedTooth !== null && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="text-xs font-medium text-blue-700">Selected Tooth</div>
            <div className="text-lg font-bold text-blue-900">#{selectedTooth}</div>
          </div>
        )}

          {/* Keyboard shortcuts */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">Keyboard Shortcuts</h3>
            <div className="space-y-1 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Move probe</span>
                <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">WASD</kbd>
              </div>
              <div className="flex justify-between">
                <span>Insert/withdraw</span>
                <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">Q / E</kbd>
              </div>
              <div className="flex justify-between">
                <span>Take reading</span>
                <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">Space</kbd>
              </div>
              <div className="flex justify-between">
                <span>Rotate probe</span>
                <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">R / F</kbd>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-4">
          <div className="text-center text-sm text-gray-500">
            {readings.length} readings taken
          </div>
        </div>
      </div>
    </div>
  );
}
