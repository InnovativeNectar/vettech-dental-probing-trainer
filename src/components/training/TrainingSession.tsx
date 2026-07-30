'use client';

import { useState, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useProbeStore } from '@/stores';
import { ProbeOverlay } from './ProbeOverlay';
import { TrainingControls } from './TrainingControls';

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

interface TrainingSessionProps {
  moduleId: string;
}

export function TrainingSession({ moduleId }: TrainingSessionProps) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [highlightedTooth] = useState<number | null>(null);
  const [showProbe, setShowProbe] = useState(true);
  const [probeActive, setProbeActive] = useState(true);

  const { readings, addReading, currentProbe } = useProbeStore();
  const { depth, isInSulcus, currentTooth, currentLocation } = currentProbe;

  const handleToothClick = useCallback((toothNumber: number) => {
    setSelectedTooth((prev) => (prev === toothNumber ? null : toothNumber));
  }, []);

  const handleProbeReading = useCallback(() => {
    if (isInSulcus && currentTooth !== null && currentLocation !== null) {
      addReading({
        id: crypto.randomUUID(),
        toothNumber: currentTooth,
        sulcusLocation: currentLocation,
        depthMm: depth,
        bleedingOnProbing: false,
        timestamp: new Date(),
      });

      try {
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'user-001',
            moduleId: moduleId,
            lessonId: null,
            status: 'in_progress',
            score: null,
            timeSpentSeconds: 0,
          }),
        });
      } catch {
        // API unavailable — still record locally
      }
    }
  }, [isInSulcus, currentTooth, currentLocation, depth, addReading, moduleId]);

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

      {/* Controls sidebar */}
      <TrainingControls
        moduleId={moduleId}
        showProbe={showProbe}
        onToggleProbe={() => setShowProbe(!showProbe)}
        probeActive={probeActive}
        onToggleProbeActive={() => setProbeActive(!probeActive)}
        onProbeReading={handleProbeReading}
        readingsCount={readings.length}
      />
    </div>
  );
}
