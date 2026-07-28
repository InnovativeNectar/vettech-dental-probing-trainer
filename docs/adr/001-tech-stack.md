# ADR-001: Tech Stack Selection

**Status:** Accepted
**Date:** 2026-07-28
**Deciders:** Vettech Dental Probing Trainer development team

## Context

We need a modern web stack for a 3D interactive training application that teaches dental students periodontal probing techniques. The application must be performant, type-safe, and support real-time 3D rendering while maintaining good developer experience for rapid iteration.

## Decision

We will use **Next.js 16 (App Router) + TypeScript 5 + Tailwind CSS 4 + Zustand + Drizzle ORM + SQLite**.

- **Next.js 16 (App Router):** Server-side rendering capabilities, file-based routing, and strong ecosystem support.
- **TypeScript 5:** Full type safety across the codebase, improved DX with modern TS features.
- **Tailwind CSS 4:** Utility-first styling for rapid UI development without component library lock-in.
- **Zustand:** Lightweight state management for application and 3D scene state.
- **Drizzle ORM + SQLite:** Type-safe database queries with zero-config local development; SQLite for dev/local, PostgreSQL for production.

## Consequences

### Positive
- Modern developer experience with hot reload, strong type safety, and rapid iteration
- Single language (TypeScript) across frontend, backend, and database layer
- Zustand provides simple, unobtrusive state management without boilerplate
- SQLite enables zero-config local development — no external database setup required
- Drizzle ORM offers lightweight, fast queries with easy migration to PostgreSQL
- Next.js 16 App Router provides excellent streaming and server component support

### Negative
- Next.js 16 has breaking changes compared to older versions, requiring careful migration if upgrading from a prior Next.js project
- SQLite is not suitable for production deployments with concurrent users; PostgreSQL migration required for production
- Tailwind CSS 4 uses a new configuration format that differs from v3

### Risks
- Next.js 16 is relatively new; community tooling and documentation may lag behind stable releases
- SQLite file-based storage may cause issues in serverless deployment environments
- Drizzle ORM is newer than Prisma; smaller community and fewer third-party integrations
