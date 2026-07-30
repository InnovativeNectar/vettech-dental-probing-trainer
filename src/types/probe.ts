export type Species = 'canine' | 'feline';
export type AgeGroup = 'adult' | 'juvenile';

export interface SpeciesConfig {
  species: Species;
  ageGroup: AgeGroup;
  totalTeeth: number;
  dentalFormula: DentalFormula;
}

export interface DentalFormula {
  upper: {
    incisors: number;
    canines: number;
    premolars: number;
    molars: number;
  };
  lower: {
    incisors: number;
    canines: number;
    premolars: number;
    molars: number;
  };
}

export type ToothPosition =
  | 'upper_right' | 'upper_left'
  | 'lower_right' | 'lower_left';

export interface Tooth {
  id: string;
  number: number; // Modified Triadan number
  name: string;
  position: ToothPosition;
  species: Species;
  ageGroup: AgeGroup;
  rootCount: number;
  crownLength: number;
  rootLength: number;
  modelUrl?: string; // path to 3D model
}

export type ProbingSite =
  | 'mesiobuccal'
  | 'midbuccal'
  | 'distobuccal'
  | 'mesiolingual'
  | 'midlingual'
  | 'distolingual';

export const PROBING_SITES: ProbingSite[] = [
  'mesiobuccal', 'midbuccal', 'distobuccal',
  'mesiolingual', 'midlingual', 'distolingual',
];

export const SITE_LABELS: Record<ProbingSite, string> = {
  mesiobuccal: 'MB',
  midbuccal: 'B',
  distobuccal: 'DB',
  mesiolingual: 'ML',
  midlingual: 'L',
  distolingual: 'DL',
};

export const SITE_FULL_NAMES: Record<ProbingSite, string> = {
  mesiobuccal: 'Mesiobuccal',
  midbuccal: 'Mid-buccal',
  distobuccal: 'Distobuccal',
  mesiolingual: 'Mesiolingual',
  midlingual: 'Mid-lingual',
  distolingual: 'Distolingual',
};

export interface ProbeReading {
  id: string;
  toothNumber: number;
  sulcusLocation: ProbingSite;
  depthMm: number;
  bleedingOnProbing: boolean;
  timestamp: Date;
}

export interface ProbeState {
  position: [number, number, number];
  rotation: [number, number, number];
  depth: number; // current insertion depth
  isInSulcus: boolean;
  currentTooth: number | null;
  currentLocation: ProbingSite | null;
  force: number; // simulated force
  isHapticActive: boolean;
}

export type SulcusLocation = ProbingSite;

export interface AngleValidationResult {
  approachAngle: number;
  isValid: boolean;
  deviation: number;
  penaltyFactor: number;
}

export interface GingivaConfig {
  baseResistance: number;
  pocketResistance: number;
  exponentialFactor: number;
  maxDepth: number;
  optimalAngleDeg: number;
  angleToleranceDeg: number;
  anglePenalty: number;
}

export const DEFAULT_GINGIVA_CONFIG: GingivaConfig = {
  baseResistance: 0.5,
  pocketResistance: 12.0,
  exponentialFactor: 0.4,
  maxDepth: 12,
  optimalAngleDeg: 52.5,
  angleToleranceDeg: 15,
  anglePenalty: 5.0,
};

export interface SulcusPoint {
  location: ProbingSite;
  toothNumber: number;
  depthMm: number;
  normal: [number, number, number]; // surface normal
}
