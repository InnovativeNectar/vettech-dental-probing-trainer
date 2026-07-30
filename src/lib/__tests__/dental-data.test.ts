import { describe, it, expect } from 'vitest';
import { getTeethForSpecies, getToothName } from '@/lib/dental-data';
import type { Species, AgeGroup } from '@/types';

describe('dental-data', () => {
  describe('getTeethForSpecies', () => {
    it('returns teeth for canine adult upper jaw', () => {
      const teeth = getTeethForSpecies('canine', 'adult', 'upper');
      expect(teeth.length).toBeGreaterThan(0);
      expect(teeth[0].number).toBe(101);
    });

    it('returns teeth for canine adult lower jaw', () => {
      const teeth = getTeethForSpecies('canine', 'adult', 'lower');
      expect(teeth.length).toBeGreaterThan(0);
      expect(teeth[0].number).toBe(401);
    });

    it('returns both arches when no jaw specified', () => {
      const teeth = getTeethForSpecies('canine', 'adult');
      const upper = teeth.filter((t) => t.position[1] > 0);
      const lower = teeth.filter((t) => t.position[1] < 0);
      expect(upper.length).toBeGreaterThan(0);
      expect(lower.length).toBeGreaterThan(0);
    });

    it('returns feline adult teeth', () => {
      const teeth = getTeethForSpecies('feline', 'adult');
      expect(teeth.length).toBeGreaterThan(0);
    });

    it('returns juvenile teeth with puppy numbers', () => {
      const teeth = getTeethForSpecies('canine', 'juvenile');
      const hasPuppyNumber = teeth.some((t) => t.number >= 500);
      expect(hasPuppyNumber).toBe(true);
    });

    it('throws or returns empty for unknown species', () => {
      const teeth = getTeethForSpecies('canine' as Species, 'adult' as AgeGroup);
      expect(teeth.length).toBeGreaterThan(0);
    });
  });

  describe('getToothName', () => {
    it('returns a name for a known tooth number', () => {
      expect(getToothName(101)).toBe('Right Upper Central Incisor');
    });

    it('returns a fallback for unknown tooth numbers', () => {
      expect(getToothName(999)).toBe('Tooth 999');
    });
  });
});