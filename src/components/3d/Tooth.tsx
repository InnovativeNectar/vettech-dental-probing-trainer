'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type ToothClass = 'incisor' | 'canine' | 'premolar' | 'molar';

interface ToothProps {
  toothNumber: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  toothClass: ToothClass;
  width: number;
  height: number;
  isUpper: boolean;
  isSelected?: boolean;
  isHighlighted?: boolean;
  onClick?: (toothNumber: number) => void;
}

function createIncisorShape(w: number, h: number): THREE.Shape {
  const shape = new THREE.Shape();
  const hw = w / 2;
  shape.moveTo(-hw, 0);
  shape.lineTo(-hw, h * 0.8);
  shape.bezierCurveTo(-hw, h, -hw * 0.6, h * 1.05, 0, h);
  shape.bezierCurveTo(hw * 0.6, h * 1.05, hw, h, hw, h * 0.8);
  shape.lineTo(hw, 0);
  return shape;
}

function createCanineShape(w: number, h: number): THREE.Shape {
  const shape = new THREE.Shape();
  const hw = w / 2;
  shape.moveTo(-hw * 0.7, 0);
  shape.bezierCurveTo(-hw * 0.7, h * 0.4, -hw * 0.3, h * 0.85, 0, h);
  shape.bezierCurveTo(hw * 0.3, h * 0.85, hw * 0.7, h * 0.4, hw * 0.7, 0);
  shape.lineTo(-hw * 0.7, 0);
  return shape;
}

function createPremolarShape(w: number, h: number): THREE.Shape {
  const shape = new THREE.Shape();
  const hw = w / 2;
  const cuspH = h * 0.85;
  const notchH = h * 0.65;
  shape.moveTo(-hw, 0);
  shape.lineTo(-hw, notchH);
  shape.bezierCurveTo(-hw, cuspH, -hw * 0.5, cuspH, -hw * 0.3, cuspH);
  shape.lineTo(-hw * 0.15, notchH);
  shape.bezierCurveTo(-hw * 0.05, cuspH, hw * 0.05, cuspH, hw * 0.15, notchH);
  shape.lineTo(hw * 0.3, cuspH);
  shape.bezierCurveTo(hw * 0.5, cuspH, hw, cuspH, hw, notchH);
  shape.lineTo(hw, 0);
  return shape;
}

function createMolarShape(w: number, h: number): THREE.Shape {
  const shape = new THREE.Shape();
  const hw = w / 2;
  const topH = h * 0.75;
  shape.moveTo(-hw, 0);
  shape.lineTo(-hw, topH);
  shape.bezierCurveTo(-hw, h, -hw * 0.6, h * 1.05, -hw * 0.3, h);
  shape.bezierCurveTo(-hw * 0.1, h * 0.95, 0, h * 0.9, 0, h * 0.95);
  shape.bezierCurveTo(0, h * 0.9, hw * 0.1, h * 0.95, hw * 0.3, h);
  shape.bezierCurveTo(hw * 0.6, h * 1.05, hw, h, hw, topH);
  shape.lineTo(hw, 0);
  return shape;
}

const GEOMETRY_CACHE = new Map<string, THREE.BufferGeometry>();

function getGeometryKey(c: ToothClass, w: number, h: number, depth: number): string {
  return `${c}-${w.toFixed(3)}-${h.toFixed(3)}-${depth.toFixed(3)}`;
}

function createGeometry(tc: ToothClass, w: number, h: number, depth: number): THREE.BufferGeometry {
  const key = getGeometryKey(tc, w, h, depth);
  const cached = GEOMETRY_CACHE.get(key);
  if (cached) return cached;

  let shape: THREE.Shape;
  switch (tc) {
    case 'incisor':
      shape = createIncisorShape(w, h);
      break;
    case 'canine':
      shape = createCanineShape(w, h);
      break;
    case 'premolar':
      shape = createPremolarShape(w, h);
      break;
    case 'molar':
      shape = createMolarShape(w, h);
      break;
  }

  const extrudeSettings = {
    depth,
    bevelEnabled: true,
    bevelThickness: Math.min(depth * 0.15, 0.06),
    bevelSize: Math.min(depth * 0.1, 0.04),
    bevelSegments: 3,
  };

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.computeVertexNormals();
  GEOMETRY_CACHE.set(key, geo);
  return geo;
}

const TOOTH_COLORS: Record<ToothClass, string> = {
  incisor: '#f5f0e8',
  canine: '#f0ebe0',
  premolar: '#ede8dc',
  molar: '#eae5d8',
};

export function Tooth({ toothNumber, position, rotation = [0, 0, 0], toothClass, width, height, isUpper, isSelected, isHighlighted, onClick }: ToothProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const depthRatios: Record<ToothClass, number> = {
    incisor: 0.55,
    canine: 0.65,
    premolar: 0.70,
    molar: 0.80,
  };
  const depth = width * (depthRatios[toothClass] ?? 0.7);
  const geometry = useMemo(() => createGeometry(toothClass, width, height, depth), [toothClass, width, height, depth]);

  useFrame(() => {
    if (meshRef.current && isHighlighted) {
      meshRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.02);
    }
  });

  const defaultColor = TOOTH_COLORS[toothClass];
  const color = isSelected ? '#ff6b6b' : isHighlighted ? '#ffd93d' : defaultColor;

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
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.05} />
    </mesh>
  );
}
