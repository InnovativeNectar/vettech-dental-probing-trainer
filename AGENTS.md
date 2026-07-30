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
- **Database:** SQLite (Drizzle ORM) on Railway persistent volume
- **Testing:** Vitest + Testing Library
- **CI/CD:** GitHub Actions → Railway auto-deploy
- **Hosting:** Railway (production environment)

## Branching & Deployment Strategy

### Branches

| Branch | Purpose | Deploys to |
|--------|---------|------------|
| `main` | Production-ready code | Railway production (via auto-deploy) |
| `develop` | Integration branch for active dev | Railway production (via auto-deploy) |
| `feature/*` | New features, branch off `develop` | Never |
| `hotfix/*` | Urgent fixes, branch off `main` | Never |
| `release/*` | Release candidates, branch off `develop`, merge to `main` | Never |

### Workflow

1. **Develop:** Branch `feature/*` from `develop`. PR back to `develop` when ready.
2. **CI:** Every push/PR to `develop`/`main` runs `typecheck → lint → build → test`.
3. **Deploy (develop):** Merges to `develop` auto-deploy to Railway production (preview).
4. **Release:** Merge `develop` → `main`. The Release workflow creates a GitHub Release with tag `v<version>`.
5. **Deploy (main):** Railway auto-deploys `main` to production.
6. **Hotfix:** Branch `hotfix/*` from `main`, fix, PR to both `main` and `develop`.

### Versioning

Semantic versioning (`major.minor.patch`) in `package.json`. Update before merging to `main`. The `ci` workflow runs for EVERY push/PR to catch issues early regardless of branch.

### Database Persistence

- SQLite file lives on a **Railway persistent volume** at `/data/app.db`
- `DATABASE_URL=/data/app.db` (set as Railway env var)
- The `seed-db.ts` script is idempotent — creates tables on first run, skips if data exists
- **Deploys do not wipe user data** thanks to the persistent volume
- The seed script runs in `start.sh` on every deploy (safe — skips if already seeded)

### Recovery

- **Rollback:** Redeploy a previous deployment from Railway dashboard
- **Code revert:** `git revert` or use Railway's rollback
- **DB backup:** Download via `railway volume files download /data/app.db ./backup.db`

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
