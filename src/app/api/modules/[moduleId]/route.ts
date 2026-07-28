import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { modules, lessons } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const database = getDb();
    if (!database) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const { moduleId } = await params;
    const [module] = await database.select().from(modules).where(eq(modules.id, moduleId));

    if (!module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    const moduleLessons = await database
      .select()
      .from(lessons)
      .where(eq(lessons.moduleId, moduleId));

    return NextResponse.json({
      ...module,
      requiredModules: module.requiredModules ? JSON.parse(module.requiredModules) : [],
      lessons: moduleLessons.map((l) => ({
        ...l,
        objectives: l.objectives ? JSON.parse(l.objectives) : [],
      })),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch module' }, { status: 500 });
  }
}
