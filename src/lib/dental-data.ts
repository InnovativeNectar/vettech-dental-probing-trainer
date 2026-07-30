import type { Species, AgeGroup } from '@/types';

export const MODIFIED_TRIADAN_NUMBERS: Record<Species, Record<AgeGroup, number[]>> = {
  canine: {
    adult: [
      // Upper right (100s)
      101, 102, 103, 104, 105, 106, 107, 108,
      // Upper left (200s)
      201, 202, 203, 204, 205, 206, 207, 208,
      // Lower left (300s)
      301, 302, 303, 304, 305, 306, 307, 308, 309,
      // Lower right (400s)
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

export interface ToothPosition {
  number: number;
  name: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  width: number;
}

function generateArchPositions(rightSide: number[], leftSide: number[], upper: boolean): ToothPosition[] {
  const teeth: ToothPosition[] = [];

  rightSide.forEach((num, i) => {
    const angle = (i / (rightSide.length - 1)) * Math.PI * 0.4 - Math.PI * 0.2;
    const x = Math.sin(angle) * 3;
    const z = Math.cos(angle) * 3 - 1;
    const y = upper ? 0.5 : -0.5;
    teeth.push({
      number: num,
      name: getToothName(num),
      position: [x, y, z],
      rotation: [-Math.PI / 2, angle, 0],
      width: num % 100 >= 4 && num % 100 <= 6 ? 0.35 : 0.2,
    });
  });

  leftSide.forEach((num, i) => {
    const angle = (i / (leftSide.length - 1)) * Math.PI * 0.4 + Math.PI * 0.2;
    const x = Math.sin(angle) * 3;
    const z = Math.cos(angle) * 3 - 1;
    const y = upper ? 0.5 : -0.5;
    teeth.push({
      number: num,
      name: getToothName(num),
      position: [x, y, z],
      rotation: [-Math.PI / 2, angle, 0],
      width: num % 100 >= 4 && num % 100 <= 6 ? 0.35 : 0.2,
    });
  });

  return teeth;
}

export function getTeethForSpecies(species: Species, ageGroup: AgeGroup, jaw?: 'upper' | 'lower'): ToothPosition[] {
  const allNumbers = MODIFIED_TRIADAN_NUMBERS[species]?.[ageGroup] ?? [];
  const upperNumbers = allNumbers.filter((n) => n < 300);
  const lowerNumbers = allNumbers.filter((n) => n >= 300);
  switch (jaw) {
    case 'upper':
      return generateArchPositions(
        upperNumbers.filter((n) => n < 200),
        upperNumbers.filter((n) => n >= 200),
        true
      );
    case 'lower':
      return generateArchPositions(
        lowerNumbers.filter((n) => n >= 400),
        lowerNumbers.filter((n) => n >= 300 && n < 400),
        false
      );
    default:
      return [
        ...generateArchPositions(
          upperNumbers.filter((n) => n < 200),
          upperNumbers.filter((n) => n >= 200),
          true
        ),
        ...generateArchPositions(
          lowerNumbers.filter((n) => n >= 400),
          lowerNumbers.filter((n) => n >= 300 && n < 400),
          false
        ),
      ];
  }
}

export const ADULT_DOG_TEETH: ToothPosition[] = getTeethForSpecies('canine', 'adult', 'upper');
