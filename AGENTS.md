# AGENTS.md — VetTech Dental Probing Trainer

## Project Overview

Interactive 3D dental probing simulation for veterinary technician education. Built with Next.js 16, React Three Fiber, and TypeScript.

## Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run test         # Run tests
npm run lint         # Lint code
npm run typecheck    # Type check
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **3D Engine:** Three.js + React Three Fiber + Drei
- **State:** Zustand
- **Styling:** Tailwind CSS 4
- **Database:** SQLite (Drizzle ORM)
- **Testing:** Vitest + Testing Library
- **Branching:** Git Flow (main, develop, feature/*, release/*, hotfix/*)

## Directory Structure

```
src/
├── app/            # Next.js App Router pages + API routes
├── components/     # React components
│   ├── ui/         # Design system primitives
│   ├── 3d/         # Three.js/R3F 3D scene components
│   ├── training/   # Training module components
│   ├── dashboard/  # Dashboard analytics components
│   ├── cases/      # Clinical case components
│   ├── assessment/ # Assessment components
│   └── layout/     # Layout shell components
├── stores/         # Zustand state stores
├── lib/            # Utilities, DB, physics engine, constants
├── types/          # TypeScript type definitions
└── hooks/          # Custom React hooks
```

## Conventions

- Use `@/` path alias for imports from `src/`
- Components use default exports for pages, named exports for utilities
- Zustand stores follow `use[Entity]Store.ts` naming
- Tests live alongside source in `tests/` with matching names
- ADR documents in `docs/adr/`

## Commands

| Command | What |
|---------|------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Run tests |
| `npm run lint` | Lint code |
| `npm run typecheck` | TypeScript check |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed database |

## 3D Assets

Models go in `public/models/` organized by species:
- `adult-dog/` (42 teeth)
- `puppy/` (28 teeth)
- `adult-cat/` (30 teeth)
- `kitten/` (26 teeth)

Supported formats: GLB, GLTF. Convert STL to GLTF with `scripts/convert-models.ts`.
