# ADR-006: Data Layer and Persistence

**Status:** Proposed
**Date:** 2026-07-28
**Deciders:** Vettech Dental Probing Trainer development team

## Context

The application needs persistent storage for user accounts, training progress, assessment scores, session history, and adaptive difficulty state. We need a data layer that supports fast local development, scales to production with concurrent users, and integrates type-safely with our TypeScript stack.

## Decision

We will use **SQLite (better-sqlite3) for development and local use, PostgreSQL for production, with Drizzle ORM for type-safe queries**.

- **SQLite (better-sqlite3):** File-based database for zero-config local development and single-user desktop usage.
- **PostgreSQL:** Production database for multi-user deployments with concurrent access.
- **Drizzle ORM:** Lightweight, type-safe ORM that supports both SQLite and PostgreSQL backends, enabling schema reuse across environments.

## Consequences

### Positive
- Zero-config local development — no database server setup required; SQLite database file is created on first run
- Easy migration path to PostgreSQL — Drizzle ORM abstracts the database driver, allowing a single schema definition for both backends
- Drizzle is lightweight and fast — minimal overhead compared to heavier ORMs like Prisma
- Type-safe queries generated from schema definitions reduce runtime errors
- SQLite is ideal for offline/local-first scenarios where students may train without internet access

### Negative
- SQLite does not support concurrent writes, limiting production scalability without migration to PostgreSQL
- Drizzle ORM is a newer project with a smaller community and fewer tutorials/resources than Prisma
- Schema changes require migration scripts for both SQLite and PostgreSQL, though Drizzle's migration tooling helps
- better-sqlite3 is a native Node.js module, requiring build tools for platform-specific binaries

### Risks
- SQLite-to-PostgreSQL migration may surface subtle SQL dialect differences (e.g., date functions, boolean handling)
- Drizzle ORM's rapid development pace means API changes between versions may require schema/query updates
- better-sqlite3 native module may cause issues in some deployment environments (serverless, containers without native build tools)
