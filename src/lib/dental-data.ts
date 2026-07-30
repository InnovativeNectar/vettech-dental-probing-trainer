import type { Species, AgeGroup } from '@/types';
import type { ToothClass } from '@/components/3d/Tooth';

export const MODIFIED_TRIADAN_NUMBERS: Record<Species, Record<AgeGroup, number[]>> = {
  canine: {
    adult: [
      101, 102, 103, 104, 105, 106, 107, 108,
      201, 202, 203, 204, 205, 206, 207, 208,
      301, 302, 303, 304, 305, 306, 307, 308, 309,
      401, 402, 403, 404, 405, 406, 407, 408, 409,
    ],
    juvenile: [
      501, 502, 503, 504, 505, 601, 602, 603, 604, 605,
      701, 702, 703, 704, 705, 801, 802, 803, 804, 805,
    ],
  },
  feline: {
    adult: [
      101, 102, 103, 104, 105, 106, 107,
      201, 202, 203, 204, 205, 206, 207,
      301, 302, 303, 304, 305, 306, 307,
      401, 402, 403, 404, 405, 406, 407,
    ],
    juvenile: [
      501, 502, 503, 504, 505, 601, 602, 603, 604, 605,
      701, 702, 703, 704, 705, 801, 802, 803, 804, 805,
    ],
  },
};

export const TOOTH_NAMES: Record<number, string> = {
  101: 'Right Upper Central Incisor', 102: 'Right Upper Intermediate Incisor',
  103: 'Right Upper Lateral Incisor', 104: 'Right Upper Canine',
  105: 'Right Upper First Premolar', 106: 'Right Upper Second Premolar',
  107: 'Right Upper Third Premolar', 108: 'Right Upper Fourth Premolar',
  109: 'Right Upper First Molar', 110: 'Right Upper Second Molar',
  111: 'Right Upper Third Molar',
  201: 'Left Upper Central Incisor', 202: 'Left Upper Intermediate Incisor',
  203: 'Left Upper Lateral Incisor', 204: 'Left Upper Canine',
  205: 'Left Upper First Premolar', 206: 'Left Upper Second Premolar',
  207: 'Left Upper Third Premolar', 208: 'Left Upper Fourth Premolar',
  209: 'Left Upper First Molar', 210: 'Left Upper Second Molar',
  211: 'Left Upper Third Molar',
  301: 'Left Lower Central Incisor', 302: 'Left Lower Intermediate Incisor',
  303: 'Left Lower Lateral Incisor', 304: 'Left Lower Canine',
  305: 'Left Lower First Premolar', 306: 'Left Lower Second Premolar',
  307: 'Left Lower Third Premolar', 308: 'Left Lower Fourth Premolar',
  309: 'Left Lower Fifth Premolar', 310: 'Left Lower First Molar',
  311: 'Left Lower Second Molar', 312: 'Left Lower Third Molar',
  401: 'Right Lower Central Incisor', 402: 'Right Lower Intermediate Incisor',
  403: 'Right Lower Lateral Incisor', 404: 'Right Lower Canine',
  405: 'Right Lower First Premolar', 406: 'Right Lower Second Premolar',
  407: 'Right Lower Third Premolar', 408: 'Right Lower Fourth Premolar',
  409: 'Right Lower Fifth Premolar', 410: 'Right Lower First Molar',
  411: 'Right Lower Second Molar', 412: 'Right Lower Third Molar',
};

export function getToothName(number: number): string {
  return TOOTH_NAMES[number] ?? `Tooth ${number}`;
}

export function getToothClass(triadan: number): ToothClass {
  const n = triadan % 100;
  if (n <= 3) return 'incisor';
  if (n === 4) return 'canine';
  if (n <= 8) return 'premolar';
  return 'molar';
}

export interface ToothData {
  number: number;
  name: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  toothClass: ToothClass;
  width: number;
  height: number;
  isUpper: boolean;
}

interface ArchConfig {
  width: number;
  depth: number;
  incisorSpan: number;
  canineSpread: number;
  arcCurve: number;
}

const DOG_ARCH: ArchConfig = {
  width: 3.2,
  depth: 2.8,
  incisorSpan: 1.0,
  canineSpread: 1.5,
  arcCurve: 0.85,
};

