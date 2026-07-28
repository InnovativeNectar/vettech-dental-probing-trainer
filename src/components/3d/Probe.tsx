'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProbeProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  depth: number; // 0-12mm normalized
  maxDepth: number;
  isActive: boolean;
}

export function Probe({ position, rotation = [0, 0, 0], depth, maxDepth, isActive }: ProbeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tipRef = useRef<THREE.Mesh>(null);

  const normalizedDepth = Math.min(depth / maxDepth, 1);
  const depthColor = normalizedDepth <= 0.25 ? '#4ade80' : normalizedDepth <= 0.5 ? '#fbbf24' : '#ef4444';

  useFrame(() => {
    if (tipRef.current && isActive) {
      (tipRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3 + Math.sin(Date.now() * 0.003) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Handle */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 3, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Shaft */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 3, 8]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Tip */}
      <mesh ref={tipRef} position={[0, -2, 0]} castShadow>
        <cylinderGeometry args={[0.005, 0.015, 0.5, 8]} />
        <meshStandardMaterial
          color={depthColor}
          emissive={depthColor}
          emissiveIntensity={isActive ? 0.3 : 0}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      {/* Measurement markings */}
      {[1, 2, 3, 4, 5].map((mm) => (
        <mesh key={mm} position={[0.04, -0.5 - mm * 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.005, 0.01, 0.005]} />
          <meshStandardMaterial color={mm <= 3 ? '#4ade80' : mm <= 5 ? '#fbbf24' : '#ef4444'} />
        </mesh>
      ))}
    </group>
  );
}
