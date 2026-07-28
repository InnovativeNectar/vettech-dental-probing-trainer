import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { dentalCases } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const database = getDb();
    if (!database) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const { searchParams } = new URL(request.url);
    const species = searchParams.get('species');
    const difficulty = searchParams.get('difficulty');

    const conditions = [];
    if (species === 'canine' || species === 'feline') {
      conditions.push(eq(dentalCases.species, species as 'canine' | 'feline'));
    }
    if (difficulty === 'beginner' || difficulty === 'intermediate' || difficulty === 'advanced') {
      conditions.push(eq(dentalCases.difficulty, difficulty as 'beginner' | 'intermediate' | 'advanced'));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const rows = await database.select().from(dentalCases).where(where);

    const result = rows.map((r) => ({
      ...r,
      affectedTeeth: r.affectedTeeth ? JSON.parse(r.affectedTeeth) : [],
      tags: r.tags ? JSON.parse(r.tags) : [],
    }));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 });
  }
}