const CAT_ARCH: ArchConfig = {
  width: 2.0,
  depth: 2.0,
  incisorSpan: 0.6,
  canineSpread: 1.0,
  arcCurve: 1.1,
};

interface QuadrantSpec {
  numbers: number[];
  sign: number;
}

function makeQuadrantSpecs(rightSide: number[], leftSide: number[]): [QuadrantSpec, QuadrantSpec] {
  return [
    { numbers: rightSide, sign: -1 },
    { numbers: leftSide, sign: 1 },
  ];
}

function archX(t: number, arch: ArchConfig, sign: number): number {
  if (t < 0.2) {
    const u = t / 0.2;
    return sign * u * arch.incisorSpan * 0.5;
  }
  const u = (t - 0.2) / 0.8;
  const spread = arch.incisorSpan * 0.5 + (arch.width - arch.incisorSpan * 0.5) * (1 - Math.cos(u * Math.PI * 0.5 / arch.arcCurve));
  return sign * spread;
}

function archZ(t: number, arch: ArchConfig): number {
  if (t < 0.15) {
    const u = t / 0.15;
    return arch.depth * (1 - u * 0.15);
  }
  const u = (t - 0.15) / 0.85;
  return arch.depth * (0.85 - u * 0.85);
}

interface ToothSpec {
  index: number;
  number: number;
  toothClass: ToothClass;
  w: number;
  h: number;
}

const DOG_UPPER_SPECS: ToothSpec[] = [
  { index: 0, number: 101, toothClass: 'incisor', w: 0.22, h: 0.38 },
  { index: 1, number: 102, toothClass: 'incisor', w: 0.22, h: 0.40 },
  { index: 2, number: 103, toothClass: 'incisor', w: 0.24, h: 0.42 },
  { index: 3, number: 104, toothClass: 'canine', w: 0.38, h: 0.70 },
  { index: 4, number: 105, toothClass: 'premolar', w: 0.24, h: 0.42 },
  { index: 5, number: 106, toothClass: 'premolar', w: 0.30, h: 0.48 },
  { index: 6, number: 107, toothClass: 'premolar', w: 0.34, h: 0.52 },
  { index: 7, number: 108, toothClass: 'premolar', w: 0.42, h: 0.55 },
];

const DOG_LOWER_SPECS: ToothSpec[] = [
  { index: 0, number: 401, toothClass: 'incisor', w: 0.20, h: 0.35 },
  { index: 1, number: 402, toothClass: 'incisor', w: 0.20, h: 0.38 },
  { index: 2, number: 403, toothClass: 'incisor', w: 0.22, h: 0.40 },
  { index: 3, number: 404, toothClass: 'canine', w: 0.35, h: 0.65 },
  { index: 4, number: 405, toothClass: 'premolar', w: 0.22, h: 0.38 },
  { index: 5, number: 406, toothClass: 'premolar', w: 0.26, h: 0.42 },
  { index: 6, number: 407, toothClass: 'premolar', w: 0.30, h: 0.46 },
  { index: 7, number: 408, toothClass: 'premolar', w: 0.34, h: 0.48 },
  { index: 8, number: 409, toothClass: 'molar', w: 0.38, h: 0.45 },
];

const DOG_LEFT_SPECS: ToothSpec[] = [
  { index: 0, number: 201, toothClass: 'incisor', w: 0.22, h: 0.38 },
  { index: 1, number: 202, toothClass: 'incisor', w: 0.22, h: 0.40 },
  { index: 2, number: 203, toothClass: 'incisor', w: 0.24, h: 0.42 },
  { index: 3, number: 204, toothClass: 'canine', w: 0.38, h: 0.70 },
  { index: 4, number: 205, toothClass: 'premolar', w: 0.24, h: 0.42 },
  { index: 5, number: 206, toothClass: 'premolar', w: 0.30, h: 0.48 },
  { index: 6, number: 207, toothClass: 'premolar', w: 0.34, h: 0.52 },
  { index: 7, number: 208, toothClass: 'premolar', w: 0.42, h: 0.55 },
];

