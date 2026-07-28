# VetTech Dental Probing Trainer

Interactive 3D dental probing simulation for veterinary technician education. Practice periodontal probing on realistic 3D tooth models with guided training modules, clinical case simulations, and progress tracking.

**Live:** [Deploy on Railway](#deployment) · **Docs:** [Architecture Decision Records](./docs/adr/)

---

## Features

### 3D Simulation Engine
- Interactive 3D tooth models rendered with React Three Fiber + Three.js
- Real-time probe physics with custom raycasting and collision detection
- Periodontal sulcus visualization with pocket depth feedback
- Multi-species support: canine (adult 42 / puppy 28 teeth) and feline (adult 30 / kitten 26 teeth)

### Training Modules
- **Module 1:** Dental Anatomy Orientation — tooth numbering, positions, Modified Triadan System
- **Module 2:** Probing Technique — probe handling, angle control, proper insertion
- **Module 3:** Depth Measurement — reading pocket depths, recognizing normal vs. abnormal
- **Module 4:** Chart Recording — documenting findings, treatment planning basics
- Guided lesson steps with tooth highlighting, success/failure feedback, and hints

### Clinical Cases
- Multi-case library with species, difficulty, and pathology tagging
- Real-time probing data capture during case attempts
- Graded assessments with diagnosis and treatment plan submission

### Assessment System
- Knowledge checks and practical assessments with timed questions
- Multiple question types: MCQ, image-based, scenario analysis
- Automatic scoring with pass/fail thresholds and detailed explanations
- Question bank with difficulty levels and topic categorization

### Dashboard & Analytics
- Interactive charts: performance over time, session frequency, progress trends
- Skill area breakdown (probe handling, depth measurement, charting, anatomy, pathology, species awareness, communication)
- Streak tracking and time-spent analysis
- Badge system with 12 achievement badges across bronze/silver/gold tiers
- XP and leveling system

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript 5 |
| 3D Engine | [Three.js](https://threejs.org/) + [React Three Fiber](https://r3f.docs.pmnd.rs/) + [Drei](https://drei.docs.pmnd.rs/) |
| State | [Zustand](https://zustand-demo.pmnd.rs/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Database | SQLite via [Drizzle ORM](https://orm.drizzle.team/) |
| Testing | [Vitest](https://vitest.dev/) + Testing Library |
| Deployment | [Railway](https://railway.app/) (Nixpacks) |

---

## Getting Started

### Prerequisites
- Node.js 20.9+
- npm 10+

### Install & Run

```bash
git clone https://github.com/InnovativeNectar/vettech-dental-probing-trainer.git
cd vettech-dental-probing-trainer
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type check |
| `npm run test` | Run Vitest tests |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Drizzle Studio |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # REST API routes
│   ├── dashboard/          # Dashboard & analytics
│   ├── training/           # Training module pages
│   ├── cases/              # Clinical case pages
│   ├── assessment/         # Assessment pages
│   └── admin/              # Admin panel (Phase 6)
├── components/
│   ├── 3d/                 # Three.js scene components
│   │   ├── Scene.tsx       # Canvas + physics provider
│   │   ├── Tooth.tsx       # Individual tooth model
│   │   ├── Probe.tsx       # Interactive probe tool
│   │   └── Sulcus.tsx      # Periodontal pocket visualization
│   ├── training/           # Training session UI
│   ├── cases/              # Case viewer & assessment
│   ├── assessment/         # Quiz engine & question renderer
│   ├── dashboard/          # Charts, stats, badges
│   └── ui/                 # Design system (Button, Card, Dialog, etc.)
├── stores/                 # Zustand state management
├── lib/
│   ├── db/                 # Drizzle ORM schema + connection
│   ├── dental-data.ts      # Tooth names, species configs
│   ├── training-data.ts    # Training modules, lessons, steps
│   ├── assessment-data.ts  # Assessment questions
│   ├── assessment-engine.ts # Grading logic
│   ├── gamification.ts     # Badges, XP, skill areas
│   └── utils.ts            # Utility functions
└── types/                  # TypeScript type definitions
```

---

## 3D Models

Models are sourced from open-source anatomical scans:
- **Cults3d** — Dog jaw STLs (custom additions for sulcus geometry)
- **Sketchfab** — Cat jaw models (CC license)

### Supported Species & Tooth Counts

| Species | Age | Teeth | Model Location |
|---------|-----|-------|---------------|
| Dog | Adult | 42 | `public/models/adult-dog/` |
| Dog | Puppy | 28 | `public/models/puppy/` |
| Cat | Adult | 30 | `public/models/adult-cat/` |
| Kitten | Kitten | 26 | `public/models/kitten/` |

Supported formats: GLB, GLTF. Convert STL to GLTF with `scripts/convert-models.ts`.

---

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check + DB status |
| `GET` | `/api/modules` | List training modules |
| `GET` | `/api/modules/:id` | Module detail + lessons |
| `GET` | `/api/cases` | List clinical cases |
| `GET` | `/api/cases/:id` | Case detail + pathology |
| `GET/POST` | `/api/cases/:id/attempts` | Case attempt history |
| `GET` | `/api/assessments` | List assessments |
| `GET` | `/api/assessments/:id` | Assessment questions |
| `GET/POST` | `/api/assessments/:id/attempts` | Assessment results |
| `GET/POST` | `/api/progress` | User progress records |

---

## Deployment (Railway)

1. Connect the GitHub repo to Railway
2. Set environment variables:
   ```
   NEXTAUTH_SECRET=<generate-a-strong-secret>
   NEXTAUTH_URL=https://your-app.up.railway.app
   ```
3. Railway auto-detects the Nixpacks buildpack
4. Build runs `npm run build` → start runs `npm run start`
5. Health check at `/api/health`

The app works without a database — API routes return 503 when SQLite is unavailable (serverless environments).

---

## Architecture

Decision records live in [`docs/adr/`](./docs/adr/):

| ADR | Decision |
|-----|----------|
| [001](docs/adr/001-tech-stack.md) | Next.js 16 + React 19 + TypeScript 5 |
| [002](docs/adr/002-3d-engine.md) | React Three Fiber for 3D rendering |
| [003](docs/adr/003-probe-physics.md) | Custom raycasting + simplified collision |
| [004](docs/adr/004-adaptive-difficulty.md) | Adaptive difficulty system |
| [005](docs/adr/005-asset-pipeline.md) | 3D model pipeline & optimization |
| [006](docs/adr/006-data-layer.md) | SQLite + Drizzle ORM data layer |
| [007](docs/adr/007-xapi-integration.md) | xAPI / Learning Record Store integration |

---

## Roadmap

- [x] Phase 0: Project scaffold
- [x] Phase 1: 3D engine + probe interaction
- [x] Phase 2: Training modules + guided lessons
- [x] Phase 3: Clinical cases + assessment engine
- [x] Phase 4: Data layer + API routes
- [x] Phase 5: Dashboard + gamification
- [ ] Phase 6: Admin panel + instructor tools
- [ ] Phase 7: xAPI LRS integration
- [ ] Phase 8: Multi-user auth + session management

---

## License

[MIT](./LICENSE)

---

Built by [Innovative Nectar](https://github.com/InnovativeNectar) — empowering veterinary education through interactive simulation.
