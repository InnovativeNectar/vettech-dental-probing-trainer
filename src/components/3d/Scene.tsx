'use client';

import { Canvas } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Lighting } from './Lighting';
import { CameraController } from './CameraController';
import { JawArch } from './JawArch';
import { Probe } from './Probe';
import { ToothSurface } from './ToothSurface';
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
}

function SceneInner({
  selectedTooth,
  highlightedTooth,
  onToothClick,
  showProbe = true,
  probeActive = true,
  species = 'canine',
  ageGroup = 'adult',
}: SceneProps) {
  const { currentProbe, maxDepthReached, setProbeDepth, setInSulcus } = useProbeStore();
  const { position, rotation, depth, isInSulcus } = currentProbe;
  const teeth = getTeethForSpecies(species, ageGroup);

  const surfaceRef = useRef<THREE.Group>(null);

  const { updateRaycast } = useProbePhysics({
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

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      updateRaycast(e);
    };
    if (probeActive) {
      window.addEventListener('pointermove', handlePointerMove);
      return () => window.removeEventListener('pointermove', handlePointerMove);
    }
  }, [probeActive, updateRaycast]);

  return (
    <>
      <Lighting />
      <CameraController
        focusPoint={selectedTooth ? [0, 0, 0] : undefined}
        probeActive={probeActive}
      />
      <JawArch
        teeth={teeth}
        selectedTooth={selectedTooth}
        highlightedTooth={highlightedTooth}
        onToothClick={onToothClick}
        jawType="upper"
      />
      <ToothSurface ref={surfaceRef} teeth={teeth} />
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