'use client';

import { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useProbeStore } from '@/stores/useProbeStore';
import { computeProbeForce, DEFAULT_PROBE_PHYSICS, type ProbePhysicsConfig } from '@/lib/physics/probePhysics';
import { findClosestSite } from '@/lib/sulcus-mapping';
import { getTeethForSpecies } from '@/lib/dental-data';
import type { Species, AgeGroup, ProbingSite } from '@/types';

interface UseProbePhysicsOptions {
  physicsConfig?: Partial<ProbePhysicsConfig>;
  enabled?: boolean;
  surfaceRef?: React.MutableRefObject<THREE.Object3D | null>;
  onSulcusEnter?: (toothNumber: number) => void;
  onSulcusExit?: () => void;
  onDepthChange?: (depth: number) => void;
  onSiteChange?: (site: ProbingSite | null) => void;
  species?: Species;
  ageGroup?: AgeGroup;
}

interface SnapResult {
  point: [number, number, number];
  normal: [number, number, number];
  distance: number;
  face: THREE.Intersection['face'];
  object: THREE.Object3D;
}

export function useProbePhysics({
  physicsConfig,
  enabled = true,
  surfaceRef,
  onSulcusEnter,
  onSulcusExit,
  onDepthChange,
  onSiteChange,
  species = 'canine',
  ageGroup = 'adult',
}: UseProbePhysicsOptions) {
  const raycaster = useRef(new THREE.Raycaster());
  const lastSulcusState = useRef(false);
  const lastDepth = useRef(0);
  const lastSite = useRef<ProbingSite | null>(null);

  const config = { ...DEFAULT_PROBE_PHYSICS, ...physicsConfig };

  const {
    currentProbe,
    setProbePosition,
    setProbeRotation,
    setProbeDepth,
    setInSulcus,
    setResistanceForce,
    setSurfaceNormal,
    setCurrentSite,
    setAngleValidation,
    recordSiteReading,
    maxDepthReached,
  } = useProbeStore();

  const snapToSurface = useCallback(
    (camera: THREE.Camera, pointer: THREE.Vector2): SnapResult | null => {
      if (!surfaceRef?.current) return null;

      raycaster.current.setFromCamera(pointer, camera);
      const intersects = raycaster.current.intersectObject(surfaceRef.current, true);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const p = hit.point.toArray();
        const n = hit.face?.normal
          ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld).toArray()
          : [0, 1, 0];
        return {
          point: [p[0], p[1], p[2]],
          normal: [n[0], n[1], n[2]],
          distance: hit.distance,
          face: hit.face,
          object: hit.object,
        };
      }

      return null;
    },
    [surfaceRef],
  );

  useFrame((state, delta) => {
    if (!enabled) return;

    const probe = currentProbe;
    const target = snapToSurface(state.camera, state.pointer);

    if (target) {
      const { point, normal } = target;
      const {
        targetPosition,
        targetRotation,
        resistanceForce,
        isAtSurface,
        angleValidation,
      } = computeProbeForce(
        probe.position,
        probe.rotation,
        point,
        normal,
        probe.depth,
        Math.max(maxDepthReached, 12),
        config,
        delta,
      );

      const effectiveResistance = resistanceForce * angleValidation.penaltyFactor;
      const insertionSpeed = Math.max(0, 1 - effectiveResistance * delta * 0.3);
      const targetDepth = Math.max(0, Math.min(12, probe.depth + (isAtSurface ? delta * insertionSpeed * 2 : -delta * 3)));

      setProbePosition(targetPosition);
      setProbeRotation(targetRotation);
      setResistanceForce(effectiveResistance);
      setSurfaceNormal(normal);
      setAngleValidation(angleValidation);

      if (Math.abs(targetDepth - probe.depth) > 0.01) {
        setProbeDepth(targetDepth);
      }

      const toothNumber = getToothNumberFromHit(target.object);
      const isInSulcus = isAtSurface && targetDepth > 0.5;

      if (isInSulcus && !lastSulcusState.current) {
        onSulcusEnter?.(toothNumber);
        setInSulcus(true, toothNumber, null);
      } else if (!isInSulcus && lastSulcusState.current) {
        onSulcusExit?.();
        setInSulcus(false, null, null);
        setCurrentSite(null);
        onSiteChange?.(null);
        lastSite.current = null;
      }

      lastSulcusState.current = isInSulcus;

      if (isInSulcus) {
        const teeth = getTeethForSpecies(species, ageGroup);
        const closestSite = findClosestSite(
          [target.point[0], target.point[1], target.point[2]],
          toothNumber,
          teeth,
        );
        if (closestSite) {
          setInSulcus(true, toothNumber, closestSite.site);
          setCurrentSite(closestSite.site);
          if (closestSite.site !== lastSite.current) {
            onSiteChange?.(closestSite.site);
            lastSite.current = closestSite.site;
          }
          if (targetDepth > 0.5 && angleValidation.isValid) {
            recordSiteReading(toothNumber, closestSite.site, targetDepth);
          }
        }
      }

      if (Math.abs(targetDepth - lastDepth.current) > 0.1) {
        onDepthChange?.(targetDepth);
        lastDepth.current = targetDepth;
      }
    }
  });

  return {
    snapToSurface,
    lastSulcusState,
  };
}

function getToothNumberFromHit(object: THREE.Object3D): number {
  let current: THREE.Object3D | null = object;
  while (current) {
    const name = current.name || '';
    const match = name.match(/tooth-(\d+)/);
    if (match) return parseInt(match[1], 10);
    current = current.parent;
  }
  return 1;
}
