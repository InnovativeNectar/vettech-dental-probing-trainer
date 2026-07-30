import { getTeethForSpecies, type ToothData } from './dental-data';
import type { Species, AgeGroup } from '@/types';

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

export interface SitePosition {
  site: ProbingSite;
  offset: [number, number, number];
  normal: [number, number, number];
}

function getSiteOffsets(
  tooth: ToothData,
  toothWidth: number,
): SitePosition[] {
  const quadrant = Math.floor(tooth.number / 100);
  const isUpper = tooth.number < 300;
  const isRight = (isUpper && quadrant === 1) || (!isUpper && quadrant === 4);
  const toothType = tooth.toothClass;

  const w = toothWidth * 0.5;

  const mesialSign = isRight ? -1 : 1;
  const distalSign = isRight ? 1 : -1;
  const buccalSign = 1;
  const lingualSign = -1;

  switch (toothType) {
    case 'canine': {
      return [
        { site: 'mesiobuccal' as ProbingSite, offset: [mesialSign * w * 0.6, 0, buccalSign * w], normal: [mesialSign * 0.3, 0, buccalSign * 0.95] },
        { site: 'midbuccal' as ProbingSite, offset: [0, 0, buccalSign * w * 1.1], normal: [0, 0, buccalSign] },
        { site: 'distobuccal' as ProbingSite, offset: [distalSign * w * 0.6, 0, buccalSign * w], normal: [distalSign * 0.3, 0, buccalSign * 0.95] },
        { site: 'mesiolingual' as ProbingSite, offset: [mesialSign * w * 0.6, 0, lingualSign * w], normal: [mesialSign * 0.3, 0, lingualSign * 0.95] },
        { site: 'midlingual' as ProbingSite, offset: [0, 0, lingualSign * w * 1.1], normal: [0, 0, lingualSign] },
        { site: 'distolingual' as ProbingSite, offset: [distalSign * w * 0.6, 0, lingualSign * w], normal: [distalSign * 0.3, 0, lingualSign * 0.95] },
      ];
    }
    case 'incisor': {
      const iw = w * 0.8;
      return [
        { site: 'mesiobuccal' as ProbingSite, offset: [mesialSign * iw * 0.5, 0, buccalSign * iw * 0.8], normal: [mesialSign * 0.2, 0, buccalSign * 0.98] },
        { site: 'midbuccal' as ProbingSite, offset: [0, 0, buccalSign * iw], normal: [0, 0, buccalSign] },
        { site: 'distobuccal' as ProbingSite, offset: [distalSign * iw * 0.5, 0, buccalSign * iw * 0.8], normal: [distalSign * 0.2, 0, buccalSign * 0.98] },
        { site: 'mesiolingual' as ProbingSite, offset: [mesialSign * iw * 0.5, 0, lingualSign * iw * 0.8], normal: [mesialSign * 0.2, 0, lingualSign * 0.98] },
        { site: 'midlingual' as ProbingSite, offset: [0, 0, lingualSign * iw], normal: [0, 0, lingualSign] },
        { site: 'distolingual' as ProbingSite, offset: [distalSign * iw * 0.5, 0, lingualSign * iw * 0.8], normal: [distalSign * 0.2, 0, lingualSign * 0.98] },
      ];
    }
    case 'premolar':
    case 'molar': {
      return [
        { site: 'mesiobuccal' as ProbingSite, offset: [mesialSign * w * 0.7, 0, buccalSign * w], normal: [mesialSign * 0.4, 0, buccalSign * 0.92] },
        { site: 'midbuccal' as ProbingSite, offset: [0, 0, buccalSign * w * 1.2], normal: [0, 0, buccalSign] },
        { site: 'distobuccal' as ProbingSite, offset: [distalSign * w * 0.7, 0, buccalSign * w], normal: [distalSign * 0.4, 0, buccalSign * 0.92] },
        { site: 'mesiolingual' as ProbingSite, offset: [mesialSign * w * 0.7, 0, lingualSign * w], normal: [mesialSign * 0.4, 0, lingualSign * 0.92] },
        { site: 'midlingual' as ProbingSite, offset: [0, 0, lingualSign * w * 1.2], normal: [0, 0, lingualSign] },
        { site: 'distolingual' as ProbingSite, offset: [distalSign * w * 0.7, 0, lingualSign * w], normal: [distalSign * 0.4, 0, lingualSign * 0.92] },
      ];
    }
  }
}

export interface SiteWorldPosition {
  site: ProbingSite;
  position: [number, number, number];
  normal: [number, number, number];
  toothNumber: number;
}

export function getSitesForTooth(
  tooth: ToothData,
): SiteWorldPosition[] {
  const offsets = getSiteOffsets(tooth, tooth.width);
  const ry = tooth.rotation?.[1] ?? 0;

  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);

  return offsets.map(({ site, offset, normal }) => {
    const rotatedOffset: [number, number, number] = [
      offset[0] * cosY - offset[2] * sinY,
      offset[1],
      offset[0] * sinY + offset[2] * cosY,
    ];
    const rotatedNormal: [number, number, number] = [
      normal[0] * cosY - normal[2] * sinY,
      normal[1],
      normal[0] * sinY + normal[2] * cosY,
    ];
    return {
      site,
      position: [
        tooth.position[0] + rotatedOffset[0],
        tooth.position[1] + rotatedOffset[1],
        tooth.position[2] + rotatedOffset[2],
      ],
      normal: rotatedNormal,
      toothNumber: tooth.number,
    };
  });
}

export function getAllSites(
  species: Species,
  ageGroup: AgeGroup,
): SiteWorldPosition[] {
  const teeth = getTeethForSpecies(species, ageGroup);
  return teeth.flatMap(getSitesForTooth);
}

export function findClosestSite(
  probePosition: [number, number, number],
  toothNumber: number,
  teeth: ToothData[],
): SiteWorldPosition | null {
  const tooth = teeth.find((t) => t.number === toothNumber);
  if (!tooth) return null;

  const sites = getSitesForTooth(tooth);
  let closest: SiteWorldPosition | null = null;
  let minDist = Infinity;

  for (const site of sites) {
    const dx = probePosition[0] - site.position[0];
    const dy = probePosition[1] - site.position[1];
    const dz = probePosition[2] - site.position[2];
    const dist = dx * dx + dy * dy + dz * dz;
    if (dist < minDist) {
      minDist = dist;
      closest = site;
    }
  }

  return closest;
}
