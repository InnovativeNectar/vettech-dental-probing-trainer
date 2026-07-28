CREATE TABLE IF NOT EXISTS `users` (
  `id` text PRIMARY KEY NOT NULL,
  `email` text NOT NULL,
  `name` text NOT NULL,
  `role` text NOT NULL DEFAULT 'student',
  `avatar_url` text,
  `institution` text,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);

CREATE TABLE IF NOT EXISTS `modules` (
  `id` text PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `type` text NOT NULL,
  `difficulty` text NOT NULL,
  `lesson_count` integer NOT NULL,
  `estimated_minutes` integer NOT NULL,
  `required_modules` text,
  `thumbnail_url` text,
  `sort_order` integer NOT NULL
);

CREATE TABLE IF NOT EXISTS `progress_records` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `module_id` text NOT NULL,
  `lesson_id` text,
  `status` text NOT NULL DEFAULT 'not_started',
  `score` real,
  `attempts` integer NOT NULL DEFAULT 0,
  `best_score` real,
  `time_spent_seconds` integer NOT NULL DEFAULT 0,
  `started_at` integer,
  `completed_at` integer,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`)
);

CREATE TABLE IF NOT EXISTS `assessment_results` (
  `id` text PRIMARY KEY NOT NULL,
  `assessment_id` text NOT NULL,
  `user_id` text NOT NULL,
  `score` real NOT NULL,
  `passed` integer NOT NULL,
  `answers` text,
  `time_spent_seconds` integer NOT NULL,
  `started_at` integer NOT NULL,
  `completed_at` integer NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

CREATE TABLE IF NOT EXISTS `xapi_statements` (
  `id` text PRIMARY KEY NOT NULL,
  `actor_id` text NOT NULL,
  `verb` text NOT NULL,
  `object_id` text NOT NULL,
  `object_name` text,
  `result_score` real,
  `result_success` integer,
  `result_completion` integer,
  `result_duration` text,
  `context_extensions` text,
  `timestamp` integer NOT NULL,
  FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`)
);

CREATE TABLE IF NOT EXISTS `dental_cases` (
  `id` text PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `species` text NOT NULL,
  `age_years` real NOT NULL,
  `breed` text NOT NULL,
  `presenting_complaint` text NOT NULL,
  `pathology_type` text NOT NULL,
  `severity` text NOT NULL,
  `affected_teeth` text,
  `diagnosis` text NOT NULL,
  `treatment_plan` text NOT NULL,
  `difficulty` text NOT NULL,
  `estimated_minutes` integer NOT NULL,
  `tags` text
);

CREATE TABLE IF NOT EXISTS `pathology_data` (
  `id` text PRIMARY KEY NOT NULL,
  `case_id` text NOT NULL,
  `tooth_number` integer NOT NULL,
  `location` text NOT NULL,
  `depth_mm` real NOT NULL,
  `bleeding_on_probing` integer NOT NULL DEFAULT 0,
  `suppuration` integer NOT NULL DEFAULT 0,
  `mobility` integer NOT NULL DEFAULT 0,
  `furcation` integer,
  FOREIGN KEY (`case_id`) REFERENCES `dental_cases`(`id`)
);