const DOG_LOWER_LEFT_SPECS: ToothSpec[] = [
  { index: 0, number: 301, toothClass: 'incisor', w: 0.20, h: 0.35 },
  { index: 1, number: 302, toothClass: 'incisor', w: 0.20, h: 0.38 },
  { index: 2, number: 303, toothClass: 'incisor', w: 0.22, h: 0.40 },
  { index: 3, number: 304, toothClass: 'canine', w: 0.35, h: 0.65 },
  { index: 4, number: 305, toothClass: 'premolar', w: 0.22, h: 0.38 },
  { index: 5, number: 306, toothClass: 'premolar', w: 0.26, h: 0.42 },
  { index: 6, number: 307, toothClass: 'premolar', w: 0.30, h: 0.46 },
  { index: 7, number: 308, toothClass: 'premolar', w: 0.34, h: 0.48 },
  { index: 8, number: 309, toothClass: 'molar', w: 0.38, h: 0.45 },
];

const CAT_UPPER_SPECS: ToothSpec[] = [
  { index: 0, number: 101, toothClass: 'incisor', w: 0.14, h: 0.30 },
  { index: 1, number: 102, toothClass: 'incisor', w: 0.14, h: 0.32 },
  { index: 2, number: 103, toothClass: 'incisor', w: 0.16, h: 0.34 },
  { index: 3, number: 104, toothClass: 'canine', w: 0.28, h: 0.65 },
  { index: 4, number: 105, toothClass: 'premolar', w: 0.15, h: 0.32 },
  { index: 5, number: 106, toothClass: 'premolar', w: 0.18, h: 0.35 },
  { index: 6, number: 107, toothClass: 'premolar', w: 0.24, h: 0.40 },
];

const CAT_LOWER_SPECS: ToothSpec[] = [
  { index: 0, number: 401, toothClass: 'incisor', w: 0.12, h: 0.28 },
  { index: 1, number: 402, toothClass: 'incisor', w: 0.12, h: 0.30 },
  { index: 2, number: 403, toothClass: 'incisor', w: 0.14, h: 0.32 },
  { index: 3, number: 404, toothClass: 'canine', w: 0.26, h: 0.60 },
  { index: 4, number: 405, toothClass: 'premolar', w: 0.14, h: 0.30 },
  { index: 5, number: 406, toothClass: 'premolar', w: 0.16, h: 0.33 },
  { index: 6, number: 407, toothClass: 'premolar', w: 0.20, h: 0.36 },
];

const CAT_LEFT_SPECS: ToothSpec[] = [
  { index: 0, number: 201, toothClass: 'incisor', w: 0.14, h: 0.30 },
  { index: 1, number: 202, toothClass: 'incisor', w: 0.14, h: 0.32 },
  { index: 2, number: 203, toothClass: 'incisor', w: 0.16, h: 0.34 },
  { index: 3, number: 204, toothClass: 'canine', w: 0.28, h: 0.65 },
  { index: 4, number: 205, toothClass: 'premolar', w: 0.15, h: 0.32 },
  { index: 5, number: 206, toothClass: 'premolar', w: 0.18, h: 0.35 },
  { index: 6, number: 207, toothClass: 'premolar', w: 0.24, h: 0.40 },
];

const CAT_LOWER_LEFT_SPECS: ToothSpec[] = [
  { index: 0, number: 301, toothClass: 'incisor', w: 0.12, h: 0.28 },
  { index: 1, number: 302, toothClass: 'incisor', w: 0.12, h: 0.30 },
  { index: 2, number: 303, toothClass: 'incisor', w: 0.14, h: 0.32 },
  { index: 3, number: 304, toothClass: 'canine', w: 0.26, h: 0.60 },
  { index: 4, number: 305, toothClass: 'premolar', w: 0.14, h: 0.30 },
  { index: 5, number: 306, toothClass: 'premolar', w: 0.16, h: 0.33 },
  { index: 6, number: 307, toothClass: 'premolar', w: 0.20, h: 0.36 },
];

