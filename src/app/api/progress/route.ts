import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { progressRecords, skillAreas, badges } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

const MODULE_SKILL_MAP: Record<string, string[]> = {
  'mod-001': ['Probe Handling', 'Anatomy Knowledge'],
  'mod-002': ['Depth Measurement', 'Charting', 'Probe Handling'],
  'mod-003': ['Pathology Recognition', 'Client Communication'],
  'mod-004': ['Probe Handling', 'Depth Measurement', 'Charting', 'Anatomy Knowledge', 'Pathology Recognition'],
};

function getSkillAreasForModule(moduleId: string): string[] {
  return MODULE_SKILL_MAP[moduleId] ?? ['Probe Handling'];
}

function xpForScore(score: number | null): number {
  if (score === null) return 0;
  return Math.round(score / 10);
}

async function updateSkillAreas(
  database: Awaited<ReturnType<typeof getDb>>,
  userId: string,
  moduleId: string,
  score: number | null
): Promise<void> {
  if (!database) return;
  const areas = getSkillAreasForModule(moduleId);
  const xp = xpForScore(score);
  if (xp === 0) return;

  for (const areaName of areas) {
  const [existing] = await database
    .select()
    .from(skillAreas)
    .where(and(eq(skillAreas.userId, userId), eq(skillAreas.name, areaName)));

  if (!existing) {
    await database.insert(skillAreas).values({
      id: `sa-${Date.now()}-${areaName}`,
      userId,
      name: areaName,
      level: 1,
      xp,
      maxXp: 500,
    });
    return;
  }

  const newXp = existing.xp + xp;
  await database
    .update(skillAreas)
    .set({ xp: newXp, level: Math.floor(newXp / existing.maxXp) + 1 })
    .where(eq(skillAreas.id, existing.id));
  }
}

async function awardBadges(
  database: Awaited<ReturnType<typeof getDb>>,
  userId: string,
  score: number | null,
  passed: boolean
): Promise<void> {
  if (!database) return;
  const now = new Date();
  const newBadges: { id: string; userId: string; name: string; description: string; iconUrl: string | null; earnedAt: Date }[] = [];

  if (score !== null && score >= 90) {
    newBadges.push({
      id: `badge-${Date.now()}-sharp-eye`,
      userId,
      name: 'Sharp Eye',
      description: 'Scored 90%+ on an assessment',
      iconUrl: null,
      earnedAt: now,
    });
  }

  if (passed) {
    newBadges.push({
      id: `badge-${Date.now()}-passed`,
      userId,
      name: 'Passed',
      description: 'Passed an assessment (70%+)',
      iconUrl: null,
      earnedAt: now,
    });
  }

  for (const badge of newBadges) {
    await database.insert(badges).values(badge);
  }
}

export async function GET(request: NextRequest) {
  try {
    const database = await getDb();
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
    const database = await getDb();
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

      if (status === 'completed' && score !== null) {
        await updateSkillAreas(database, userId, moduleId, score);
        await awardBadges(database, userId, score, score >= 70);
      }

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

    if (status === 'completed' && score !== null) {
      await updateSkillAreas(database, userId, moduleId, score);
      await awardBadges(database, userId, score, score >= 70);
    }

    return NextResponse.json({ id, status: 'created' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}
