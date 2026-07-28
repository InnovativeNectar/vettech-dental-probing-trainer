import { NextResponse } from 'next/server';
import { ASSESSMENTS } from '@/lib/assessment-data';

export async function GET() {
  try {
    const result = ASSESSMENTS.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      type: a.type,
      moduleId: a.moduleId ?? null,
      timeLimitMinutes: a.timeLimitMinutes,
      passingScore: a.passingScore,
      questionCount: a.questions.length,
    }));
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
  }
}
