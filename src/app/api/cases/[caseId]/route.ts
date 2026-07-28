import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { dentalCases, pathologyData, caseImages } from '@/lib/db/schema';
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
    const [dentalCase] = await database.select().from(dentalCases).where(eq(dentalCases.id, caseId));

    if (!dentalCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const pathology = await database
      .select()
      .from(pathologyData)
      .where(eq(pathologyData.caseId, caseId));

    const images = await database
      .select()
      .from(caseImages)
      .where(eq(caseImages.caseId, caseId));

    return NextResponse.json({
      ...dentalCase,
      affectedTeeth: dentalCase.affectedTeeth ? JSON.parse(dentalCase.affectedTeeth) : [],
      tags: dentalCase.tags ? JSON.parse(dentalCase.tags) : [],
      pathologyData: pathology,
      images,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch case' }, { status: 500 });
  }
}
