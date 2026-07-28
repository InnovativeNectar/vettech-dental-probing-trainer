import type { Assessment } from '@/types';

export const ASSESSMENTS: Assessment[] = [
  {
    id: 'assess-001',
    title: 'Dental Anatomy Quiz',
    description:
      'Test your knowledge of veterinary dental anatomy, tooth numbering systems, and species-specific differences in dental formulas.',
    type: 'quiz',
    moduleId: 'mod-001',
    timeLimitMinutes: 10,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'q-001-01',
        type: 'multiple_choice',
        content:
          'In the Modified Triadan System, how are permanent canine teeth numbered?',
        options: [
          { id: 'a', text: 'Upper 101/201, lower 301/401', isCorrect: false },
          { id: 'b', text: 'Upper 104/204, lower 304/404', isCorrect: true },
          { id: 'c', text: 'Upper 105/205, lower 305/405', isCorrect: false },
          { id: 'd', text: 'Upper 108/208, lower 308/408', isCorrect: false },
        ],
        correctAnswer: 'b',
        points: 2,
        explanation:
          'In the Modified Triadan System, each dental quadrant is assigned a number (1=upper right, 2=upper left, 3=lower left, 4=lower right). Canines are always the fourth tooth in each quadrant, giving us 104, 204, 304, and 404.',
      },
      {
        id: 'q-001-02',
        type: 'multiple_choice',
        content: 'How many permanent teeth does an adult dog have in total?',
        options: [
          { id: 'a', text: '28', isCorrect: false },
          { id: 'b', text: '30', isCorrect: false },
          { id: 'c', text: '42', isCorrect: true },
          { id: 'd', text: '44', isCorrect: false },
        ],
        correctAnswer: 'c',
        points: 2,
        explanation:
          'An adult dog has 42 permanent teeth: 20 maxillary and 22 mandibular. This includes 12 incisors, 4 canines, 16 premolars, and 10 molars.',
      },
      {
        id: 'q-001-03',
        type: 'multiple_choice',
        content: 'What is the normal sulcus depth range for a healthy canine tooth?',
        options: [
          { id: 'a', text: '0.5–1 mm', isCorrect: false },
          { id: 'b', text: '1–3 mm', isCorrect: true },
          { id: 'c', text: '3–5 mm', isCorrect: false },
          { id: 'd', text: '5–7 mm', isCorrect: false },
        ],
        correctAnswer: 'b',
        points: 2,
        explanation:
          'Normal gingival sulcus depth in dogs is typically 1–3 mm depending on tooth size and breed. Depths greater than 3 mm are generally considered abnormal and may indicate periodontal disease.',
      },
      {
        id: 'q-001-04',
        type: 'multiple_choice',
        content:
          'Which of the following is TRUE about the feline dental formula compared to the canine?',
        options: [
          { id: 'a', text: 'Cats have more molars than dogs', isCorrect: false },
          { id: 'b', text: 'Cats have no mandibular molars', isCorrect: false },
          {
            id: 'c',
            text: 'Cats have fewer premolars and molars than dogs',
            isCorrect: true,
          },
          { id: 'd', text: 'The formulas are identical', isCorrect: false },
        ],
        correctAnswer: 'c',
        points: 3,
        explanation:
          'Cats have 30 permanent teeth (16 upper, 14 lower) compared to the dog\'s 42. Cats lack the first upper premolar and have fewer molars — the feline dental formula is I3/3 C1/1 P3/2 M1/1.',
      },
      {
        id: 'q-001-05',
        type: 'multiple_choice',
        content:
          'What is the primary function of the carnassial teeth in carnivores?',
        options: [
          {
            id: 'a',
            text: 'Shearing food like scissors between upper premolar 4 and lower molar 1',
            isCorrect: true,
          },
          { id: 'b', text: 'Crushing bones for marrow', isCorrect: false },
          { id: 'c', text: 'Grinding plant material', isCorrect: false },
          {
            id: 'd',
            text: 'Retaining prey during capture',
            isCorrect: false,
          },
        ],
        correctAnswer: 'a',
        points: 3,
        explanation:
          'The carnassial pair consists of the upper fourth premolar (108/208) and lower first molar (309/409). These teeth work together in a shearing motion to cut through meat and sinew, functioning like a pair of scissors.',
      },
    ],
  },
  {
    id: 'assess-002',
    title: 'Probing Technique Assessment',
    description:
      'Evaluate your understanding of proper periodontal probing technique, probe angulation, pressure control, and common measurement errors.',
    type: 'practical',
    moduleId: 'mod-003',
    timeLimitMinutes: 15,
    passingScore: 80,
    maxAttempts: 2,
    questions: [
      {
        id: 'q-002-01',
        type: 'multiple_choice',
        content:
          'What is the recommended force to apply when inserting a periodontal probe into the sulcus?',
        options: [
          { id: 'a', text: 'As much as needed to reach the base', isCorrect: false },
          { id: 'b', text: '20–25 grams (light enough to blanch the free gingiva)', isCorrect: true },
          { id: 'c', text: '50 grams minimum for accurate readings', isCorrect: false },
          { id: 'd', text: 'Force does not matter as long as the probe is inserted fully', isCorrect: false },
        ],
        correctAnswer: 'b',
        points: 3,
        explanation:
          'The correct probing force is approximately 20–25 grams, which is light enough to gently blanch the free gingiva without causing trauma. This is often described as the pressure needed to press on a ripe tomato without breaking the skin.',
      },
      {
        id: 'q-002-02',
        type: 'probe_simulation',
        content:
          'You are probing tooth 308 in a dog. The probe reads 2 mm mesial, 3 mm distal, 2 mm buccal, and 3 mm lingual. There is no bleeding. Select all correct actions based on these findings.',
        modelUrl: '/models/tooth-308.glb',
        correctAnswer: ['normal', 'no_intervention'],
        points: 3,
        explanation:
          'Probing depths of 2–3 mm in a canine patient are within normal limits. No bleeding on probing confirms healthy periodontium. No intervention is needed — continue probing the remaining teeth systematically.',
      },
      {
        id: 'q-002-03',
        type: 'multiple_choice',
        content:
          'When probing the distal surface of a maxillary canine tooth, at what angle should the probe be oriented?',
        options: [
          { id: 'a', text: 'Parallel to the long axis of the tooth', isCorrect: false },
          { id: 'b', text: 'Perpendicular to the tooth surface, slightly angled distally', isCorrect: true },
          { id: 'c', text: 'Angled 45 degrees mesially', isCorrect: false },
          { id: 'd', text: 'Flat against the gingiva', isCorrect: false },
        ],
        correctAnswer: 'b',
        points: 3,
        explanation:
          'The probe should be held perpendicular to the tooth surface being measured, with a slight distal angulation on distal surfaces to follow the contour of the tooth root into the distal sulcus. This ensures you measure the deepest point of the pocket.',
      },
      {
        id: 'q-002-04',
        type: 'multiple_choice',
        content:
          'Which of the following is a common probing technique error that leads to artificially shallow depth readings?',
        options: [
          { id: 'a', text: 'Using a University of Minnesota probe', isCorrect: false },
          { id: 'b', text: 'Inserting the probe too forcefully into the sulcus', isCorrect: false },
          { id: 'c', text: 'Failing to angle the probe toward the base of the pocket', isCorrect: true },
          { id: 'd', text: 'Recording measurements at six locations per tooth', isCorrect: false },
        ],
        correctAnswer: 'c',
        points: 3,
        explanation:
          'If the probe is not angled toward the deepest part of the pocket (the base), it may rest on the junctional epithelium at a higher point, producing an artificially shallow reading. Always walk the probe around the sulcus to find the deepest point at each location.',
      },
    ],
  },
  {
    id: 'assess-003',
    title: 'Pathology Identification Quiz',
    description:
      'Test your ability to identify common veterinary dental pathologies from clinical descriptions and radiographic findings.',
    type: 'quiz',
    moduleId: 'mod-004',
    timeLimitMinutes: 10,
    passingScore: 75,
    maxAttempts: 3,
    questions: [
      {
        id: 'q-003-01',
        type: 'multiple_choice',
        content:
          'A 7-year-old cat presents with red, swollen gingiva extending along the entire dental arcade. There is no attachment loss. The owner reports the cat has been gradually refusing food. What is the most likely diagnosis?',
        options: [
          { id: 'a', text: 'Stage 4 periodontal disease', isCorrect: false },
          { id: 'b', text: 'Generalized gingivitis', isCorrect: true },
          { id: 'c', text: 'Tooth resorption', isCorrect: false },
          { id: 'd', text: 'Chronic stomatitis', isCorrect: false },
        ],
        correctAnswer: 'b',
        points: 2,
        explanation:
          'Red, swollen gingiva without attachment loss is characteristic of gingivitis. Generalized stomatitis typically involves broader tissue inflammation extending beyond the gingiva, and periodontal disease requires attachment loss or bone loss for diagnosis.',
      },
      {
        id: 'q-003-02',
        type: 'image_identification',
        content:
          'Identify the type of pathology visible in this dental radiograph of a feline mandibular premolar.',
        imageUrl: '/images/placeholder-resorption-xray.png',
        options: [
          { id: 'a', text: 'Crown fracture', isCorrect: false },
          { id: 'b', text: 'Feline tooth resorption (Type 1)', isCorrect: false },
          { id: 'c', text: 'Feline tooth resorption (Type 2)', isCorrect: true },
          { id: 'd', text: 'Periapical abscess', isCorrect: false },
        ],
        correctAnswer: 'c',
        points: 3,
        explanation:
          'Type 2 tooth resorption shows replacement resorption where the root structure is being replaced by bone-like tissue, resulting in loss of the periodontal ligament space and root opacity. Type 1 shows discrete radiolucent lesions within an intact root structure.',
      },
      {
        id: 'q-003-03',
        type: 'multiple_choice',
        content:
          'A dog presents with a draining tract apical to tooth 308. Radiographs show a periapical lucency. The tooth tested non-vital. What is the most likely diagnosis?',
        options: [
          { id: 'a', text: 'Gingival abscess', isCorrect: false },
          { id: 'b', text: 'Furcation abscess', isCorrect: false },
          { id: 'c', text: 'Periapical abscess (periapical periodontitis)', isCorrect: true },
          { id: 'd', text: 'Necrotic pulp without abscess', isCorrect: false },
        ],
        correctAnswer: 'c',
        points: 3,
        explanation:
          'A draining tract (parulis) combined with a periapical radiolucency and a non-vital tooth is the classic presentation of a periapical abscess. The necrotic pulp contents have exited through the apex, causing localized bone destruction.',
      },
      {
        id: 'q-003-04',
        type: 'image_identification',
        content:
          'This clinical photograph shows a canine patient with a tooth that has a visible red dot on the crown surface. What does this finding indicate?',
        imageUrl: '/images/placeholder-pulp-exposure.png',
        options: [
          { id: 'a', text: 'Enamel erosion from tooth resorption', isCorrect: false },
          { id: 'b', text: 'Complicated crown fracture with pulp exposure', isCorrect: true },
          { id: 'c', text: 'Simple crown fracture without pulp involvement', isCorrect: false },
          { id: 'd', text: 'Caries lesion on the cusp', isCorrect: false },
        ],
        correctAnswer: 'b',
        points: 4,
        explanation:
          'A visible red or pink dot on a fractured tooth crown indicates pulp exposure (complicated crown fracture). The reddish area is the exposed pulp tissue, which is highly sensitive and requires urgent endodontic treatment or extraction.',
      },
      {
        id: 'q-003-05',
        type: 'multiple_choice',
        content:
          'Which grading system is used to classify periodontal disease severity in veterinary dentistry?',
        options: [
          { id: 'a', text: 'Grade 1–4 based on probing depth only', isCorrect: false },
          {
            id: 'b',
            text: 'Stage 1–4 based on attachment loss (AVDC staging)',
            isCorrect: true,
          },
          { id: 'c', text: 'Grade A–D based on radiographic findings', isCorrect: false },
          {
            id: 'd',
            text: 'Severity index based on mobility alone',
            isCorrect: false,
          },
        ],
        correctAnswer: 'b',
        points: 3,
        explanation:
          'The American Veterinary Dental College (AVDC) uses a staging system (Stage 1–4) for periodontal disease classification based on attachment loss: Stage 1 (<25% attachment loss), Stage 2 (25–50%), Stage 3 (>50%, tooth may be salvageable), and Stage 4 (hopeless prognosis).',
      },
    ],
  },
  {
    id: 'assess-004',
    title: 'Comprehensive Clinical Assessment',
    description:
      'A thorough evaluation covering dental anatomy, probing technique, pathology identification, treatment planning, and clinical decision-making.',
    type: 'comprehensive',
    timeLimitMinutes: 30,
    passingScore: 80,
    maxAttempts: 2,
    questions: [
      {
        id: 'q-004-01',
        type: 'multiple_choice',
        content:
          'In the Modified Triadan System, which teeth are designated as the "carnassial pair" in a dog?',
        options: [
          {
            id: 'a',
            text: 'Upper 104/204 and lower 304/404',
            isCorrect: false,
          },
          {
            id: 'b',
            text: 'Upper 108/208 and lower 309/409',
            isCorrect: true,
          },
          {
            id: 'c',
            text: 'Upper 110/210 and lower 310/410',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Upper 109/209 and lower 308/408',
            isCorrect: false,
          },
        ],
        correctAnswer: 'b',
        points: 2,
        explanation:
          'The carnassial pair in dogs is the upper fourth premolar (108/208) and the lower first molar (309/409). These work together as a shearing mechanism for processing food.',
      },
      {
        id: 'q-004-02',
        type: 'multiple_choice',
        content:
          'You probe a tooth and find a 7 mm pocket on the distal aspect with bleeding and suppuration, while the other surfaces measure 2–3 mm. How should you record this finding?',
        options: [
          { id: 'a', text: 'Record only the deepest measurement (7 mm)', isCorrect: false },
          {
            id: 'b',
            text: 'Record all four measurements and note the isolated deep pocket with BOP and suppuration',
            isCorrect: true,
          },
          {
            id: 'c',
            text: 'Record the average of all measurements',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Re-probe until all surfaces show the same depth',
            isCorrect: false,
          },
        ],
        correctAnswer: 'b',
        points: 3,
        explanation:
          'Always record the individual measurements at each location. An isolated deep pocket suggests localized disease. Note bleeding on probing and suppuration separately — these are important clinical indicators of active disease that influence treatment planning.',
      },
      {
        id: 'q-004-03',
        type: 'image_identification',
        content:
          'A feline radiograph shows the roots of tooth 307 with loss of periodontal ligament space and root structure blending into alveolar bone. What condition is present?',
        imageUrl: '/images/placeholder-replacement-resorption.png',
        options: [
          { id: 'a', text: 'External root resorption', isCorrect: false },
          { id: 'b', text: 'Ankylosis with replacement resorption (Type 2 TR)', isCorrect: true },
          { id: 'c', text: 'Periapical lucency from pulp necrosis', isCorrect: false },
          { id: 'd', text: 'Normal feline dental anatomy', isCorrect: false },
        ],
        correctAnswer: 'b',
        points: 4,
        explanation:
          'When the periodontal ligament space is obliterated and root structure is replaced by bone-like tissue, this is characteristic of Type 2 tooth resorption with ankylosis. The root becomes indistinguishable from the surrounding alveolar bone on radiographs.',
      },
      {
        id: 'q-004-04',
        type: 'probe_simulation',
        content:
          'You are probing a canine patient. Tooth 108 shows the following readings: mesial 8 mm, distal 9 mm, buccal 7 mm, lingual 8 mm, with grade 2 mobility and furcation involvement. What is your assessment?',
        modelUrl: '/models/tooth-108.glb',
        correctAnswer: ['severe_perio', 'extraction_likely'],
        points: 5,
        explanation:
          'Probing depths of 7–9 mm with grade 2 mobility and furcation involvement indicate advanced periodontal disease (Stage 3–4). This tooth has a guarded to poor prognosis. Full-mouth radiographs are needed, but extraction is likely the recommended treatment.',
      },
      {
        id: 'q-004-05',
        type: 'multiple_choice',
        content:
          'What is the correct order of steps when performing a periodontal examination under anesthesia?',
        options: [
          {
            id: 'a',
            text: 'Probe → Chart → Radiograph → Clean → Treat',
            isCorrect: false,
          },
          {
            id: 'b',
            text: 'Radiograph → Probe → Chart → Treatment plan → Treat',
            isCorrect: true,
          },
          {
            id: 'c',
            text: 'Clean → Probe → Radiograph → Chart → Treat',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Chart → Clean → Probe → Radiograph → Treat',
            isCorrect: false,
          },
        ],
        correctAnswer: 'b',
        points: 3,
        explanation:
          'Dental radiographs should be taken first before any probing or cleaning, as calculus can interfere with probe readings and radiographs provide the baseline for treatment planning. Then probe all teeth, chart findings, develop a treatment plan, and execute treatment.',
      },
      {
        id: 'q-004-06',
        type: 'multiple_choice',
        content:
          'A 4-year-old dog presents with a fractured incisor. Radiographs show no periapical pathology and the tooth tests vital. What is the appropriate treatment?',
        options: [
          { id: 'a', text: 'Immediate extraction', isCorrect: false },
          {
            id: 'b',
            text: 'Composite restoration with monitoring',
            isCorrect: true,
          },
          { id: 'c', text: 'Root canal therapy', isCorrect: false },
          { id: 'd', text: 'No treatment needed', isCorrect: false },
        ],
        correctAnswer: 'b',
        points: 3,
        explanation:
          'A vital tooth with an uncomplicated crown fracture (no pulp exposure) and no periapical pathology can be managed with composite restoration to seal the dentin and prevent further exposure. Regular monitoring with radiographs ensures no delayed pulp necrosis develops.',
      },
      {
        id: 'q-004-07',
        type: 'multiple_choice',
        content:
          'Which of the following is a contraindication to dental probing?',
        options: [
          { id: 'a', text: 'Patient under general anesthesia', isCorrect: false },
          { id: 'b', text: 'Suspected tooth resorption lesion', isCorrect: false },
          {
            id: 'c',
            text: 'Severe head trauma with suspected facial fractures',
            isCorrect: true,
          },
          {
            id: 'd',
            text: 'Patient with mild gingivitis',
            isCorrect: false,
          },
        ],
        correctAnswer: 'c',
        points: 4,
        explanation:
          'Probing should be avoided if there is suspicion of facial fractures or severe head trauma, as inserting a probe could exacerbate existing injuries. In all other scenarios, probing is an essential diagnostic tool. For suspected resorption, gentle probing is still performed but interpreted alongside radiographs.',
      },
      {
        id: 'q-004-08',
        type: 'charting',
        content:
          'Complete the dental chart for this 6-year-old dog: Record probing depths, BOP, and mobility for teeth 108 (mesial 4 mm, distal 5 mm, buccal 4 mm, lingual 5 mm, BOP positive, mobility 0), 208 (mesial 3 mm, distal 4 mm, buccal 3 mm, lingual 3 mm, BOP negative, mobility 0), and 308 (mesial 2 mm, distal 3 mm, buccal 2 mm, lingual 2 mm, BOP negative, mobility 0).',
        correctAnswer: ['108_perio', '208_healthy', '308_healthy'],
        points: 5,
        explanation:
          'Tooth 108 shows stage 2 periodontal disease (probing depths up to 5 mm with BOP). Teeth 208 and 308 are within normal limits. Correct charting requires recording all measurements, BOP status, and mobility at each location for accurate diagnosis and treatment planning.',
      },
    ],
  },
];

export function getAssessmentById(id: string): Assessment | undefined {
  return ASSESSMENTS.find((a) => a.id === id);
}

export function getAssessmentsByModule(moduleId: string): Assessment[] {
  return ASSESSMENTS.filter((a) => a.moduleId === moduleId);
}
