'use client';

import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  focusPoint?: [number, number, number];
  enableProbeControl?: boolean;
}

export function CameraController({ focusPoint, enableProbeControl = false }: CameraControllerProps) {
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (focusPoint && controlsRef.current) {
      const target = new THREE.Vector3(...focusPoint);
      controlsRef.current.target.copy(target);
      controlsRef.current.update();
    }
  }, [focusPoint, camera]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 8, 12]} fov={45} near={0.1} far={1000} />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.1}
        minDistance={3}
        maxDistance={50}
        enablePan={!enableProbeControl}
        enableRotate={!enableProbeControl}
        maxPolarAngle={Math.PI * 0.85}
      />
    </>
  );
}
