CREATE TABLE `assessment_results` (
	`id` text PRIMARY KEY NOT NULL,
	`assessment_id` text NOT NULL,
	`user_id` text NOT NULL,
	`score` real NOT NULL,
	`passed` integer NOT NULL,
	`answers` text,
	`time_spent_seconds` integer NOT NULL,
	`started_at` integer NOT NULL,
	`completed_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `badges` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`icon_url` text,
	`earned_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `case_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`user_id` text NOT NULL,
	`diagnosis` text,
	`treatment_plan` text,
	`score` real,
	`completed_at` integer NOT NULL,
	FOREIGN KEY (`case_id`) REFERENCES `dental_cases`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `case_images` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`url` text NOT NULL,
	`alt` text NOT NULL,
	`type` text NOT NULL,
	FOREIGN KEY (`case_id`) REFERENCES `dental_cases`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `dental_cases` (
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
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` text PRIMARY KEY NOT NULL,
	`module_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`sort_order` integer NOT NULL,
	`objectives` text,
	`estimated_minutes` integer NOT NULL,
	FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `modules` (
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
--> statement-breakpoint
CREATE TABLE `pathology_data` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`tooth_number` integer NOT NULL,
	`location` text NOT NULL,
	`depth_mm` real NOT NULL,
	`bleeding_on_probing` integer DEFAULT false NOT NULL,
	`suppuration` integer DEFAULT false NOT NULL,
	`mobility` integer DEFAULT 0 NOT NULL,
	`furcation` integer,
	FOREIGN KEY (`case_id`) REFERENCES `dental_cases`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `progress_records` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`module_id` text NOT NULL,
	`lesson_id` text,
	`status` text DEFAULT 'not_started' NOT NULL,
	`score` real,
	`attempts` integer DEFAULT 0 NOT NULL,
	`best_score` real,
	`time_spent_seconds` integer DEFAULT 0 NOT NULL,
	`started_at` integer,
	`completed_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `question_options` (
	`id` text PRIMARY KEY NOT NULL,
	`question_id` text NOT NULL,
	`text` text NOT NULL,
	`is_correct` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`assessment_id` text NOT NULL,
	`type` text NOT NULL,
	`content` text NOT NULL,
	`image_url` text,
	`correct_answer` text NOT NULL,
	`points` integer DEFAULT 1 NOT NULL,
	`explanation` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `skill_areas` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`xp` integer DEFAULT 0 NOT NULL,
	`max_xp` integer DEFAULT 100 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'student' NOT NULL,
	`avatar_url` text,
	`institution` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `xapi_statements` (
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
	FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
