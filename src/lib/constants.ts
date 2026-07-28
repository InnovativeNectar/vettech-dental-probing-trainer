export const APP_NAME = 'VetTech Dental Probing Trainer';
export const APP_VERSION = '0.1.0';

// Probe depth thresholds (mm)
export const PROBE_DEPTH_THRESHOLDS = {
  healthy: 2,
  mild: 3,
  moderate: 5,
  severe: 7,
} as const;

// Color mapping for probe depths
export const PROBE_DEPTH_COLORS = {
  healthy: '#22c55e',   // green - 0-2mm
  mild: '#eab308',      // yellow - 3-4mm
  moderate: '#f97316',  // orange - 5-6mm
  severe: '#ef4444',    // red - 7+mm
} as const;

// Species configurations
export const SPECIES_CONFIGS = {
  canine: {
    adult: {
      totalTeeth: 42,
      dentalFormula: {
        upper: { incisors: 6, canines: 2, premolars: 4, molars: 2 },
        lower: { incisors: 6, canines: 2, premolars: 4, molars: 3 },
      },
    },
    juvenile: {
      totalTeeth: 28,
      dentalFormula: {
        upper: { incisors: 6, canines: 2, premolars: 2, molars: 0 },
        lower: { incisors: 6, canines: 2, premolars: 2, molars: 0 },
      },
    },
  },
  feline: {
    adult: {
      totalTeeth: 30,
      dentalFormula: {
        upper: { incisors: 6, canines: 2, premolars: 3, molars: 1 },
        lower: { incisors: 6, canines: 2, premolars: 2, molars: 1 },
      },
    },
    juvenile: {
      totalTeeth: 26,
      dentalFormula: {
        upper: { incisors: 6, canines: 2, premolars: 2, molars: 0 },
        lower: { incisors: 6, canines: 2, premolars: 2, molars: 0 },
      },
    },
  },
} as const;

// Scoring
export const SCORING = {
  maxProbeAccuracy: 100,
  maxDepthAccuracy: 100,
  maxSpeed: 100,
  maxCharting: 100,
  weights: {
    accuracy: 0.4,
    depth: 0.3,
    speed: 0.15,
    charting: 0.15,
  },
} as const;

// Adaptive difficulty thresholds
export const ADAPTIVE_THRESHOLDS = {
  advanceScore: 85,
  demoteScore: 60,
  minAttemptsForAdapt: 3,
} as const;

// Camera
export const CAMERA_DEFAULTS = {
  fov: 50,
  near: 0.1,
  far: 1000,
  position: [0, 5, 10] as const,
  target: [0, 0, 0] as const,
} as const;

// 3D Model paths
export const MODEL_PATHS = {
  canine: {
    adult: '/models/adult-dog/',
    juvenile: '/models/puppy/',
  },
  feline: {
    adult: '/models/adult-cat/',
    juvenile: '/models/kitten/',
  },
} as const;
