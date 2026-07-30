import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { modules } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const db = await getDb();
    if (!db) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    const { moduleId } = await params;
    const body = await request.json();
    const { title, description, difficulty, xpReward, lessonCount, estimatedMinutes } = body as {
      title?: string;
      description?: string;
      difficulty?: string;
      xpReward?: number;
      lessonCount?: number;
      estimatedMinutes?: number;
    };

    const [existing] = await db.select().from(modules).where(eq(modules.id, moduleId));
    if (!existing) return NextResponse.json({ error: 'Module not found' }, { status: 404 });

    const validDifficulties = ['beginner', 'intermediate', 'advanced', 'clinical'];
    const safeDifficulty = difficulty && validDifficulties.includes(difficulty) ? difficulty : existing.difficulty;

    await db.update(modules).set({
      title: title ?? existing.title,
      description: description ?? existing.description,
      difficulty: safeDifficulty as typeof existing.difficulty,
      lessonCount: lessonCount ?? existing.lessonCount,
      estimatedMinutes: estimatedMinutes ?? existing.estimatedMinutes,
    }).where(eq(modules.id, moduleId));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update module' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const db = await getDb();
    if (!db) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    const { moduleId } = await params;
    await db.delete(modules).where(eq(modules.id, moduleId));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 });
  }
}