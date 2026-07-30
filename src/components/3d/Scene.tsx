'use client';

import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { Lighting } from './Lighting';
import { CameraController } from './CameraController';
import { JawArch } from './JawArch';
import { Probe } from './Probe';
import { ToothSurface } from './ToothSurface';
import { Sulcus } from './Sulcus';
import { useProbeStore } from '@/stores';
import { useProbePhysics } from '@/hooks/useProbePhysics';
import { getTeethForSpecies } from '@/lib/dental-data';
import type { Species, AgeGroup } from '@/types';

interface SceneProps {
  selectedTooth: number | null;
  highlightedTooth: number | null;
  onToothClick?: (toothNumber: number) => void;
  showProbe?: boolean;
  probeActive?: boolean;
  species?: Species;
  ageGroup?: AgeGroup;
  jawType?: 'upper' | 'lower';
}

const JAW_Y_OFFSET: Record<string, number> = { upper: 0.5, lower: -0.5 };

function SceneInner({
  selectedTooth,
  highlightedTooth,
  onToothClick,
  showProbe = true,
  probeActive = true,
  species = 'canine',
  ageGroup = 'adult',
  jawType = 'upper',
}: SceneProps) {
  const { currentProbe, maxDepthReached, setProbeDepth, setInSulcus, siteReadings } = useProbeStore();
  const { position, rotation, depth, isInSulcus, currentTooth } = currentProbe;
  const teeth = getTeethForSpecies(species, ageGroup);
  const yOffset = JAW_Y_OFFSET[jawType] ?? 0.5;

  const surfaceRef = useRef<THREE.Group>(null);

  useProbePhysics({
    enabled: probeActive,
    surfaceRef,
    species,
    ageGroup,
    onSulcusEnter: (toothNumber) => {
      setInSulcus(true, toothNumber, null);
    },
    onSulcusExit: () => {
      setInSulcus(false, null, null);
    },
    onDepthChange: (newDepth) => {
      setProbeDepth(newDepth);
    },
  });

  return (
    <>
      <Lighting />
      <CameraController
        focusPoint={selectedTooth ? [0, 0, 0] : undefined}
        probeActive={probeActive}
      />
      <group position={[0, yOffset, 0]}>
        <JawArch
          teeth={teeth}
          selectedTooth={selectedTooth}
          highlightedTooth={highlightedTooth}
          onToothClick={onToothClick}
          jawType={jawType}
        />
        <ToothSurface ref={surfaceRef} teeth={teeth} />
      </group>
      {teeth.map((tooth) => {
        const readings = siteReadings[`${tooth.number}-${currentProbe.currentLocation}`];
        const hasBleeding = readings?.some((r) => r.depth > 4) ?? false;
        const hasInflammation = readings?.some((r) => r.depth > 3) ?? false;
        const siteDepth = readings?.[readings.length - 1]?.depth ?? 0;
        const isCurrent = currentTooth === tooth.number && isInSulcus;
        return (
          <Sulcus
            key={tooth.number}
            toothPosition={[tooth.position[0], tooth.position[1] + yOffset, tooth.position[2]]}
            toothWidth={tooth.width}
            depthMm={isCurrent ? Math.max(depth, siteDepth) : siteDepth}
            hasBleeding={hasBleeding}
            hasInflammation={hasInflammation}
          />
        );
      })}
      {showProbe && (
        <Probe
          position={position}
          rotation={rotation}
          depth={depth}
          maxDepth={Math.max(maxDepthReached, 12)}
          isActive={isInSulcus}
          showForceFeedback={true}
        />
      )}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
    </>
  );
}

export function Scene(props: SceneProps) {
  return (
    <Canvas
      shadows
      gl={{ antialias: true }}
      camera={{ position: [0, 8, 12], fov: 45, near: 0.1, far: 1000 }}
      style={{ width: '100%', height: '100%' }}
    >
      <SceneInner {...props} />
    </Canvas>
  );
}