# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-07-29

### Changed
- PracticeMode now manages species/age group state internally — buttons actually switch the 3D scene
- Scene component accepts `species` and `ageGroup` props for multi-species support
- `generateArchPositions` now accepts tooth numbers array instead of hardcoding dog teeth
- Added `getTeethForSpecies()` helper for all species/age group combinations

### Added
- Ruflo hooks init (HNSW intelligence, PreToolUse/PostToolUse/SessionStart/SessionEnd hooks)

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
