import Database from 'better-sqlite3';
import { TRAINING_MODULES } from '../src/lib/training-data';
import { CLINICAL_CASES } from '../src/lib/case-data';
import { ASSESSMENTS } from '../src/lib/assessment-data';

const sqlite = new Database('dev.db');
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = OFF');

function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const now = new Date();
const ts = Math.floor(now.getTime() / 1000);

// 1. Clear all data (FK-safe order)
const tableNames = [
  'badges',
  'skill_areas',
  'xapi_statements',
  'assessment_results',
  'case_attempts',
  'case_images',
  'pathology_data',
  'question_options',
  'questions',
  'progress_records',
  'lessons',
  'dental_cases',
  'modules',
  'users',
];

for (const name of tableNames) {
  sqlite.prepare(`DELETE FROM "${name}"`).run();
}
try { sqlite.prepare('DELETE FROM assessments_meta').run(); } catch {}
console.log('Cleared all tables.');

// 2. Demo user
const insertUser = sqlite.prepare(
  `INSERT INTO users (id, email, name, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`
);
insertUser.run('user-001', 'demo@vettech.edu', 'Demo Student', 'student', ts, ts);
console.log('Inserted demo user.');

// 3. Modules
const insertModule = sqlite.prepare(
  `INSERT INTO modules (id, title, description, type, difficulty, lesson_count, estimated_minutes, required_modules, sort_order)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

for (const mod of TRAINING_MODULES) {
  insertModule.run(
    mod.id,
    mod.title,
    mod.description,
    mod.type,
    mod.difficulty,
    mod.lessonCount,
    mod.estimatedMinutes,
    JSON.stringify(mod.requiredModules),
    mod.sortOrder
  );
}
console.log(`Inserted ${TRAINING_MODULES.length} modules.`);

// 4. Lessons
const insertLesson = sqlite.prepare(
  `INSERT INTO lessons (id, module_id, title, description, sort_order, objectives, estimated_minutes)
   VALUES (?, ?, ?, ?, ?, ?, ?)`
);

let lessonCount = 0;
for (const mod of TRAINING_MODULES) {
  for (const lesson of mod.lessons) {
    insertLesson.run(
      lesson.id,
      lesson.moduleId,
      lesson.title,
      lesson.description,
      lesson.sortOrder,
      JSON.stringify(lesson.objectives),
      lesson.estimatedMinutes
    );
    lessonCount++;
  }
}
console.log(`Inserted ${lessonCount} lessons.`);

// 5. Clinical cases
const insertCase = sqlite.prepare(
  `INSERT INTO dental_cases (id, title, description, species, age_years, breed, presenting_complaint, pathology_type, severity, affected_teeth, diagnosis, treatment_plan, difficulty, estimated_minutes, tags)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

for (const c of CLINICAL_CASES) {
  insertCase.run(
    c.id,
    c.title,
    c.description,
    c.species,
    c.ageYears,
    c.breed,
    c.presentingComplaint,
    c.pathologyType,
    c.severity,
    JSON.stringify(c.affectedTeeth),
    c.diagnosis,
    c.treatmentPlan,
    c.difficulty,
    c.estimatedMinutes,
    JSON.stringify(c.tags)
  );
}
console.log(`Inserted ${CLINICAL_CASES.length} dental cases.`);

// 6. Pathology data
const insertPathology = sqlite.prepare(
  `INSERT INTO pathology_data (id, case_id, tooth_number, location, depth_mm, bleeding_on_probing, suppuration, mobility, furcation)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

let pathCount = 0;
for (const c of CLINICAL_CASES) {
  for (const finding of c.probeFindings) {
    const locs = finding.locations;
    for (const [location, depth] of Object.entries(locs)) {
      if (depth !== undefined) {
        insertPathology.run(
          uuid(),
          c.id,
          finding.toothNumber,
          location,
          depth,
          finding.bleedingOnProbing ? 1 : 0,
          finding.suppuration ? 1 : 0,
          finding.mobility ?? 0,
          finding.furcation ?? null
        );
        pathCount++;
      }
    }
  }
}
console.log(`Inserted ${pathCount} pathology data rows.`);

// 7. Assessment metadata (lightweight table for FK references from questions)
sqlite.prepare(`
  CREATE TABLE IF NOT EXISTS assessments_meta (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT,
    module_id TEXT,
    time_limit_minutes INTEGER,
    passing_score INTEGER,
    max_attempts INTEGER
  )
`).run();

const insertAssessmentMeta = sqlite.prepare(
  `INSERT INTO assessments_meta (id, title, description, type, module_id, time_limit_minutes, passing_score, max_attempts)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
);

for (const a of ASSESSMENTS) {
  insertAssessmentMeta.run(
    a.id,
    a.title,
    a.description,
    a.type,
    a.moduleId ?? null,
    a.timeLimitMinutes,
    a.passingScore,
    a.maxAttempts ?? null
  );
}
console.log(`Inserted ${ASSESSMENTS.length} assessment metadata rows.`);

// 8. Questions
const insertQuestion = sqlite.prepare(
  `INSERT INTO questions (id, assessment_id, type, content, image_url, correct_answer, points, explanation, sort_order)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

let questionCount = 0;
for (const a of ASSESSMENTS) {
  for (let i = 0; i < a.questions.length; i++) {
    const q = a.questions[i];
    const correctAnswer = Array.isArray(q.correctAnswer)
      ? JSON.stringify(q.correctAnswer)
      : String(q.correctAnswer);

    insertQuestion.run(
      q.id,
      a.id,
      q.type,
      q.content,
      q.imageUrl ?? null,
      correctAnswer,
      q.points,
      q.explanation,
      i
    );
    questionCount++;
  }
}
console.log(`Inserted ${questionCount} questions.`);

// 9. Question options
const insertOption = sqlite.prepare(
  `INSERT INTO question_options (id, question_id, text, is_correct, sort_order)
   VALUES (?, ?, ?, ?, ?)`
);

let optionCount = 0;
for (const a of ASSESSMENTS) {
  for (const q of a.questions) {
    if ('options' in q && q.options) {
      for (let i = 0; i < q.options.length; i++) {
        const opt = q.options[i];
        insertOption.run(
          `${q.id}-opt-${i}`,
          q.id,
          opt.text,
          opt.isCorrect ? 1 : 0,
          i
        );
        optionCount++;
      }
    }
  }
}
console.log(`Inserted ${optionCount} question options.`);

sqlite.close();
console.log('Database seeded successfully.');
