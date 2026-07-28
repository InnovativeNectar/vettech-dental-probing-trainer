import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { caseAttempts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const database = getDb();
    if (!database) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const { caseId } = await params;
    const attempts = await database
      .select()
      .from(caseAttempts)
      .where(eq(caseAttempts.caseId, caseId));
    return NextResponse.json(attempts);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const database = getDb();
    if (!database) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const { caseId } = await params;
    const body = await request.json();
    const { userId, diagnosis, treatmentPlan, score } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const now = new Date();
    const id = `case-attempt-${Date.now()}`;

    await database.insert(caseAttempts).values({
      id,
      caseId,
      userId,
      diagnosis: diagnosis ?? null,
      treatmentPlan: treatmentPlan ?? null,
      score: score ?? null,
      completedAt: now,
    });

    return NextResponse.json({ id, caseId, userId, diagnosis, treatmentPlan, score }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to save attempt' }, { status: 500 });
  }
}
