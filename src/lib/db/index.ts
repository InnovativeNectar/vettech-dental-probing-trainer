import * as schema from './schema';

type Schema = typeof schema;
type DrizzleDb = ReturnType<typeof import('drizzle-orm/better-sqlite3').drizzle<Schema>>;

let _db: DrizzleDb | null | undefined;

export function getDb(): DrizzleDb | null {
  if (_db !== undefined) return _db;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
    let Database = require('better-sqlite3').default ?? require('better-sqlite3');
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
    const { drizzle } = require('drizzle-orm/better-sqlite3');
    const dbPath = process.env.DATABASE_URL || require('path').resolve(process.cwd(), 'dev.db');
    console.log(`[db] Opening database at: ${dbPath} (cwd=${process.cwd()})`);
    const sqlite = new Database(dbPath);
    _db = drizzle(sqlite, { schema });
    console.log('[db] Database connected successfully.');
  } catch (err) {
    console.error('[db] Failed to connect:', err instanceof Error ? err.message : err);
    _db = null;
  }
  return _db ?? null;
}

/** Throws if DB not available — use getDb() for graceful checks */
export function requireDb(): DrizzleDb {
  const database = getDb();
  if (!database) throw new Error('Database not available in this environment');
  return database;
}
