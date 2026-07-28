#!/bin/sh
set -e

# Use absolute path for database so both seed and server see the same file
export DATABASE_URL="${DATABASE_URL:-$(pwd)/dev.db}"

# Copy static assets for standalone mode
if [ -d ".next/standalone" ]; then
  cp -r public .next/standalone/public 2>/dev/null || true
  cp -r .next/static .next/standalone/.next/static 2>/dev/null || true
fi

# Copy better-sqlite3 native module to standalone node_modules
if [ -d ".next/standalone/node_modules" ]; then
  mkdir -p .next/standalone/node_modules/better-sqlite3
  cp -r node_modules/better-sqlite3/* .next/standalone/node_modules/better-sqlite3/ 2>/dev/null || true
  mkdir -p .next/standalone/node_modules/node-gyp-build
  cp -r node_modules/node-gyp-build/* .next/standalone/node_modules/node-gyp-build/ 2>/dev/null || true
  echo "Copied better-sqlite3 native module to standalone."
fi

# Seed database (creates tables + data if empty, skips if already seeded)
echo "Seeding database at $DATABASE_URL..."
npx tsx scripts/seed-db.ts

# Start with standalone server (bind to all interfaces for Railway)
echo "Starting Next.js..."
export HOSTNAME="0.0.0.0"
export PORT="${PORT:-8080}"
exec node .next/standalone/server.js
