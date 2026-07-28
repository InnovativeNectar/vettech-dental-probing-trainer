import { create } from 'zustand';
import type { ProbeReading, ProbeState, SulcusLocation } from '@/types';

interface ProbeStoreState {
  readings: ProbeReading[];
  currentProbe: ProbeState;
  isProbeActive: boolean;
  probeTrail: [number, number, number][];
  maxDepthReached: number;
  totalProbingTime: number;
  setProbePosition: (position: [number, number, number]) => void;
  setProbeRotation: (rotation: [number, number, number]) => void;
  setProbeDepth: (depth: number) => void;
  setInSulcus: (isInSulcus: boolean, toothNumber?: number | null, location?: SulcusLocation | null) => void;
  setProbeForce: (force: number) => void;
  addReading: (reading: ProbeReading) => void;
  clearReadings: () => void;
  addTrailPoint: (point: [number, number, number]) => void;
  clearTrail: () => void;
  resetProbe: () => void;
  setHapticActive: (active: boolean) => void;
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
      currentProbe: { ...state.currentProbe, isInSulcus, currentTooth: toothNumber, currentLocation: location },
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
}));
