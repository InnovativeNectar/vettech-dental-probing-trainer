import * as schema from './schema';

type Schema = typeof schema;
type DrizzleDb = ReturnType<typeof import('drizzle-orm/better-sqlite3').drizzle<Schema>>;

let _db: DrizzleDb | null | undefined;

export async function getDb(): Promise<DrizzleDb | null> {
  if (_db !== undefined) return _db;
  try {
    const { default: Database } = await import('better-sqlite3');
    const { drizzle } = await import('drizzle-orm/better-sqlite3');
    const pathMod = await import('path');
    const dbPath = process.env.DATABASE_URL || pathMod.default.resolve(process.cwd(), 'dev.db');
    const sqlite = new Database(dbPath);
    _db = drizzle(sqlite, { schema });
  } catch {
    _db = null;
  }
  return _db ?? null;
}

/** Throws if DB not available — use getDb() for graceful checks */
export async function requireDb(): Promise<DrizzleDb> {
  const database = await getDb();
  if (!database) throw new Error('Database not available in this environment');
  return database;
}
