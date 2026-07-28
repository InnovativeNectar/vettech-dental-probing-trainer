import Database from 'better-sqlite3';
import { TRAINING_MODULES } from '../src/lib/training-data';
import { CLINICAL_CASES } from '../src/lib/case-data';
import { ASSESSMENTS } from '../src/lib/assessment-data';

const dbPath = process.env.DATABASE_URL || require('path').resolve(process.cwd(), 'dev.db');
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = OFF');

// Create all tables (idempotent)
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS "users" (
    "id" text PRIMARY KEY NOT NULL,
    "email" text NOT NULL,
    "name" text NOT NULL,
    "role" text DEFAULT 'student' NOT NULL,
    "avatar_url" text,
    "institution" text,
    "created_at" integer NOT NULL,
    "updated_at" integer NOT NULL
  );
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique" ON "users" ("email");

  CREATE TABLE IF NOT EXISTS "modules" (
    "id" text PRIMARY KEY NOT NULL,
    "title" text NOT NULL,
    "description" text NOT NULL,
    "type" text NOT NULL,
    "difficulty" text NOT NULL,
    "lesson_count" integer NOT NULL,
    "estimated_minutes" integer NOT NULL,
    "required_modules" text,
    "thumbnail_url" text,
    "sort_order" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "lessons" (
    "id" text PRIMARY KEY NOT NULL,
    "module_id" text NOT NULL,
    "title" text NOT NULL,
    "description" text NOT NULL,
    "sort_order" integer NOT NULL,
    "objectives" text,
    "estimated_minutes" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "progress_records" (
    "id" text PRIMARY KEY NOT NULL,
    "user_id" text NOT NULL,
    "module_id" text NOT NULL,
    "lesson_id" text,
    "status" text DEFAULT 'not_started' NOT NULL,
    "score" real,
    "attempts" integer DEFAULT 0 NOT NULL,
    "best_score" real,
    "time_spent_seconds" integer DEFAULT 0 NOT NULL,
    "started_at" integer,
    "completed_at" integer
  );

  CREATE TABLE IF NOT EXISTS "dental_cases" (
    "id" text PRIMARY KEY NOT NULL,
    "title" text NOT NULL,
    "description" text NOT NULL,
    "species" text NOT NULL,
    "age_years" real NOT NULL,
    "breed" text NOT NULL,
    "presenting_complaint" text NOT NULL,
    "pathology_type" text NOT NULL,
    "severity" text NOT NULL,
    "affected_teeth" text,
    "diagnosis" text NOT NULL,
    "treatment_plan" text NOT NULL,
    "difficulty" text NOT NULL,
    "estimated_minutes" integer NOT NULL,
    "tags" text
  );

  CREATE TABLE IF NOT EXISTS "pathology_data" (
    "id" text PRIMARY KEY NOT NULL,
    "case_id" text NOT NULL,
    "tooth_number" integer NOT NULL,
    "location" text NOT NULL,
    "depth_mm" real NOT NULL,
    "bleeding_on_probing" integer DEFAULT 0 NOT NULL,
    "suppuration" integer DEFAULT 0 NOT NULL,
    "mobility" integer DEFAULT 0 NOT NULL,
    "furcation" integer
  );

  CREATE TABLE IF NOT EXISTS "case_attempts" (
    "id" text PRIMARY KEY NOT NULL,
    "case_id" text NOT NULL,
    "user_id" text NOT NULL,
    "diagnosis" text,
    "treatment_plan" text,
    "score" real,
    "completed_at" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "case_images" (
    "id" text PRIMARY KEY NOT NULL,
    "case_id" text NOT NULL,
    "url" text NOT NULL,
    "alt" text NOT NULL,
    "type" text NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "questions" (
    "id" text PRIMARY KEY NOT NULL,
    "assessment_id" text NOT NULL,
    "type" text NOT NULL,
    "content" text NOT NULL,
    "image_url" text,
    "correct_answer" text NOT NULL,
    "points" integer DEFAULT 1 NOT NULL,
    "explanation" text NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "question_options" (
    "id" text PRIMARY KEY NOT NULL,
    "question_id" text NOT NULL,
    "text" text NOT NULL,
    "is_correct" integer DEFAULT 0 NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "assessment_results" (
    "id" text PRIMARY KEY NOT NULL,
    "assessment_id" text NOT NULL,
    "user_id" text NOT NULL,
    "score" real NOT NULL,
    "passed" integer NOT NULL,
    "answers" text,
    "time_spent_seconds" integer NOT NULL,
    "started_at" integer NOT NULL,
    "completed_at" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "xapi_statements" (
    "id" text PRIMARY KEY NOT NULL,
    "actor_id" text NOT NULL,
    "verb" text NOT NULL,
    "object_id" text NOT NULL,
    "object_name" text,
    "result_score" real,
    "result_success" integer,
    "result_completion" integer,
    "result_duration" text,
    "context_extensions" text,
    "timestamp" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "badges" (
    "id" text PRIMARY KEY NOT NULL,
    "user_id" text NOT NULL,
    "name" text NOT NULL,
    "description" text NOT NULL,
    "icon_url" text,
    "earned_at" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "skill_areas" (
    "id" text PRIMARY KEY NOT NULL,
    "user_id" text NOT NULL,
    "name" text NOT NULL,
    "level" integer DEFAULT 1 NOT NULL,
    "xp" integer DEFAULT 0 NOT NULL,
    "max_xp" integer DEFAULT 100 NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "assessments_meta" (
    "id" text PRIMARY KEY NOT NULL,
    "title" text NOT NULL,
    "description" text,
    "type" text,
    "module_id" text,
    "time_limit_minutes" integer,
    "passing_score" integer,
    "max_attempts" integer
  );
`);
console.log('Tables ensured.');

// Check if already seeded
const existing = sqlite.prepare('SELECT COUNT(*) as c FROM modules').get() as { c: number };
if (existing.c > 0) {
  console.log(`Already seeded (${existing.c} modules). Skipping.`);
  sqlite.close();
  process.exit(0);
}

function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const now = new Date();
const ts = Math.floor(now.getTime() / 1000);

// Demo user
sqlite.prepare(
  `INSERT INTO users (id, email, name, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`
).run('user-001', 'demo@vettech.edu', 'Demo Student', 'student', ts, ts);
console.log('Inserted demo user.');

// Modules
const insertModule = sqlite.prepare(
  `INSERT INTO modules (id, title, description, type, difficulty, lesson_count, estimated_minutes, required_modules, sort_order)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
);
for (const mod of TRAINING_MODULES) {
  insertModule.run(
    mod.id, mod.title, mod.description, mod.type, mod.difficulty,
    mod.lessonCount, mod.estimatedMinutes, JSON.stringify(mod.requiredModules), mod.sortOrder
  );
}
console.log(`Inserted ${TRAINING_MODULES.length} modules.`);

// Lessons
const insertLesson = sqlite.prepare(
  `INSERT INTO lessons (id, module_id, title, description, sort_order, objectives, estimated_minutes)
   VALUES (?, ?, ?, ?, ?, ?, ?)`
);
let lessonCount = 0;
for (const mod of TRAINING_MODULES) {
  for (const lesson of mod.lessons) {
    insertLesson.run(
      lesson.id, lesson.moduleId, lesson.title, lesson.description,
      lesson.sortOrder, JSON.stringify(lesson.objectives), lesson.estimatedMinutes
    );
    lessonCount++;
  }
}
console.log(`Inserted ${lessonCount} lessons.`);

// Clinical cases
const insertCase = sqlite.prepare(
  `INSERT INTO dental_cases (id, title, description, species, age_years, breed, presenting_complaint, pathology_type, severity, affected_teeth, diagnosis, treatment_plan, difficulty, estimated_minutes, tags)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);
for (const c of CLINICAL_CASES) {
  insertCase.run(
    c.id, c.title, c.description, c.species, c.ageYears, c.breed,
    c.presentingComplaint, c.pathologyType, c.severity, JSON.stringify(c.affectedTeeth),
    c.diagnosis, c.treatmentPlan, c.difficulty, c.estimatedMinutes, JSON.stringify(c.tags)
  );
}
console.log(`Inserted ${CLINICAL_CASES.length} dental cases.`);

// Pathology data
const insertPathology = sqlite.prepare(
  `INSERT INTO pathology_data (id, case_id, tooth_number, location, depth_mm, bleeding_on_probing, suppuration, mobility, furcation)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
);
let pathCount = 0;
for (const c of CLINICAL_CASES) {
  for (const finding of c.probeFindings) {
    for (const [location, depth] of Object.entries(finding.locations)) {
      if (depth !== undefined) {
        insertPathology.run(
          uuid(), c.id, finding.toothNumber, location, depth,
          finding.bleedingOnProbing ? 1 : 0, finding.suppuration ? 1 : 0,
          finding.mobility ?? 0, finding.furcation ?? null
        );
        pathCount++;
      }
    }
  }
}
console.log(`Inserted ${pathCount} pathology rows.`);

// Assessment metadata
const insertAssessmentMeta = sqlite.prepare(
  `INSERT INTO assessments_meta (id, title, description, type, module_id, time_limit_minutes, passing_score, max_attempts)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
);
for (const a of ASSESSMENTS) {
  insertAssessmentMeta.run(
    a.id, a.title, a.description, a.type, a.moduleId ?? null,
    a.timeLimitMinutes, a.passingScore, a.maxAttempts ?? null
  );
}
console.log(`Inserted ${ASSESSMENTS.length} assessments.`);

// Questions
const insertQuestion = sqlite.prepare(
  `INSERT INTO questions (id, assessment_id, type, content, image_url, correct_answer, points, explanation, sort_order)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
);
let questionCount = 0;
for (const a of ASSESSMENTS) {
  for (let i = 0; i < a.questions.length; i++) {
    const q = a.questions[i];
    const correctAnswer = Array.isArray(q.correctAnswer) ? JSON.stringify(q.correctAnswer) : String(q.correctAnswer);
    insertQuestion.run(q.id, a.id, q.type, q.content, q.imageUrl ?? null, correctAnswer, q.points, q.explanation, i);
    questionCount++;
  }
}
console.log(`Inserted ${questionCount} questions.`);

// Question options
const insertOption = sqlite.prepare(
  `INSERT INTO question_options (id, question_id, text, is_correct, sort_order) VALUES (?, ?, ?, ?, ?)`
);
let optionCount = 0;
for (const a of ASSESSMENTS) {
  for (const q of a.questions) {
    if ('options' in q && q.options) {
      for (let i = 0; i < q.options.length; i++) {
        insertOption.run(`${q.id}-opt-${i}`, q.id, q.options[i].text, q.options[i].isCorrect ? 1 : 0, i);
        optionCount++;
      }
    }
  }
}
console.log(`Inserted ${optionCount} question options.`);

sqlite.close();
console.log('Database seeded successfully.');
