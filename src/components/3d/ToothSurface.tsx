'use client';

import { forwardRef, useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ToothSurfaceData {
  number: number;
  name: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  width: number;
}

interface ToothSurfaceProps {
  teeth: ToothSurfaceData[];
}

export const ToothSurface = forwardRef<THREE.Group, ToothSurfaceProps>(({ teeth }, ref) => {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const group = ref && typeof ref !== 'function' ? ref.current : groupRef.current;
    if (!group) return;

    group.clear();

    const geometry = new THREE.SphereGeometry(1, 6, 6);
    const material = new THREE.MeshStandardMaterial({
      color: '#ff6b6b',
      transparent: true,
      opacity: 0.05,
      side: THREE.DoubleSide,
      visible: true,
    });

    teeth.forEach((tooth) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(tooth.position[0], tooth.position[1], tooth.position[2]);
      const s = tooth.width * 0.8;
      mesh.scale.set(s, s * 1.5, s);
      mesh.name = `tooth-${tooth.number}`;
      mesh.userData = { toothNumber: tooth.number, isToothSurface: true };
      group.add(mesh);
    });

    return () => {
      group.clear();
    };
  }, [teeth, ref]);

  return <group ref={ref ?? groupRef} />;
});

ToothSurface.displayName = 'ToothSurface';