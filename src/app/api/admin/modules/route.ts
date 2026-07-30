import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { modules } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(_request: Request) {
  try {
    const db = await getDb();
    if (!db) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    const all = await db.select().from(modules);
    return NextResponse.json(all);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    if (!db) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    const body = await request.json();
    const { title, description, difficulty, xpReward, lessonCount, estimatedMinutes, sortOrder } = body as {
      title?: string;
      description?: string;
      difficulty?: string;
      xpReward?: number;
      lessonCount?: number;
      estimatedMinutes?: number;
      sortOrder?: number;
    };

    if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 });

    const validDifficulties = ['beginner', 'intermediate', 'advanced', 'clinical'] as const;
    const safeDifficulty = difficulty && validDifficulties.includes(difficulty as typeof validDifficulties[number])
      ? (difficulty as typeof validDifficulties[number])
      : 'intermediate';

    const now = new Date();
    const id = `mod-${Date.now()}`;

    await db.insert(modules).values({
      id,
      title,
      description: description ?? '',
      type: 'orientation',
      difficulty: safeDifficulty as 'beginner' | 'intermediate' | 'advanced' | 'clinical',
      lessonCount: lessonCount ?? 1,
      estimatedMinutes: estimatedMinutes ?? 30,
      requiredModules: null,
      thumbnailUrl: null,
      sortOrder: sortOrder ?? 0,
    });

    return NextResponse.json({ id, title, description, difficulty: safeDifficulty, createdAt: now }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create module' }, { status: 500 });
  }
}