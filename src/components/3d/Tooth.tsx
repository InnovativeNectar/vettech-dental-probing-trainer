'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ToothProps {
  toothNumber: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  isSelected?: boolean;
  isHighlighted?: boolean;
  onClick?: (toothNumber: number) => void;
}

function createToothGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const w = 0.3;
  const h = 0.5;
  shape.moveTo(-w, 0);
  shape.bezierCurveTo(-w, h * 0.5, -w * 0.6, h, 0, h);
  shape.bezierCurveTo(w * 0.6, h, w, h * 0.5, w, 0);
  shape.bezierCurveTo(w * 0.7, -h * 0.3, -w * 0.7, -h * 0.3, -w, 0);

  const extrudeSettings = { depth: 0.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 };
  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

export function Tooth({ toothNumber, position, rotation = [0, 0, 0], isSelected, isHighlighted, onClick }: ToothProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => createToothGeometry(), []);

  useFrame(() => {
    if (meshRef.current && isHighlighted) {
      meshRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.02);
    }
  });

  const color = isSelected ? '#ff6b6b' : isHighlighted ? '#ffd93d' : '#f0f0f0';

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={position}
      rotation={rotation}
      onClick={(e) => { e.stopPropagation(); onClick?.(toothNumber); }}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
    </mesh>
  );
}
