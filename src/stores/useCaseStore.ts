import { create } from 'zustand';
import type { ClinicalCase, CaseAttempt } from '@/types';

interface CaseState {
  cases: ClinicalCase[];
  currentCase: ClinicalCase | null;
  currentAttempt: CaseAttempt | null;
  selectedSpeciesFilter: 'all' | 'canine' | 'feline';
  selectedDifficultyFilter: 'all' | 'beginner' | 'intermediate' | 'advanced';
  isLoading: boolean;
  setCases: (cases: ClinicalCase[]) => void;
  setCurrentCase: (clinicalCase: ClinicalCase | null) => void;
  setCurrentAttempt: (attempt: CaseAttempt | null) => void;
  setSpeciesFilter: (filter: 'all' | 'canine' | 'feline') => void;
  setDifficultyFilter: (filter: 'all' | 'beginner' | 'intermediate' | 'advanced') => void;
  setLoading: (loading: boolean) => void;
  filteredCases: () => ClinicalCase[];
}

export const useCaseStore = create<CaseState>((set, get) => ({
  cases: [],
  currentCase: null,
  currentAttempt: null,
  selectedSpeciesFilter: 'all',
  selectedDifficultyFilter: 'all',
  isLoading: false,
  setCases: (cases) => set({ cases }),
  setCurrentCase: (currentCase) => set({ currentCase }),
  setCurrentAttempt: (currentAttempt) => set({ currentAttempt }),
  setSpeciesFilter: (selectedSpeciesFilter) => set({ selectedSpeciesFilter }),
  setDifficultyFilter: (selectedDifficultyFilter) => set({ selectedDifficultyFilter }),
  setLoading: (isLoading) => set({ isLoading }),
  filteredCases: () => {
    const { cases, selectedSpeciesFilter, selectedDifficultyFilter } = get();
    return cases.filter((c) => {
      if (selectedSpeciesFilter !== 'all' && c.species !== selectedSpeciesFilter) return false;
      if (selectedDifficultyFilter !== 'all' && c.difficulty !== selectedDifficultyFilter) return false;
      return true;
    });
  },
}));
