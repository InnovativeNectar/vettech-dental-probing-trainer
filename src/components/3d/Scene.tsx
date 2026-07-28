'use client';

import { Lighting } from './Lighting';
import { CameraController } from './CameraController';
import { JawArch } from './JawArch';
import { Probe } from './Probe';
import { useProbeStore } from '@/stores';
import { ADULT_DOG_TEETH } from '@/lib/dental-data';

interface SceneProps {
  selectedTooth: number | null;
  highlightedTooth: number | null;
  onToothClick?: (toothNumber: number) => void;
  showProbe?: boolean;
  probeActive?: boolean;
}

export function Scene({ selectedTooth, highlightedTooth, onToothClick, showProbe = true, probeActive = true }: SceneProps) {
  const { currentProbe, maxDepthReached } = useProbeStore();
  const { position, rotation, depth, isInSulcus } = currentProbe;

  return (
    <>
      <Lighting />
      <CameraController
        focusPoint={selectedTooth ? [0, 0, 0] : undefined}
        enableProbeControl={probeActive}
      />
      <JawArch
        teeth={ADULT_DOG_TEETH}
        selectedTooth={selectedTooth}
        highlightedTooth={highlightedTooth}
        onToothClick={onToothClick}
        jawType="upper"
      />
      {showProbe && (
        <Probe
          position={position}
          rotation={rotation}
          depth={depth}
          maxDepth={Math.max(maxDepthReached, 12)}
          isActive={isInSulcus}
        />
      )}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
    </>
  );
}
