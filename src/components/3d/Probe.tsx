'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DEFAULT_PROBE_PHYSICS } from '@/lib/physics/probePhysics';

interface ProbeProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  depth: number;
  maxDepth: number;
  isActive: boolean;
  showForceFeedback?: boolean;
}

export function Probe({
  position,
  rotation = [0, 0, 0],
  depth,
  maxDepth,
  isActive,
  showForceFeedback = true,
}: ProbeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tipRef = useRef<THREE.Mesh>(null);
  const shaftRef = useRef<THREE.Mesh>(null);
  const handleRef = useRef<THREE.Mesh>(null);

  const normalizedDepth = Math.min(depth / Math.max(maxDepth, 1), 1);
  const depthColor = normalizedDepth <= 0.25 ? '#4ade80' : normalizedDepth <= 0.5 ? '#fbbf24' : '#ef4444';
  const resistanceForce = DEFAULT_PROBE_PHYSICS.sulcusBaseResistance + normalizedDepth * DEFAULT_PROBE_PHYSICS.depthResistance;

  useFrame(() => {
    if (!groupRef.current) return;

    const tipMat = tipRef.current?.material as THREE.MeshStandardMaterial;
    if (tipMat) {
      tipMat.emissiveIntensity = isActive
        ? 0.3 + Math.sin(Date.now() * 0.003) * 0.2 + resistanceForce * 0.05
        : 0;
      if (resistanceForce > 5) {
        tipMat.emissive.set('#ef4444');
        tipMat.emissiveIntensity = Math.min(1, resistanceForce * 0.1);
      } else if (resistanceForce > 2) {
        tipMat.emissive.set('#fbbf24');
        tipMat.emissiveIntensity = Math.min(1, resistanceForce * 0.05);
      } else {
        tipMat.emissive.set(depthColor);
      }
    }

    const shaftMat = shaftRef.current?.material as THREE.MeshStandardMaterial;
    if (shaftMat && shaftRef.current) {
      const bend = resistanceForce * 0.002;
      shaftRef.current.rotation.z = bend;
    }

    const handleMat = handleRef.current?.material as THREE.MeshStandardMaterial;
    if (handleMat && handleRef.current) {
      const vibration = isActive ? Math.sin(Date.now() * 0.01) * resistanceForce * 0.001 : 0;
      handleRef.current.position.x = vibration;
    }
  });

  const forceRingScale = Math.min(1 + resistanceForce * 0.02, 1.5);

  // Tip is at local origin (0,0,0); handle/shaft extend upward (+Y).
  // The probe group's position therefore represents the TIP world position,
  // which matches probePosition used by physics + recording.
  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <group ref={handleRef}>
        <mesh position={[0, 4, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 3, 16]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.3} />
        </mesh>
      </group>
      <group ref={shaftRef}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 3, 8]} />
          <meshStandardMaterial color="#c0c0c0" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>
      <group ref={tipRef}>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.005, 0.015, 0.5, 8]} />
          <meshStandardMaterial
            color={depthColor}
            emissive={depthColor}
            emissiveIntensity={isActive ? 0.3 : 0}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
      </group>
      {showForceFeedback && (
        <mesh position={[0, -0.25, 0]}>
          <torusGeometry args={[0.04 * forceRingScale, 0.003, 8, 24]} />
          <meshStandardMaterial
            color={depthColor}
            emissive={depthColor}
            emissiveIntensity={isActive ? 0.5 : 0.1}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
      {[1, 2, 3, 4, 5].map((mm) => (
        <mesh key={mm} position={[0.04, 1.5 - mm * 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.005, 0.01, 0.005]} />
          <meshStandardMaterial color={mm <= 3 ? '#4ade80' : mm <= 5 ? '#fbbf24' : '#ef4444'} />
        </mesh>
      ))}
    </group>
  );
}
