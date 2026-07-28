#!/bin/sh
set -e

# Seed database if it doesn't exist (first boot or after deploy)
DB_PATH="${DATABASE_URL:-dev.db}"
if [ ! -f "$DB_PATH" ]; then
  echo "Database not found at $DB_PATH — seeding..."
  npx tsx scripts/seed-db.ts
else
  echo "Database exists at $DB_PATH — skipping seed."
fi

# Start the app
exec npm run start
