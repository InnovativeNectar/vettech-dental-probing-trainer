import type { Module, Lesson, DifficultyLevel } from '@/types';

export interface LessonStep {
  id: string;
  lessonId: string;
  sortOrder: number;
  title: string;
  instruction: string;
  highlightTeeth?: number[];
  targetAction: 'probe_tooth' | 'identify_tooth' | 'measure_depth' | 'chart_reading' | 'observe';
  targetTooth?: number;
  targetLocation?: string;
  targetDepthRange?: [number, number];
  successMessage: string;
  failureMessage: string;
  hint: string;
}

export interface TrainingModule extends Module {
  lessons: TrainingLesson[];
}

export interface TrainingLesson extends Lesson {
  steps: LessonStep[];
}

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'mod-001',
    title: 'Dental Anatomy Orientation',
    description: 'Learn tooth numbering, positions, and basic anatomy using the Modified Triadan System.',
    type: 'orientation',
    difficulty: 'beginner',
    lessonCount: 3,
    estimatedMinutes: 15,
    requiredModules: [],
    sortOrder: 1,
    lessons: [
      {
        id: 'les-001-01',
        moduleId: 'mod-001',
        title: 'Meet the Teeth',
        description: 'Identify incisors, canines, premolars, and molars.',
        sortOrder: 1,
        objectives: ['Identify tooth types by position', 'Understand the dental arch'],
        estimatedMinutes: 5,
        steps: [
          {
            id: 'step-001-01-01',
            lessonId: 'les-001-01',
            sortOrder: 1,
            title: 'Find the Canine',
            instruction: 'Click on the canine tooth (the large pointed tooth). It should highlight when you hover over it.',
            highlightTeeth: [104],
            targetAction: 'identify_tooth',
            targetTooth: 104,
            successMessage: 'Correct! That\'s the right upper canine (#104). Canines are the longest teeth in dogs.',
            failureMessage: 'Not quite. Look for the large, pointed tooth — that\'s the canine.',
            hint: 'The canine is the big fang tooth, tooth #104.',
          },
          {
            id: 'step-001-01-02',
            lessonId: 'les-001-01',
            sortOrder: 2,
            title: 'Find an Incisor',
            instruction: 'Click on any incisor — these are the small teeth at the front of the mouth.',
            highlightTeeth: [101, 102, 103],
            targetAction: 'identify_tooth',
            targetTooth: 101,
            successMessage: 'Yes! Incisors are used for grooming and scraping. Dogs have 12 total.',
            failureMessage: 'That\'s not an incisor. Incisors are the small front teeth (#101-103).',
            hint: 'Incisors are teeth 101, 102, and 103 — the small ones at the front.',
          },
          {
            id: 'step-001-01-03',
            lessonId: 'les-001-01',
            sortOrder: 3,
            title: 'Find a Premolar',
            instruction: 'Click on any premolar — these are the teeth behind the canine.',
            highlightTeeth: [105, 106, 107, 108],
            targetAction: 'identify_tooth',
            targetTooth: 105,
            successMessage: 'Correct! Premolars have sharp edges for shearing food.',
            failureMessage: 'That\'s not a premolar. Premolars are behind the canine.',
            hint: 'Premolars are teeth 105-108, behind the canine.',
          },
        ],
      },
      {
        id: 'les-001-02',
        moduleId: 'mod-001',
        title: 'Triadan Numbering',
        description: 'Learn the Modified Triadan numbering system.',
        sortOrder: 2,
        objectives: ['Understand quadrant numbering (100s-400s)', 'Identify specific teeth by number'],
        estimatedMinutes: 5,
        steps: [
          {
            id: 'step-001-02-01',
            lessonId: 'les-001-02',
            sortOrder: 1,
            title: 'Upper Right Quadrant',
            instruction: 'The 100s are the upper right quadrant. Click any tooth in the 100s.',
            highlightTeeth: [101, 102, 103, 104, 105, 106, 107, 108],
            targetAction: 'identify_tooth',
            targetTooth: 101,
            successMessage: 'Yes! The 100s are upper right. Each quadrant has its own hundreds.',
            failureMessage: 'Remember, the 100s are the upper right quadrant.',
            hint: 'Teeth numbered 101-108 are in the upper right.',
          },
          {
            id: 'step-001-02-02',
            lessonId: 'les-001-02',
            sortOrder: 2,
            title: 'Upper Left Quadrant',
            instruction: 'The 200s are the upper left. Click any tooth in the 200s.',
            highlightTeeth: [201, 202, 203, 204, 205, 206, 207, 208],
            targetAction: 'identify_tooth',
            targetTooth: 201,
            successMessage: 'Correct! Upper left is the 200s.',
            failureMessage: 'The 200s are the upper left quadrant.',
            hint: 'Teeth numbered 201-208 are in the upper left.',
          },
        ],
      },
      {
        id: 'les-001-03',
        moduleId: 'mod-001',
        title: 'Species Differences',
        description: 'Compare canine and feline dental formulas.',
        sortOrder: 3,
        objectives: ['Compare dog vs cat tooth counts', 'Identify species-specific teeth'],
        estimatedMinutes: 5,
        steps: [
          {
            id: 'step-001-03-01',
            lessonId: 'les-001-03',
            sortOrder: 1,
            title: 'Dog vs Cat',
            instruction: 'Adult dogs have 42 teeth, adult cats have 30. Click on the canine tooth to begin comparing.',
            highlightTeeth: [104],
            targetAction: 'identify_tooth',
            targetTooth: 104,
            successMessage: 'Both species have prominent canines. Dogs have more premolars and molars.',
            failureMessage: 'Click the canine tooth (#104).',
            hint: 'The canine is tooth #104.',
          },
        ],
      },
    ],
  },
  {
    id: 'mod-002',
    title: 'Basic Probing Technique',
    description: 'Learn proper probe insertion angle, pressure, and movement patterns.',
    type: 'technique',
    difficulty: 'beginner',
    lessonCount: 3,
    estimatedMinutes: 20,
    requiredModules: ['mod-001'],
    sortOrder: 2,
    lessons: [
      {
        id: 'les-002-01',
        moduleId: 'mod-002',
        title: 'Probe Introduction',
        description: 'Get familiar with the periodontal probe and its markings.',
        sortOrder: 1,
        objectives: ['Understand probe markings', 'Learn proper grip angle'],
        estimatedMinutes: 5,
        steps: [
          {
            id: 'step-002-01-01',
            lessonId: 'les-002-01',
            sortOrder: 1,
            title: 'Position the Probe',
            instruction: 'Move the probe near tooth #104 using WASD keys. The probe tip should be close to the gumline.',
            targetAction: 'probe_tooth',
            targetTooth: 104,
            successMessage: 'Good positioning! The probe should be parallel to the tooth\'s long axis.',
            failureMessage: 'Move the probe closer to tooth #104.',
            hint: 'Use WASD to move the probe toward the tooth.',
          },
          {
            id: 'step-002-01-02',
            lessonId: 'les-002-01',
            sortOrder: 2,
            title: 'Insert the Probe',
            instruction: 'Press Q to gently insert the probe into the sulcus. Watch the depth indicator — stop when you feel resistance (around 1-3mm for healthy tissue).',
            targetAction: 'measure_depth',
            targetTooth: 104,
            targetDepthRange: [1, 3],
            successMessage: 'Excellent! A depth of 1-3mm is normal for healthy gingiva.',
            failureMessage: 'Try inserting more gently. Aim for 1-3mm depth.',
            hint: 'Press Q slowly to insert. The depth readout shows mm.',
          },
        ],
      },
      {
        id: 'les-002-02',
        moduleId: 'mod-002',
        title: 'Walking the Probe',
        description: 'Learn the walking technique around the tooth circumference.',
        sortOrder: 2,
        objectives: ['Perform walking stroke', 'Cover all 6 sites per tooth'],
        estimatedMinutes: 10,
        steps: [
          {
            id: 'step-002-02-01',
            lessonId: 'les-002-02',
            sortOrder: 1,
            title: 'Mesial Site',
            instruction: 'Move the probe to the mesial aspect (front-facing side) of tooth #104. Take a reading by pressing Space.',
            targetAction: 'chart_reading',
            targetTooth: 104,
            targetLocation: 'mesial',
            successMessage: 'Recorded! Now move to the distal site.',
            failureMessage: 'Move the probe to the front side of the tooth and take a reading.',
            hint: 'Mesial = the side facing the front of the mouth.',
          },
          {
            id: 'step-002-02-02',
            lessonId: 'les-002-02',
            sortOrder: 2,
            title: 'Distal Site',
            instruction: 'Move to the distal aspect (back-facing side) of tooth #104. Take a reading.',
            targetAction: 'chart_reading',
            targetTooth: 104,
            targetLocation: 'distal',
            successMessage: 'Great! You\'re covering the interproximal sites.',
            failureMessage: 'Move to the back side of the tooth.',
            hint: 'Distal = the side facing the back of the mouth.',
          },
          {
            id: 'step-002-02-03',
            lessonId: 'les-002-02',
            sortOrder: 3,
            title: 'Buccal Site',
            instruction: 'Move to the buccal aspect (cheek side) of tooth #104. Take a reading.',
            targetAction: 'chart_reading',
            targetTooth: 104,
            targetLocation: 'buccal',
            successMessage: 'Good! Buccal = cheek side. One more to go.',
            failureMessage: 'Move to the cheek-facing side of the tooth.',
            hint: 'Buccal = the side facing the cheek.',
          },
          {
            id: 'step-002-02-04',
            lessonId: 'les-002-02',
            sortOrder: 4,
            title: 'Lingual Site',
            instruction: 'Move to the lingual aspect (tongue side) of tooth #104. Take a reading.',
            targetAction: 'chart_reading',
            targetTooth: 104,
            targetLocation: 'lingual',
            successMessage: 'Perfect! You\'ve probed all 4 aspects of the tooth. In clinical practice, you\'d also do buccal/distal and lingual/distal — 6 sites total.',
            failureMessage: 'Move to the tongue-facing side of the tooth.',
            hint: 'Lingual = the side facing the tongue.',
          },
        ],
      },
      {
        id: 'les-002-03',
        moduleId: 'mod-002',
        title: 'Force and Pressure',
        description: 'Learn to apply appropriate probing force (~20-25g).',
        sortOrder: 3,
        objectives: ['Recognize correct probing force', 'Avoid tissue damage'],
        estimatedMinutes: 5,
        steps: [
          {
            id: 'step-002-03-01',
            lessonId: 'les-002-03',
            sortOrder: 1,
            title: 'Gentle Pressure',
            instruction: 'Insert the probe with gentle pressure. The force indicator should stay in the green zone. If it turns red, you\'re pressing too hard!',
            targetAction: 'measure_depth',
            targetTooth: 104,
            targetDepthRange: [1, 3],
            successMessage: 'Perfect force! ~20-25g is ideal for probing.',
            failureMessage: 'Adjust your pressure. The force indicator helps you gauge it.',
            hint: 'Watch the color indicator — green is good, red means too much force.',
          },
        ],
      },
    ],
  },
  {
    id: 'mod-003',
    title: 'Periodontal Measurements',
    description: 'Accurate probing depth measurement and charting.',
    type: 'measurement',
    difficulty: 'intermediate',
    lessonCount: 3,
    estimatedMinutes: 25,
    requiredModules: ['mod-001', 'mod-002'],
    sortOrder: 3,
    lessons: [
      {
        id: 'les-003-01',
        moduleId: 'mod-003',
        title: 'Normal Depths',
        description: 'Identify normal probing depths across different tooth types.',
        sortOrder: 1,
        objectives: ['Know normal depth ranges', 'Differentiate tooth types by probing depth'],
        estimatedMinutes: 8,
        steps: [
          {
            id: 'step-003-01-01',
            lessonId: 'les-003-01',
            sortOrder: 1,
            title: 'Probe the Incisor',
            instruction: 'Probe tooth #101 (central incisor). Normal depth for incisors is 1-2mm.',
            targetAction: 'measure_depth',
            targetTooth: 101,
            targetDepthRange: [1, 2],
            successMessage: 'Correct! Incisors have shallow sulci, typically 1-2mm.',
            failureMessage: 'Incisors should measure 1-2mm. Try adjusting your probe depth.',
            hint: 'Incisors have very shallow sulci.',
          },
          {
            id: 'step-003-01-02',
            lessonId: 'les-003-01',
            sortOrder: 2,
            title: 'Probe the Canine',
            instruction: 'Probe tooth #104 (canine). Normal depth is 1-3mm.',
            targetAction: 'measure_depth',
            targetTooth: 104,
            targetDepthRange: [1, 3],
            successMessage: 'Good! Canines typically measure 1-3mm.',
            failureMessage: 'Canines should measure 1-3mm.',
            hint: 'Canines have slightly deeper sulci than incisors.',
          },
          {
            id: 'step-003-01-03',
            lessonId: 'les-003-01',
            sortOrder: 3,
            title: 'Probe the Molar',
            instruction: 'Probe tooth #109 (first molar). Normal depth is 2-4mm.',
            targetAction: 'measure_depth',
            targetTooth: 109,
            targetDepthRange: [2, 4],
            successMessage: 'Excellent! Molars have deeper sulci due to their larger surface area.',
            failureMessage: 'Molars typically measure 2-4mm.',
            hint: 'Molars have the deepest sulci in the mouth.',
          },
        ],
      },
      {
        id: 'les-003-02',
        moduleId: 'mod-003',
        title: 'Recording Measurements',
        description: 'Practice taking and recording multiple readings.',
        sortOrder: 2,
        objectives: ['Take readings at all 6 sites', 'Record accurately'],
        estimatedMinutes: 10,
        steps: [
          {
            id: 'step-003-02-01',
            lessonId: 'les-003-02',
            sortOrder: 1,
            title: 'Full Mouth Probing',
            instruction: 'Probe all 6 sites on tooth #104 and record each reading. Press Space to record each measurement.',
            targetAction: 'chart_reading',
            targetTooth: 104,
            successMessage: 'Great! You\'ve completed a full probing of one tooth. In practice, you\'d do this for every tooth.',
            failureMessage: 'Keep probing and recording until you have all 6 sites.',
            hint: 'Remember: mesial, mesiobuccal, buccal, distobuccal, distal, lingual.',
          },
        ],
      },
      {
        id: 'les-003-03',
        moduleId: 'mod-003',
        title: 'Identifying Abnormalities',
        description: 'Learn to recognize pockets, recession, and other periodontal issues.',
        sortOrder: 3,
        objectives: ['Identify pocketing >3mm', 'Recognize recession'],
        estimatedMinutes: 7,
        steps: [
          {
            id: 'step-003-03-01',
            lessonId: 'les-003-03',
            sortOrder: 1,
            title: 'Deep Pocket Detection',
            instruction: 'Probe tooth #108 (fourth premolar). This tooth has a 6mm pocket on the distal. Can you find it?',
            targetAction: 'measure_depth',
            targetTooth: 108,
            targetDepthRange: [5, 7],
            successMessage: 'Found it! A 6mm pocket indicates significant periodontal disease. This would require treatment.',
            failureMessage: 'Keep probing — look for the deep area on the distal side.',
            hint: 'Focus on the distal (back) side of the tooth.',
          },
        ],
      },
    ],
  },
  {
    id: 'mod-004',
    title: 'Pathology Recognition',
    description: 'Identify gingivitis, periodontitis, and other conditions during probing.',
    type: 'pathology',
    difficulty: 'advanced',
    lessonCount: 3,
    estimatedMinutes: 30,
    requiredModules: ['mod-001', 'mod-002', 'mod-003'],
    sortOrder: 4,
    lessons: [
      {
        id: 'les-004-01',
        moduleId: 'mod-004',
        title: 'Bleeding on Probing',
        description: 'Recognize bleeding as a sign of inflammation.',
        sortOrder: 1,
        objectives: ['Identify BOP', 'Understand its significance'],
        estimatedMinutes: 10,
        steps: [
          {
            id: 'step-004-01-01',
            lessonId: 'les-004-01',
            sortOrder: 1,
            title: 'Healthy Tissue',
            instruction: 'Probe tooth #101. Healthy tissue should not bleed. Observe the sulcus visualization.',
            targetAction: 'observe',
            targetTooth: 101,
            successMessage: 'Correct! No bleeding indicates healthy gingiva.',
            failureMessage: 'Observe the tissue response carefully.',
            hint: 'Watch the gum color and look for any red spots.',
          },
          {
            id: 'step-004-01-02',
            lessonId: 'les-004-01',
            sortOrder: 2,
            title: 'Inflamed Tissue',
            instruction: 'Probe tooth #204. This area has gingivitis. Look for redness and bleeding on probing.',
            targetAction: 'observe',
            targetTooth: 204,
            successMessage: 'You identified bleeding on probing! BOP is the earliest sign of periodontal disease.',
            failureMessage: 'Look for redness and bleeding when probing this area.',
            hint: 'The gum tissue will appear redder and may bleed.',
          },
        ],
      },
      {
        id: 'les-004-02',
        moduleId: 'mod-004',
        title: 'Pocket Classification',
        description: 'Classify probing depths into periodontal categories.',
        sortOrder: 2,
        objectives: ['Classify pockets by depth', 'Determine treatment urgency'],
        estimatedMinutes: 10,
        steps: [
          {
            id: 'step-004-02-01',
            lessonId: 'les-004-02',
            sortOrder: 1,
            title: 'Grade the Pocket',
            instruction: 'Probe tooth #308. Classify the depth: Normal (1-3mm), Moderate (4-5mm), or Severe (6mm+).',
            targetAction: 'measure_depth',
            targetTooth: 308,
            targetDepthRange: [4, 6],
            successMessage: 'Good assessment! This pocket requires treatment planning.',
            failureMessage: 'Probe the tooth and classify the depth you find.',
            hint: 'Use the depth readout to classify.',
          },
        ],
      },
      {
        id: 'les-004-03',
        moduleId: 'mod-004',
        title: 'Furcation Exposure',
        description: 'Identify furcation involvement in multi-rooted teeth.',
        sortOrder: 3,
        objectives: ['Identify furcation areas', 'Grade furcation involvement'],
        estimatedMinutes: 10,
        steps: [
          {
            id: 'step-004-03-01',
            lessonId: 'les-004-03',
            sortOrder: 1,
            title: 'Furcation Probe',
            instruction: 'Probe tooth #308 (lower first molar) at the furcation area between the roots. Furcation involvement indicates advanced bone loss.',
            targetAction: 'probe_tooth',
            targetTooth: 308,
            successMessage: 'You identified the furcation! This is a critical finding in periodontal assessment.',
            failureMessage: 'Focus on the area between the roots of this multi-rooted tooth.',
            hint: 'The furcation is where the roots diverge.',
          },
        ],
      },
    ],
  },
];

export function getModuleById(id: string): TrainingModule | undefined {
  return TRAINING_MODULES.find((m) => m.id === id);
}

export function getLessonById(lessonId: string): TrainingLesson | undefined {
  for (const mod of TRAINING_MODULES) {
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
}

export function getModulesByDifficulty(difficulty: DifficultyLevel): TrainingModule[] {
  return TRAINING_MODULES.filter((m) => m.difficulty === difficulty);
}

export function getNextLesson(currentLessonId: string): TrainingLesson | null {
  for (const mod of TRAINING_MODULES) {
    for (let i = 0; i < mod.lessons.length; i++) {
      if (mod.lessons[i].id === currentLessonId) {
        if (i + 1 < mod.lessons.length) return mod.lessons[i + 1];
        const modIdx = TRAINING_MODULES.indexOf(mod);
        if (modIdx + 1 < TRAINING_MODULES.length) {
          return TRAINING_MODULES[modIdx + 1].lessons[0];
        }
        return null;
      }
    }
  }
  return null;
}
