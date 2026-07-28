'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

interface SulcusProps {
  toothPosition: [number, number, number];
  toothWidth: number;
  depthMm: number;
  hasBleeding: boolean;
  hasInflammation: boolean;
}

export function Sulcus({ toothPosition, toothWidth, depthMm, hasBleeding, hasInflammation }: SulcusProps) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const w = toothWidth * 0.7;
    const h = depthMm * 0.1;
    shape.moveTo(-w, 0);
    shape.lineTo(-w, -h);
    shape.lineTo(w, -h);
    shape.lineTo(w, 0);
    shape.lineTo(-w, 0);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: false });
  }, [toothWidth, depthMm]);

  const baseColor = hasInflammation ? '#ff6b6b' : '#ffb4a2';
  const emissiveColor = hasBleeding ? '#ff0000' : hasInflammation ? '#ff4444' : '#000000';

  return (
    <mesh
      position={[toothPosition[0], toothPosition[1] - 0.3, toothPosition[2]]}
      geometry={geometry}
      receiveShadow
    >
      <meshStandardMaterial
        color={baseColor}
        emissive={emissiveColor}
        emissiveIntensity={hasBleeding ? 0.5 : hasInflammation ? 0.2 : 0}
        roughness={0.8}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}
