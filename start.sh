#!/bin/sh
set -e

export DATABASE_URL="${DATABASE_URL:-dev.db}"

# Copy static assets for standalone mode
if [ -d ".next/standalone" ]; then
  cp -r public .next/standalone/public 2>/dev/null || true
  cp -r .next/static .next/standalone/.next/static 2>/dev/null || true
fi

# Seed database (creates tables + data if empty, skips if already seeded)
echo "Seeding database at $DATABASE_URL..."
npx tsx scripts/seed-db.ts

# Start with standalone server (bind to all interfaces for Railway)
echo "Starting Next.js..."
export HOSTNAME="0.0.0.0"
export PORT="${PORT:-8080}"
exec node .next/standalone/server.js
