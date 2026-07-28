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

export interface ProbeReading {
  id: string;
  toothNumber: number;
  sulcusLocation: string; // mesial, distal, buccal, lingual
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
  currentLocation: string | null;
  force: number; // simulated force
  isHapticActive: boolean;
}

export type SulcusLocation = 'mesial' | 'distal' | 'buccal' | 'lingual';

export interface SulcusPoint {
  location: SulcusLocation;
  toothNumber: number;
  depthMm: number;
  normal: [number, number, number]; // surface normal
}
