import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { progressRecords } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const database = getDb();
    if (!database) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const where = userId ? eq(progressRecords.userId, userId) : undefined;
    const rows = await database.select().from(progressRecords).where(where);
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const database = getDb();
    if (!database) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const body = await request.json();
    const { userId, moduleId, lessonId, status, score, timeSpentSeconds } = body;

    if (!userId || !moduleId || !status) {
      return NextResponse.json(
        { error: 'userId, moduleId, and status are required' },
        { status: 400 }
      );
    }

    const now = new Date();

    // Check for existing progress record
    const conditions = [
      eq(progressRecords.userId, userId),
      eq(progressRecords.moduleId, moduleId),
    ];
    if (lessonId) {
      conditions.push(eq(progressRecords.lessonId, lessonId));
    }

    const [existing] = await database
      .select()
      .from(progressRecords)
      .where(and(...conditions));

    if (existing) {
      await database
        .update(progressRecords)
        .set({
          status,
          score: score ?? existing.score,
          timeSpentSeconds: timeSpentSeconds
            ? existing.timeSpentSeconds + timeSpentSeconds
            : existing.timeSpentSeconds,
          completedAt: status === 'completed' ? now : existing.completedAt,
        })
        .where(eq(progressRecords.id, existing.id));

      return NextResponse.json({ id: existing.id, status: 'updated' });
    }

    const id = `progress-${Date.now()}`;
    await database.insert(progressRecords).values({
      id,
      userId,
      moduleId,
      lessonId: lessonId ?? null,
      status,
      score: score ?? null,
      timeSpentSeconds: timeSpentSeconds ?? 0,
      startedAt: now,
      completedAt: status === 'completed' ? now : null,
    });

    return NextResponse.json({ id, status: 'created' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}
