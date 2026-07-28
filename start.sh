#!/bin/sh
set -e

export DATABASE_URL="${DATABASE_URL:-dev.db}"

# Copy static assets for standalone mode
if [ -d ".next/standalone" ]; then
  cp -r public .next/standalone/public 2>/dev/null || true
  cp -r .next/static .next/standalone/.next/static 2>/dev/null || true
fi

# Push schema to DB (creates tables if missing)
echo "Pushing schema to $DATABASE_URL..."
npx drizzle-kit push --force

# Seed data if tables are empty
TABLE_COUNT=$(npx tsx -e "
  const Database = require('better-sqlite3').default;
  const db = new Database(process.env.DATABASE_URL || 'dev.db');
  const r = db.prepare(\"SELECT COUNT(*) as c FROM modules\").get();
  console.log(r.c);
  db.close();
" 2>/dev/null || echo "0")

if [ "$TABLE_COUNT" = "0" ]; then
  echo "Tables empty — seeding..."
  npx tsx scripts/seed-db.ts
else
  echo "Database has data ($TABLE_COUNT modules) — skipping seed."
fi

# Start with standalone server
echo "Starting Next.js..."
exec node .next/standalone/server.js
