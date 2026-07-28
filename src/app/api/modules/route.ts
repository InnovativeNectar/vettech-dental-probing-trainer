import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { modules } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db.select().from(modules).orderBy(asc(modules.sortOrder));
    const result = rows.map((r) => ({
      ...r,
      requiredModules: r.requiredModules ? JSON.parse(r.requiredModules) : [],
    }));
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 });
  }
}
