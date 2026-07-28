import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { assessmentResults } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  try {
    const { assessmentId } = await params;
    const results = await db
      .select()
      .from(assessmentResults)
      .where(eq(assessmentResults.assessmentId, assessmentId));
    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  try {
    const { assessmentId } = await params;
    const body = await request.json();
    const { userId, score, passed, answers, timeSpentSeconds } = body;

    if (!userId || score === undefined || passed === undefined || timeSpentSeconds === undefined) {
      return NextResponse.json(
        { error: 'userId, score, passed, and timeSpentSeconds are required' },
        { status: 400 }
      );
    }

    const now = new Date();
    const id = `assess-result-${Date.now()}`;

    await db.insert(assessmentResults).values({
      id,
      assessmentId,
      userId,
      score,
      passed,
      answers: answers ? JSON.stringify(answers) : null,
      timeSpentSeconds,
      startedAt: now,
      completedAt: now,
    });

    return NextResponse.json({ id, assessmentId, userId, score, passed }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to save assessment result' }, { status: 500 });
  }
}
