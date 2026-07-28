export type PathologyType =
  | 'periodontal_disease'
  | 'fractured_tooth'
  | 'oral_mass'
  | 'resorptive_lesion'
  | 'gingivitis'
  | 'stomatitis'
  | 'tooth_resorption'
  | 'ankylosis'
  | 'malocclusion';

export type Severity = 'mild' | 'moderate' | 'severe';

import type { Species } from './probe';

export interface ClinicalCase {
  id: string;
  title: string;
  description: string;
  species: Species;
  ageYears: number;
  breed: string;
  presentingComplaint: string;
  pathologyType: PathologyType;
  severity: Severity;
  affectedTeeth: number[];
  images: CaseImage[];
  probeFindings: ProbeFinding[];
  diagnosis: string;
  treatmentPlan: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  tags: string[];
}

export interface CaseImage {
  id: string;
  url: string;
  alt: string;
  type: 'clinical_photo' | 'radiograph' | 'diagram';
}

export interface ProbeFinding {
  toothNumber: number;
  locations: {
    mesial?: number;
    distal?: number;
    buccal?: number;
    lingual?: number;
  };
  bleedingOnProbing: boolean;
  suppuration: boolean;
  mobility: number; // 0-3
  furcation?: number; // 0-3, for multi-rooted teeth
}

export interface CaseAttempt {
  id: string;
  caseId: string;
  userId: string;
  probeReadings: ProbeFinding[];
  diagnosis: string;
  treatmentPlan: string;
  score: number;
  completedAt: Date;
}
