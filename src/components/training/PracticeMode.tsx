'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useProbeStore } from '@/stores';
import { useKeyboard } from '@/hooks/useKeyboard';
import { ProbeOverlay } from './ProbeOverlay';
import { ToothSelector } from './ToothSelector';
import { TouchControls } from './TouchControls';
import { SITE_LABELS, PROBING_SITES } from '@/types';
import { getTeethForSpecies } from '@/lib/dental-data';
import type { Species, AgeGroup, ProbingSite } from '@/types';

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

interface SiteMeasurement {
  site: ProbingSite;
  depth: number;
  timestamp: number;
}

interface ToothRecord {
  toothNumber: number;
  measurements: SiteMeasurement[];
  completed: boolean;
}

export function PracticeMode({ species: speciesProp, ageGroup: ageGroupProp, onSpeciesChange, onAgeGroupChange }: PracticeModeProps) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [highlightedTooth] = useState<number | null>(null);
  const [showProbe, setShowProbe] = useState(true);
  const [probeActive, setProbeActive] = useState(true);
  const [species, setSpecies] = useState<Species>(speciesProp);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(ageGroupProp);
  const [toothRecords, setToothRecords] = useState<Record<number, ToothRecord>>({});

  const allReadings = useProbeStore((s) => s.readings);
  const currentProbe = useProbeStore((s) => s.currentProbe);
  const currentSite = useProbeStore((s) => s.currentSite);
  const { isInSulcus } = currentProbe;
  const addReading = useProbeStore((s) => s.addReading);
  const setProbePosition = useProbeStore((s) => s.setProbePosition);
  const setProbeDepth = useProbeStore((s) => s.setProbeDepth);
  const setProbeRotation = useProbeStore((s) => s.setProbeRotation);

  const handleTakeReading = useCallback(() => {
    const state = useProbeStore.getState();
    const probe = state.currentProbe;
    const site = state.currentSite;
    if (probe.isInSulcus && probe.currentTooth !== null && site !== null) {
      const reading = {
        id: crypto.randomUUID(),
        toothNumber: probe.currentTooth,
        sulcusLocation: site,
        depthMm: probe.depth,
        bleedingOnProbing: false,
        timestamp: new Date(),
      };
      addReading(reading);

      setToothRecords((prev) => {
        const tooth = probe.currentTooth!;
        const existing = prev[tooth] ?? { toothNumber: tooth, measurements: [], completed: false };
        const updatedMeasurements = [
          ...existing.measurements.filter((m) => m.site !== site),
          { site, depth: probe.depth, timestamp: Date.now() },
        ];
        const allSitesDone = PROBING_SITES.every((s) =>
          updatedMeasurements.some((m) => m.site === s),
        );
        return {
          ...prev,
          [tooth]: { ...existing, measurements: updatedMeasurements, completed: allSitesDone },
        };
      });
    }
  }, [addReading]);

  useKeyboard([
    { key: 'z', action: () => setProbePosition([currentProbe.position[0], currentProbe.position[1] - 0.5, currentProbe.position[2]]), description: 'Move probe down' },
    { key: 'c', action: () => setProbePosition([currentProbe.position[0], currentProbe.position[1] + 0.5, currentProbe.position[2]]), description: 'Move probe up' },
    { key: 'w', action: () => setProbePosition([currentProbe.position[0], currentProbe.position[1], currentProbe.position[2] + 0.5]), description: 'Move probe forward' },
    { key: 's', action: () => setProbePosition([currentProbe.position[0], currentProbe.position[1], currentProbe.position[2] - 0.5]), description: 'Move probe back' },
    { key: 'a', action: () => setProbePosition([currentProbe.position[0] - 0.5, currentProbe.position[1], currentProbe.position[2]]), description: 'Move probe left' },
    { key: 'd', action: () => setProbePosition([currentProbe.position[0] + 0.5, currentProbe.position[1], currentProbe.position[2]]), description: 'Move probe right' },
    { key: 'q', action: () => setProbeDepth(Math.max(0, currentProbe.depth - 0.2)), description: 'Withdraw probe' },
    { key: 'e', action: () => setProbeDepth(currentProbe.depth + 0.2), description: 'Insert probe' },
    { key: 'r', action: () => setProbeRotation([currentProbe.rotation[0], currentProbe.rotation[1] + 0.1, currentProbe.rotation[2]]), description: 'Rotate probe right' },
    { key: 'f', action: () => setProbeRotation([currentProbe.rotation[0], currentProbe.rotation[1] - 0.1, currentProbe.rotation[2]]), description: 'Rotate probe left' },
    { key: ' ', action: handleTakeReading, description: 'Take reading' },
  ]);

  // Measurement tracking handled via toothRecords in handleTakeReading

  const handleToothClick = useCallback((toothNumber: number) => {
    setSelectedTooth((prev) => (prev === toothNumber ? null : toothNumber));
    const teeth = getTeethForSpecies(species, ageGroup, 'upper');
    const tooth = teeth.find((t) => t.number === toothNumber);
    if (tooth) {
      const [tx, ty, tz] = tooth.position;
      setProbePosition([tx, ty + 0.2, tz + 0.5]);
    }
  }, [species, ageGroup, setProbePosition]);

  const completedSitesForTooth = (toothNumber: number): number => {
    return toothRecords[toothNumber]?.measurements.length ?? 0;
  };

  return (
    <div className="relative flex h-[calc(100vh-3.5rem)]">
      {/* 3D Viewport */}
      <div className="relative flex-1 bg-gray-900">
        <Scene
            selectedTooth={selectedTooth}
            highlightedTooth={highlightedTooth}
            onToothClick={handleToothClick}
            showProbe={showProbe}
            probeActive={probeActive}
            species={species}
            ageGroup={ageGroup}
        />

        <TouchControls onTakeReading={handleTakeReading} />
      </div>

      {/* Probe overlay */}
      <ProbeOverlay />

      {/* Controls panel */}
      <div className="flex w-80 flex-col border-l border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-4">
          <h2 className="mb-3 text-lg font-semibold">Practice Mode</h2>
          <ToothSelector
            selectedSpecies={species}
            selectedAgeGroup={ageGroup}
            onSpeciesChange={(s) => { setSpecies(s); onSpeciesChange(s); }}
            onAgeGroupChange={(a) => { setAgeGroup(a); onAgeGroupChange(a); }}
          />
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {/* Probe Controls */}
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
              <div className="mt-2 text-xs text-gray-500">
                {completedSitesForTooth(selectedTooth)} / 6 sites measured
              </div>

              {/* Site measurement grid */}
              <div className="mt-2 grid grid-cols-3 gap-1">
                {PROBING_SITES.map((site) => {
                  const measurement = toothRecords[selectedTooth]?.measurements.find(
                    (m) => m.site === site,
                  );
                  const isActive = currentSite === site && isInSulcus;
                  return (
                    <div
                      key={site}
                      className={`rounded px-1.5 py-1 text-center text-xs transition-colors ${
                        isActive
                          ? 'bg-blue-200 text-blue-800 font-semibold'
                          : measurement
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      <div>{SITE_LABELS[site]}</div>
                      {measurement && (
                        <div className="text-[10px] font-medium">
                          {measurement.depth.toFixed(1)}mm
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tooth records summary */}
          {Object.keys(toothRecords).length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-700">Measurement Summary</h3>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {Object.entries(toothRecords)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([num, record]) => (
                    <div
                      key={num}
                      className={`flex items-center justify-between rounded-lg border p-2 text-sm ${
                        record.completed ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <span className={`font-medium ${record.completed ? 'text-green-700' : 'text-gray-700'}`}>
                        #{num}
                      </span>
                      <span className={`text-xs ${record.completed ? 'text-green-600' : 'text-gray-500'}`}>
                        {record.measurements.length}/6 sites
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Keyboard shortcuts */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">Keyboard Shortcuts</h3>
            <div className="space-y-1 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Move horizontal</span>
                <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">W A S D</kbd>
              </div>
              <div className="flex justify-between">
                <span>Move vertical</span>
                <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">Z / C</kbd>
              </div>
              <div className="flex justify-between">
                <span>Depth (fine)</span>
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
            {allReadings.length} readings taken
          </div>
        </div>
      </div>
    </div>
  );
}
