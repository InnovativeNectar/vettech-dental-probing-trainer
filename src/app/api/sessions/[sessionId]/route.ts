import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { sessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const database = await getDb();
    if (!database) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    await database.delete(sessions).where(eq(sessions.id, sessionId));

    const cookieStore = await cookies();
    cookieStore.delete('vettech_session');

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to end session' }, { status: 500 });
  }
}