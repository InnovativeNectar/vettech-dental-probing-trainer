import { create } from 'zustand';
import type { ProbeReading, ProbeState, ProbingSite } from '@/types';
import type { AngleValidationResult } from '@/types/probe';

interface ProbeStoreState {
  readings: ProbeReading[];
  currentProbe: ProbeState;
  isProbeActive: boolean;
  probeTrail: [number, number, number][];
  maxDepthReached: number;
  totalProbingTime: number;
  physicsEnabled: boolean;
  velocity: [number, number, number];
  targetPosition: [number, number, number] | null;
  resistanceForce: number;
  surfaceNormal: [number, number, number] | null;
  currentSite: ProbingSite | null;
  siteReadings: Record<string, { site: ProbingSite; depth: number; recorded: boolean }[]>;
  angleValidation: AngleValidationResult | null;
  setProbePosition: (position: [number, number, number]) => void;
  setProbeRotation: (rotation: [number, number, number]) => void;
  setProbeDepth: (depth: number) => void;
  setInSulcus: (isInSulcus: boolean, toothNumber?: number | null, location?: ProbingSite | null) => void;
  setProbeForce: (force: number) => void;
  addReading: (reading: ProbeReading) => void;
  clearReadings: () => void;
  addTrailPoint: (point: [number, number, number]) => void;
  clearTrail: () => void;
  resetProbe: () => void;
  setHapticActive: (active: boolean) => void;
  setPhysicsEnabled: (enabled: boolean) => void;
  setVelocity: (velocity: [number, number, number]) => void;
  setTargetPosition: (target: [number, number, number] | null) => void;
  setResistanceForce: (force: number) => void;
  setSurfaceNormal: (normal: [number, number, number] | null) => void;
  setCurrentSite: (site: ProbingSite | null) => void;
  recordSiteReading: (toothNumber: number, site: ProbingSite, depth: number) => void;
  setAngleValidation: (validation: AngleValidationResult | null) => void;
}

const initialProbeState: ProbeState = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  depth: 0,
  isInSulcus: false,
  currentTooth: null,
  currentLocation: null,
  force: 0,
  isHapticActive: false,
};

export const useProbeStore = create<ProbeStoreState>((set) => ({
  readings: [],
  currentProbe: initialProbeState,
  isProbeActive: false,
  probeTrail: [],
  maxDepthReached: 0,
  totalProbingTime: 0,
  physicsEnabled: true,
  velocity: [0, 0, 0],
  targetPosition: null,
  resistanceForce: 0,
  surfaceNormal: null,
  currentSite: null,
  siteReadings: {},
  angleValidation: null,
  setProbePosition: (position) =>
    set((state) => ({ currentProbe: { ...state.currentProbe, position } })),
  setProbeRotation: (rotation) =>
    set((state) => ({ currentProbe: { ...state.currentProbe, rotation } })),
  setProbeDepth: (depth) =>
    set((state) => ({
      currentProbe: { ...state.currentProbe, depth },
      maxDepthReached: Math.max(state.maxDepthReached, depth),
    })),
  setInSulcus: (isInSulcus, toothNumber = null, location = null) =>
    set((state) => ({
      currentProbe: { ...state.currentProbe, isInSulcus, currentTooth: toothNumber, currentLocation: location as ProbingSite | null },
    })),
  setProbeForce: (force) =>
    set((state) => ({ currentProbe: { ...state.currentProbe, force } })),
  addReading: (reading) =>
    set((state) => ({ readings: [...state.readings, reading] })),
  clearReadings: () => set({ readings: [] }),
  addTrailPoint: (point) =>
    set((state) => ({ probeTrail: [...state.probeTrail, point] })),
  clearTrail: () => set({ probeTrail: [] }),
  resetProbe: () => set({ currentProbe: initialProbeState, probeTrail: [], maxDepthReached: 0 }),
  setHapticActive: (isHapticActive) =>
    set((state) => ({ currentProbe: { ...state.currentProbe, isHapticActive } })),
  setPhysicsEnabled: (enabled) => set({ physicsEnabled: enabled }),
  setVelocity: (velocity) => set({ velocity }),
  setTargetPosition: (target) => set({ targetPosition: target }),
  setResistanceForce: (force) => set({ resistanceForce: force }),
  setSurfaceNormal: (normal) => set({ surfaceNormal: normal }),
  setCurrentSite: (site) => set({ currentSite: site }),
  recordSiteReading: (toothNumber, site, depth) =>
    set((state) => {
      const key = `${toothNumber}-${site}`;
      const existing = state.siteReadings[key] ?? [];
      const updated = [...existing, { site, depth, recorded: true }];
      return { siteReadings: { ...state.siteReadings, [key]: updated } };
    }),
  setAngleValidation: (validation) => set({ angleValidation: validation }),
}));