function getQuadrantSpecs(species: Species, quadrant: 'upperRight' | 'upperLeft' | 'lowerRight' | 'lowerLeft'): ToothSpec[] {
  if (species === 'feline') {
    switch (quadrant) {
      case 'upperRight': return CAT_UPPER_SPECS;
      case 'upperLeft': return CAT_LEFT_SPECS;
      case 'lowerRight': return CAT_LOWER_SPECS;
      case 'lowerLeft': return CAT_LOWER_LEFT_SPECS;
    }
  }
  switch (quadrant) {
    case 'upperRight': return DOG_UPPER_SPECS;
    case 'upperLeft': return DOG_LEFT_SPECS;
    case 'lowerRight': return DOG_LOWER_SPECS;
    case 'lowerLeft': return DOG_LOWER_LEFT_SPECS;
  }
}

function getArchConfig(species: Species): ArchConfig {
  return species === 'feline' ? CAT_ARCH : DOG_ARCH;
}

function generateToothPosition(
  spec: ToothSpec,
  count: number,
  arch: ArchConfig,
  sign: number,
  upper: boolean,
): [number, number, number] {
  const t = count > 1 ? spec.index / (count - 1) : 0.5;
  const x = archX(t, arch, sign);
  const z = archZ(t, arch);
  const y = upper ? 0.6 : -0.6;
  return [x, y, z];
}

function generateToothRotation(
  spec: ToothSpec,
  count: number,
  arch: ArchConfig,
  sign: number,
  upper: boolean,
): [number, number, number] {
  const baseLeanY = upper ? -Math.PI / 2 : -Math.PI / 2;
  const t = count > 1 ? spec.index / (count - 1) : 0.5;
  let angle: number;
  if (t < 0.2) {
    angle = sign * t * 0.5;
  } else {
    const u = (t - 0.2) / 0.8;
    angle = sign * (0.1 + u * (Math.PI * 0.5 / arch.arcCurve - 0.1));
  }
  return [baseLeanY, angle, 0];
}

function generateArchTeeth(
  specs: ToothSpec[],
  arch: ArchConfig,
  sign: number,
  upper: boolean,
): ToothData[] {
  const count = specs.length;
  return specs.map((spec) => {
    const position = generateToothPosition(spec, count, arch, sign, upper);
    const rotation = generateToothRotation(spec, count, arch, sign, upper);
    return {
      number: spec.number,
      name: getToothName(spec.number),
      toothClass: spec.toothClass,
      position,
      rotation,
      width: spec.w,
      height: spec.h,
      isUpper: upper,
    };
  });
}

export function getTeethForSpecies(species: Species, ageGroup: AgeGroup, jaw?: 'upper' | 'lower'): ToothData[] {
  const arch = getArchConfig(species);
  const juvenile = ageGroup === 'juvenile';

  const remapSpec = (spec: ToothSpec, quadrant: 'upperRight' | 'upperLeft' | 'lowerRight' | 'lowerLeft'): ToothSpec => {
    if (!juvenile) return spec;
    const triadanNumbers = MODIFIED_TRIADAN_NUMBERS[species][ageGroup];
    const order = [ 'upperRight', 'upperLeft', 'lowerLeft', 'lowerRight' ].indexOf(quadrant);
    const offset = order * 5;
    return { ...spec, number: 500 + offset + spec.index + 1 };
  };

  const buildQuadrant = (quadrant: 'upperRight' | 'upperLeft' | 'lowerRight' | 'lowerLeft', sign: number, upper: boolean): ToothData[] => {
    const specs = getQuadrantSpecs(species, quadrant).map((s) => remapSpec(s, quadrant));
    return generateArchTeeth(specs, arch, sign, upper);
  };

  if (jaw === 'upper') {
    return [...buildQuadrant('upperRight', -1, true), ...buildQuadrant('upperLeft', 1, true)];
  }

  if (jaw === 'lower') {
    return [...buildQuadrant('lowerRight', -1, false), ...buildQuadrant('lowerLeft', 1, false)];
  }

  return [
    ...buildQuadrant('upperRight', -1, true),
    ...buildQuadrant('upperLeft', 1, true),
    ...buildQuadrant('lowerRight', -1, false),
    ...buildQuadrant('lowerLeft', 1, false),
  ];
}

export const ADULT_DOG_TEETH: ToothData[] = getTeethForSpecies('canine', 'adult', 'upper');
