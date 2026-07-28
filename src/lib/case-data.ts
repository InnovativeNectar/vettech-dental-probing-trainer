import type { ClinicalCase } from '@/types';

export const CLINICAL_CASES: ClinicalCase[] = [
  {
    id: 'case-001',
    title: "Max's Gingivitis",
    description:
      'A 5-year-old neutered male Labrador Retriever presenting with mild gingivitis affecting the maxillary and mandibular fourth premolars. Early-stage inflammation with localized bleeding on probing but no attachment loss.',
    species: 'canine',
    ageYears: 5,
    breed: 'Labrador Retriever',
    presentingComplaint: 'Owner noticed red, puffy gums and occasional bad breath over the past two weeks.',
    pathologyType: 'gingivitis',
    severity: 'mild',
    affectedTeeth: [204, 304],
    images: [],
    probeFindings: [
      {
        toothNumber: 204,
        locations: { mesial: 2, distal: 3, buccal: 2, lingual: 2 },
        bleedingOnProbing: true,
        suppuration: false,
        mobility: 0,
      },
      {
        toothNumber: 304,
        locations: { mesial: 2, distal: 3, buccal: 3, lingual: 2 },
        bleedingOnProbing: true,
        suppuration: false,
        mobility: 0,
      },
    ],
    diagnosis: 'Mild gingivitis localized to teeth 204 and 304. No attachment loss or bone recession noted.',
    treatmentPlan:
      'Professional dental cleaning with subgingival irrigation. Oral hygiene instruction for owner — daily toothbrushing with enzymatic toothpaste. Re-evaluate in 4 weeks.',
    difficulty: 'beginner',
    estimatedMinutes: 15,
    tags: ['gingivitis', 'early-stage', 'preventive', 'beginner-friendly'],
  },
  {
    id: 'case-002',
    title: "Bella's Periodontal Disease",
    description:
      'An 8-year-old spayed female domestic shorthair presenting with moderate periodontal disease affecting all four maxillary canine teeth. Evidence of attachment loss, subgingival calculus, and early furcation involvement on the upper canines.',
    species: 'feline',
    ageYears: 8,
    breed: 'Domestic Shorthair',
    presentingComplaint: 'Reduced appetite, dropping food while eating, and mild facial swelling noticed over the past month.',
    pathologyType: 'periodontal_disease',
    severity: 'moderate',
    affectedTeeth: [108, 208, 308, 408],
    images: [],
    probeFindings: [
      {
        toothNumber: 108,
        locations: { mesial: 4, distal: 5, buccal: 4, lingual: 5 },
        bleedingOnProbing: true,
        suppuration: false,
        mobility: 1,
      },
      {
        toothNumber: 208,
        locations: { mesial: 5, distal: 6, buccal: 5, lingual: 5 },
        bleedingOnProbing: true,
        suppuration: true,
        mobility: 1,
        furcation: 1,
      },
      {
        toothNumber: 308,
        locations: { mesial: 4, distal: 5, buccal: 4, lingual: 4 },
        bleedingOnProbing: true,
        suppuration: false,
        mobility: 0,
      },
      {
        toothNumber: 408,
        locations: { mesial: 5, distal: 6, buccal: 5, lingual: 5 },
        bleedingOnProbing: true,
        suppuration: true,
        mobility: 1,
        furcation: 1,
      },
    ],
    diagnosis:
      'Moderate periodontal disease affecting all four maxillary canines with 4–6 mm probing depths, grade 1 mobility on three teeth, and early furcation involvement bilaterally.',
    treatmentPlan:
      'Full-mouth dental radiographs under anesthesia. Comprehensive periodontal therapy including subgingival debridement, local antimicrobial application, and possible guided tissue regeneration for furcation defects. Consider extraction if furcation involvement progresses. Oral home care protocol and 6-month re-evaluation.',
    difficulty: 'intermediate',
    estimatedMinutes: 20,
    tags: ['periodontal_disease', 'feline', 'mobility', 'furcation', 'moderate'],
  },
  {
    id: 'case-003',
    title: "Rex's Fractured Canine",
    description:
      'A 3-year-old intact male German Shepherd presenting with a fractured left mandibular canine tooth (304) with pulp exposure. The fracture was sustained from biting a metal cage approximately 48 hours ago.',
    species: 'canine',
    ageYears: 3,
    breed: 'German Shepherd',
    presentingComplaint: 'Owner noticed the dog whimpering when eating and drooling excessively after biting a metal object 2 days ago.',
    pathologyType: 'fractured_tooth',
    severity: 'severe',
    affectedTeeth: [304],
    images: [],
    probeFindings: [
      {
        toothNumber: 304,
        locations: { mesial: 2, distal: 2, buccal: 2, lingual: 2 },
        bleedingOnProbing: false,
        suppuration: false,
        mobility: 0,
      },
    ],
    diagnosis:
      'Complicated crown fracture of tooth 304 with pulp chamber exposure. Vitality testing indicated exposed pulp. Radiograph recommended to assess periapical status.',
    treatmentPlan:
      'Full-mouth dental radiographs to evaluate root integrity and periapical region. Options include root canal therapy or extraction. Pain management with NSAIDs and gabapentin pre-operatively. Antibiotic therapy if periapical lucency detected. Urgent referral to veterinary dentist if root canal is pursued.',
    difficulty: 'intermediate',
    estimatedMinutes: 20,
    tags: ['fracture', 'pulp_exposure', 'urgent', 'trauma', 'endodontics'],
  },
  {
    id: 'case-004',
    title: "Luna's Tooth Resorption",
    description:
      'A 10-year-old spayed female Siamese presenting with tooth resorption lesions affecting the mandibular third and fourth premolars. These lesions are common in older cats and can cause significant discomfort.',
    species: 'feline',
    ageYears: 10,
    breed: 'Siamese',
    presentingComplaint: 'Intermittent drooling, head-shaking, and reluctance to eat hard food for the past 3 months.',
    pathologyType: 'tooth_resorption',
    severity: 'moderate',
    affectedTeeth: [307, 407],
    images: [],
    probeFindings: [
      {
        toothNumber: 307,
        locations: { mesial: 4, distal: 5, buccal: 4, lingual: 5 },
        bleedingOnProbing: true,
        suppuration: false,
        mobility: 0,
      },
      {
        toothNumber: 407,
        locations: { mesial: 5, distal: 6, buccal: 5, lingual: 5 },
        bleedingOnProbing: true,
        suppuration: false,
        mobility: 1,
      },
    ],
    diagnosis:
      'Feline tooth resorption lesions (Type 2) on teeth 307 and 407 with moderate periodontal pocketing. Radiographic confirmation of root resorption required before treatment planning.',
    treatmentPlan:
      'Full-mouth dental radiographs to classify resorption type. Extraction of teeth with Type 2 resorption (root replacement resorption). Crown amputation may be appropriate for Type 2 lesions with complete ankylosis. Post-operative pain management and soft diet for 2 weeks. Long-term oral radiographic monitoring of adjacent teeth.',
    difficulty: 'advanced',
    estimatedMinutes: 25,
    tags: ['tooth_resorption', 'feline', 'geriatric', 'TR', 'extraction'],
  },
  {
    id: 'case-005',
    title: "Cooper's Advanced Perio",
    description:
      'A 9-year-old neutered male Golden Retriever presenting with advanced periodontal disease affecting multiple teeth in all quadrants. Severe attachment loss, deep periodontal pockets, furcation involvement, and significant mobility noted on several teeth.',
    species: 'canine',
    ageYears: 9,
    breed: 'Golden Retriever',
    presentingComplaint: 'Severe halitosis, difficulty chewing, loose teeth visible, and facial swelling. Owner reports gradual decline in eating habits over several months.',
    pathologyType: 'periodontal_disease',
    severity: 'severe',
    affectedTeeth: [108, 208, 308, 408],
    images: [],
    probeFindings: [
      {
        toothNumber: 108,
        locations: { mesial: 7, distal: 9, buccal: 7, lingual: 8 },
        bleedingOnProbing: true,
        suppuration: true,
        mobility: 2,
        furcation: 2,
      },
      {
        toothNumber: 208,
        locations: { mesial: 8, distal: 9, buccal: 8, lingual: 8 },
        bleedingOnProbing: true,
        suppuration: true,
        mobility: 2,
        furcation: 2,
      },
      {
        toothNumber: 308,
        locations: { mesial: 6, distal: 8, buccal: 7, lingual: 7 },
        bleedingOnProbing: true,
        suppuration: true,
        mobility: 1,
        furcation: 1,
      },
      {
        toothNumber: 408,
        locations: { mesial: 7, distal: 9, buccal: 8, lingual: 8 },
        bleedingOnProbing: true,
        suppuration: true,
        mobility: 2,
        furcation: 2,
      },
    ],
    diagnosis:
      'Stage 4 periodontal disease with generalized severe attachment loss (6–9 mm pockets), grade 1–2 mobility, grade 1–2 furcation involvement, and purulent discharge. Multiple teeth may require extraction.',
    treatmentPlan:
      'Comprehensive full-mouth dental radiographs under general anesthesia. Stage treatment plan: (1) extract severely compromised teeth with grade 2 mobility and furcation involvement, (2) perform guided tissue regeneration where feasible, (3) aggressive subgingival debridement and local antimicrobial delivery on salvageable teeth, (4) systemically appropriate antibiotics if indicated. Lifetime oral hygiene maintenance and 3-month re-evaluation. Discuss prognosis for remaining dentition with owner.',
    difficulty: 'advanced',
    estimatedMinutes: 30,
    tags: ['periodontal_disease', 'advanced', 'furcation', 'mobility', 'extraction', 'salvage'],
  },
];

export function getCaseById(id: string): ClinicalCase | undefined {
  return CLINICAL_CASES.find((c) => c.id === id);
}

export function getCasesBySpecies(species: 'canine' | 'feline'): ClinicalCase[] {
  return CLINICAL_CASES.filter((c) => c.species === species);
}
