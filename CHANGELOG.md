# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2026-07-30

### Added
- `/api/users/[userId]/profile` endpoint — aggregates user + badges + skillAreas + totalPoints
- `buildUserProfile()` aggregation library (`src/lib/user-profile.ts`) with 8 unit tests
- `/api/analytics` extended with `badgesEarned` and `streakDays` from DB
- 16 tests passing (8 dental-data + 8 user-profile)

### Fixed
- `useUserStore.fetchUser` now fetches `/api/users/[id]/profile` and sets both `user` and `profile` on success (was only setting `user`, leaving `profile` null on API path)
- `useAnalyticsStore.fetchAnalytics` now maps `badgesEarned` and `streakDays` from API (previously left as demo-only)
- AssessmentFlow `handleSubmit` now also POSTs to `/api/progress` for lesson completion tracking

### Added
- Project scaffold with Next.js 16, React 19, TypeScript 5
- Three.js + React Three Fiber 3D engine
- Zustand state management
- Tailwind CSS 4 styling
- Drizzle ORM with SQLite
- Vitest testing framework
- Full directory structure per architecture document
- ADR documents (001-007)
- ESLint + EditorConfig configuration
- GitHub repo with Git Flow branching
