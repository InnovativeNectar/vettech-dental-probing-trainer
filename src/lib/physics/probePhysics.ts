import type { AngleValidationResult, GingivaConfig } from '@/types';
import { DEFAULT_GINGIVA_CONFIG } from '@/types';

export interface ProbePhysicsConfig {
  springStiffness: number;
  damping: number;
  maxForce: number;
  depthResistance: number;
  sulcusBaseResistance: number;
  tissueElasticity: number;
  snapSpeed: number;
  gingiva: GingivaConfig;
}

export const DEFAULT_PROBE_PHYSICS: ProbePhysicsConfig = {
  springStiffness: 12.0,
  damping: 4.5,
  maxForce: 15.0,
  depthResistance: 8.0,
  sulcusBaseResistance: 3.0,
  tissueElasticity: 0.6,
  snapSpeed: 3.0,
  gingiva: DEFAULT_GINGIVA_CONFIG,
};

export interface ProbeForceResult {
  targetPosition: [number, number, number];
  targetRotation: [number, number, number];
  resistanceForce: number;
  isAtSurface: boolean;
  depthFactor: number;
  angleValidation: AngleValidationResult;
}

function computeEntryAngle(
  approachDir: [number, number, number],
  normal: [number, number, number],
): number {
  const dot =
    approachDir[0] * normal[0] +
    approachDir[1] * normal[1] +
    approachDir[2] * normal[2];
  const magA = Math.sqrt(
    approachDir[0] * approachDir[0] +
    approachDir[1] * approachDir[1] +
    approachDir[2] * approachDir[2],
  );
  const magN = Math.sqrt(
    normal[0] * normal[0] +
    normal[1] * normal[1] +
    normal[2] * normal[2],
  );
  if (magA < 0.0001 || magN < 0.0001) return 0;
  const clampedDot = Math.max(-1, Math.min(1, dot / (magA * magN)));
  return Math.acos(clampedDot);
}

export function validateApproachAngle(
  probePosition: [number, number, number],
  surfacePoint: [number, number, number],
  surfaceNormal: [number, number, number],
  gingiva: GingivaConfig = DEFAULT_GINGIVA_CONFIG,
): AngleValidationResult {
  const approachDir: [number, number, number] = [
    surfacePoint[0] - probePosition[0],
    surfacePoint[1] - probePosition[1],
    surfacePoint[2] - probePosition[2],
  ];

  const entryAngle = computeEntryAngle(approachDir, surfaceNormal);
  const entryAngleDeg = entryAngle * (180 / Math.PI);

  const optimalAngleRad = gingiva.optimalAngleDeg * (Math.PI / 180);
  const toleranceRad = gingiva.angleToleranceDeg * (Math.PI / 180);

  const angleToOptimal = Math.abs(entryAngle - optimalAngleRad);
  const deviation = angleToOptimal / toleranceRad;

  const t = Math.min(1, deviation);
  const angleCost = t * t;
  const penaltyFactor = 1 + gingiva.anglePenalty * angleCost;

  const isValid = deviation <= 1.0;

  return {
    approachAngle: entryAngleDeg,
    isValid,
    deviation,
    penaltyFactor,
  };
}

export function computeGingivaResistance(
  depth: number,
  maxDepth: number,
  angleValidation: AngleValidationResult,
  gingiva: GingivaConfig = DEFAULT_GINGIVA_CONFIG,
): number {
  const d = Math.max(0, Math.min(depth, maxDepth));
  const gingivaResistance =
    gingiva.baseResistance +
    gingiva.pocketResistance * (Math.exp(gingiva.exponentialFactor * d) / Math.exp(gingiva.exponentialFactor * maxDepth));

  return gingivaResistance * angleValidation.penaltyFactor;
}

export function computeProbeForce(
  currentPosition: [number, number, number],
  currentRotation: [number, number, number],
  targetPosition: [number, number, number],
  targetNormal: [number, number, number],
  currentDepth: number,
  maxDepth: number,
  config: ProbePhysicsConfig = DEFAULT_PROBE_PHYSICS,
  delta: number = 1 / 60,
): ProbeForceResult {
  const dx = targetPosition[0] - currentPosition[0];
  const dy = targetPosition[1] - currentPosition[1];
  const dz = targetPosition[2] - currentPosition[2];
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

  const angleValidation = validateApproachAngle(
    currentPosition,
    targetPosition,
    targetNormal,
    config.gingiva,
  );

  const rawDepthFactor = Math.min(currentDepth / Math.max(maxDepth, 0.01), 1);
  const gingivaResistance = computeGingivaResistance(
    currentDepth,
    maxDepth,
    angleValidation,
    config.gingiva,
  );
  const resistanceForce = config.sulcusBaseResistance + rawDepthFactor * config.depthResistance + gingivaResistance;
  const isAtSurface = distance < 0.15;

  const t = Math.min(1, distance > 0.001 ? (config.snapSpeed * delta) / distance : 1);
  const smoothT = t * t * (3 - 2 * t);

  const x = currentPosition[0] + (targetPosition[0] - currentPosition[0]) * smoothT;
  const y = currentPosition[1] + (targetPosition[1] - currentPosition[1]) * smoothT;
  const z = currentPosition[2] + (targetPosition[2] - currentPosition[2]) * smoothT;

  return {
    targetPosition: [x, y, z] as [number, number, number],
    targetRotation: computeRotationFromTarget(targetNormal, currentRotation, config),
    resistanceForce,
    isAtSurface,
    depthFactor: rawDepthFactor,
    angleValidation,
  };
}

function computeRotationFromTarget(
  normal: [number, number, number],
  currentRotation: [number, number, number],
  config: ProbePhysicsConfig,
): [number, number, number] {
  const up: [number, number, number] = [0, 1, 0];
  const crossX = up[1] * normal[2] - up[2] * normal[1];
  const crossY = up[2] * normal[0] - up[0] * normal[2];
  const crossZ = up[0] * normal[1] - up[1] * normal[0];
  const crossMag = Math.sqrt(crossX * crossX + crossY * crossY + crossZ * crossZ);

  if (crossMag < 0.001) {
    return currentRotation;
  }

  const rotationSpeed = config.springStiffness * 0.05;
  const targetRotationZ = (crossX / crossMag) * rotationSpeed;
  const targetRotationX = (crossY / crossMag) * rotationSpeed;

  return [
    currentRotation[0] + (targetRotationX - currentRotation[0]) * 0.1,
    currentRotation[1],
    currentRotation[2] + (targetRotationZ - currentRotation[2]) * 0.1,
  ] as [number, number, number];
}
