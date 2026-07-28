import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role', { enum: ['student', 'instructor', 'admin'] }).notNull().default('student'),
  avatarUrl: text('avatar_url'),
  institution: text('institution'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const modules = sqliteTable('modules', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: text('type', {
    enum: ['orientation', 'numbering', 'technique', 'measurement', 'pathology', 'charting', 'decision'],
  }).notNull(),
  difficulty: text('difficulty', {
    enum: ['beginner', 'intermediate', 'advanced', 'clinical'],
  }).notNull(),
  lessonCount: integer('lesson_count').notNull(),
  estimatedMinutes: integer('estimated_minutes').notNull(),
  requiredModules: text('required_modules'), // JSON array of module IDs
  thumbnailUrl: text('thumbnail_url'),
  sortOrder: integer('sort_order').notNull(),
});

export const progressRecords = sqliteTable('progress_records', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  moduleId: text('module_id').notNull().references(() => modules.id),
  lessonId: text('lesson_id'),
  status: text('status', {
    enum: ['not_started', 'in_progress', 'completed'],
  }).notNull().default('not_started'),
  score: real('score'),
  attempts: integer('attempts').notNull().default(0),
  bestScore: real('best_score'),
  timeSpentSeconds: integer('time_spent_seconds').notNull().default(0),
  startedAt: integer('started_at', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
});

export const assessmentResults = sqliteTable('assessment_results', {
  id: text('id').primaryKey(),
  assessmentId: text('assessment_id').notNull(),
  userId: text('user_id').notNull().references(() => users.id),
  score: real('score').notNull(),
  passed: integer('passed', { mode: 'boolean' }).notNull(),
  answers: text('answers'), // JSON
  timeSpentSeconds: integer('time_spent_seconds').notNull(),
  startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
  completedAt: integer('completed_at', { mode: 'timestamp' }).notNull(),
});

export const xapiStatements = sqliteTable('xapi_statements', {
  id: text('id').primaryKey(),
  actorId: text('actor_id').notNull().references(() => users.id),
  verb: text('verb').notNull(),
  objectId: text('object_id').notNull(),
  objectName: text('object_name'),
  resultScore: real('result_score'),
  resultSuccess: integer('result_success', { mode: 'boolean' }),
  resultCompletion: integer('result_completion', { mode: 'boolean' }),
  resultDuration: text('result_duration'),
  contextExtensions: text('context_extensions'), // JSON
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
});

export const dentalCases = sqliteTable('dental_cases', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  species: text('species', { enum: ['canine', 'feline'] }).notNull(),
  ageYears: real('age_years').notNull(),
  breed: text('breed').notNull(),
  presentingComplaint: text('presenting_complaint').notNull(),
  pathologyType: text('pathology_type').notNull(),
  severity: text('severity', { enum: ['mild', 'moderate', 'severe'] }).notNull(),
  affectedTeeth: text('affected_teeth'), // JSON array
  diagnosis: text('diagnosis').notNull(),
  treatmentPlan: text('treatment_plan').notNull(),
  difficulty: text('difficulty', { enum: ['beginner', 'intermediate', 'advanced'] }).notNull(),
  estimatedMinutes: integer('estimated_minutes').notNull(),
  tags: text('tags'), // JSON array
});

export const pathologyData = sqliteTable('pathology_data', {
  id: text('id').primaryKey(),
  caseId: text('case_id').notNull().references(() => dentalCases.id),
  toothNumber: integer('tooth_number').notNull(),
  location: text('location').notNull(),
  depthMm: real('depth_mm').notNull(),
  bleedingOnProbing: integer('bleeding_on_probing', { mode: 'boolean' }).notNull().default(false),
  suppuration: integer('suppuration', { mode: 'boolean' }).notNull().default(false),
  mobility: integer('mobility').notNull().default(0),
  furcation: integer('furcation'),
});

export const lessons = sqliteTable('lessons', {
  id: text('id').primaryKey(),
  moduleId: text('module_id').notNull().references(() => modules.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  sortOrder: integer('sort_order').notNull(),
  objectives: text('objectives'),
  estimatedMinutes: integer('estimated_minutes').notNull(),
});

export const questions = sqliteTable('questions', {
  id: text('id').primaryKey(),
  assessmentId: text('assessment_id').notNull(),
  type: text('type', {
    enum: ['multiple_choice', 'image_identification', 'probe_simulation', 'charting', 'free_text'],
  }).notNull(),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  correctAnswer: text('correct_answer').notNull(),
  points: integer('points').notNull().default(1),
  explanation: text('explanation').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const questionOptions = sqliteTable('question_options', {
  id: text('id').primaryKey(),
  questionId: text('question_id').notNull().references(() => questions.id),
  text: text('text').notNull(),
  isCorrect: integer('is_correct', { mode: 'boolean' }).notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const caseAttempts = sqliteTable('case_attempts', {
  id: text('id').primaryKey(),
  caseId: text('case_id').notNull().references(() => dentalCases.id),
  userId: text('user_id').notNull().references(() => users.id),
  diagnosis: text('diagnosis'),
  treatmentPlan: text('treatment_plan'),
  score: real('score'),
  completedAt: integer('completed_at', { mode: 'timestamp' }).notNull(),
});

export const caseImages = sqliteTable('case_images', {
  id: text('id').primaryKey(),
  caseId: text('case_id').notNull().references(() => dentalCases.id),
  url: text('url').notNull(),
  alt: text('alt').notNull(),
  type: text('type', { enum: ['clinical_photo', 'radiograph', 'diagram'] }).notNull(),
});

export const badges = sqliteTable('badges', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description').notNull(),
  iconUrl: text('icon_url'),
  earnedAt: integer('earned_at', { mode: 'timestamp' }).notNull(),
});

export const skillAreas = sqliteTable('skill_areas', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  level: integer('level').notNull().default(1),
  xp: integer('xp').notNull().default(0),
  maxXp: integer('max_xp').notNull().default(100),
});
