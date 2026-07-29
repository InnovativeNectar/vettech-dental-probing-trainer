import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { progressRecords, badges } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const database = await getDb();
    if (!database) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-001';

    const [all, badgeRows] = await Promise.all([
      database.select().from(progressRecords).where(eq(progressRecords.userId, userId)),
      database.select().from(badges).where(eq(badges.userId, userId)),
    ]);

    const completed = all.filter((r) => r.status === 'completed');
    const totalSessions = completed.length;
    const totalProbingTime = completed.reduce((sum, r) => sum + r.timeSpentSeconds, 0);
    const scores = completed.map((r) => r.score).filter((s): s is number => s !== null);
    const averageScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
    const skillsCompleted = new Set(completed.map((r) => r.moduleId)).size;
    const badgesEarned = badgeRows.length;

    // Streak: count consecutive calendar days with at least one completed
    // record ending on the most recent completed day (0 if none).
    const completedDays = Array.from(
      new Set(completed.map((r) => r.completedAt?.toISOString().slice(0, 10)))
    ).filter((d): d is string => Boolean(d)).sort();

    let streakDays = 0;
    if (completedDays.length > 0) {
      streakDays = 1;
      for (let i = completedDays.length - 1; i > 0; i--) {
        const prev = new Date(completedDays[i]);
        const before = new Date(completedDays[i - 1]);
        const diffDays = Math.round((prev.getTime() - before.getTime()) / 86_400_000);
        if (diffDays === 1) streakDays++;
        else break;
      }
    }

    return NextResponse.json({
      totalSessions,
      totalProbingTime,
      averageScore,
      skillsCompleted,
      badgesEarned,
      streakDays,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

