import type { ProbeReading, SulcusLocation } from '@/types';

export const PROBE_LENGTH = 20; // mm
export const PROBE_TIP_RADIUS = 0.5; // mm
export const MAX_PROBE_FORCE = 0.25; // Newtons (20-25g)
export const SULCUS_DEPTH_MIN = 0.5; // mm
export const SULCUS_DEPTH_MAX = 12; // mm

export interface CollisionResult {
  hit: boolean;
  point: [number, number, number];
  normal: [number, number, number];
  depth: number;
  toothNumber: number | null;
  sulcusLocation: SulcusLocation | null;
}

export function calculateProbeDepth(
  entryPoint: [number, number, number],
  sulcusNormal: [number, number, number],
  probePosition: [number, number, number]
): number {
  const dx = probePosition[0] - entryPoint[0];
  const dy = probePosition[1] - entryPoint[1];
  const dz = probePosition[2] - entryPoint[2];
  const dot = dx * sulcusNormal[0] + dy * sulcusNormal[1] + dz * sulcusNormal[2];
  return Math.abs(dot);
}

export function classifyProbeDepth(depthMm: number): 'healthy' | 'mild' | 'moderate' | 'severe' {
  if (depthMm <= 2) return 'healthy';
  if (depthMm <= 4) return 'mild';
  if (depthMm <= 6) return 'moderate';
  return 'severe';
}

export function shouldShowBleeding(depthMm: number, hasInflammation: boolean): boolean {
  if (!hasInflammation) return false;
  return depthMm > 3;
}

export function calculateProbeScore(readings: ProbeReading[]): number {
  if (readings.length === 0) return 0;
  const idealLocationsPerTooth = 4;
  const coverageScore = Math.min(readings.length / (12 * idealLocationsPerTooth), 1) * 40;
  const avgDepth = readings.reduce((sum, r) => sum + r.depthMm, 0) / readings.length;
  const depthAccuracy = avgDepth > 0 && avgDepth <= 8 ? 30 : 15;
  const consistencyScore = 30 - Math.min(readings.reduce((sum, r) => sum + Math.abs(r.depthMm - avgDepth), 0) / readings.length * 5, 30);
  return Math.round(coverageScore + depthAccuracy + Math.max(consistencyScore, 0));
}
