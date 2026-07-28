'use client';

import { useState, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useProbeStore } from '@/stores';
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

export function PracticeMode({ species, ageGroup, onSpeciesChange, onAgeGroupChange }: PracticeModeProps) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [highlightedTooth] = useState<number | null>(null);
  const [showProbe, setShowProbe] = useState(true);
  const [probeActive, setProbeActive] = useState(true);

  const { readings, currentProbe } = useProbeStore();
  const { depth, isInSulcus, currentTooth, currentLocation } = currentProbe;

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
            onSpeciesChange={onSpeciesChange}
            onAgeGroupChange={onAgeGroupChange}
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
