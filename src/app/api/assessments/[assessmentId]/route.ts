import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { questions, questionOptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  try {
    const database = await getDb();
    if (!database) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const { assessmentId } = await params;

    const assessmentQuestions = await database
      .select()
      .from(questions)
      .where(eq(questions.assessmentId, assessmentId));

    if (assessmentQuestions.length === 0) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const questionsWithOptions = await Promise.all(
      assessmentQuestions.map(async (q) => {
        const options = await database
          .select()
          .from(questionOptions)
          .where(eq(questionOptions.questionId, q.id));

        return {
          id: q.id,
          assessmentId: q.assessmentId,
          type: q.type,
          content: q.content,
          imageUrl: q.imageUrl,
          correctAnswer: q.correctAnswer,
          points: q.points,
          explanation: q.explanation,
          sortOrder: q.sortOrder,
          options: options.map((o) => ({
            id: o.id,
            questionId: o.questionId,
            text: o.text,
            isCorrect: o.isCorrect,
            sortOrder: o.sortOrder,
          })),
        };
      })
    );

    return NextResponse.json({
      assessmentId,
      questions: questionsWithOptions,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch assessment' }, { status: 500 });
  }
}
