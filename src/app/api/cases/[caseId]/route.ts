import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { dentalCases, pathologyData, caseImages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;
    const [dentalCase] = await db.select().from(dentalCases).where(eq(dentalCases.id, caseId));

    if (!dentalCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const pathology = await db
      .select()
      .from(pathologyData)
      .where(eq(pathologyData.caseId, caseId));

    const images = await db
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
