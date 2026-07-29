import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { users, badges, skillAreas } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { buildUserProfile } from '@/lib/user-profile';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const database = await getDb();
    if (!database) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const { userId } = await params;

    const [user] = await database.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const [badgeRows, skillAreaRows] = await Promise.all([
      database.select().from(badges).where(eq(badges.userId, userId)),
      database.select().from(skillAreas).where(eq(skillAreas.userId, userId)),
    ]);

    const profile = buildUserProfile(user, badgeRows, skillAreaRows);
    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}
