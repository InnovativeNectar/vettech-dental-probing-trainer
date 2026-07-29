import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { progressRecords } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const database = await getDb();
    if (!database) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-001';

    const all = await database
      .select()
      .from(progressRecords)
      .where(eq(progressRecords.userId, userId));

    const completed = all.filter((r) => r.status === 'completed');
    const totalSessions = completed.length;
    const totalProbingTime = completed.reduce((sum, r) => sum + r.timeSpentSeconds, 0);
    const scores = completed.map((r) => r.score).filter((s): s is number => s !== null);
    const averageScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
    const skillsCompleted = new Set(completed.map((r) => r.moduleId)).size;

    return NextResponse.json({
      totalSessions,
      totalProbingTime,
      averageScore,
      skillsCompleted,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
