import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { sessions, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('vettech_session')?.value;

    if (!token) {
      return NextResponse.json({ user: null, session: null });
    }

    const database = await getDb();
    if (!database) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const [session] = await database
      .select()
      .from(sessions)
      .where(eq(sessions.token, token))
      .limit(1);

    if (!session || session.expiresAt < new Date()) {
      cookieStore.delete('vettech_session');
      return NextResponse.json({ user: null, session: null });
    }

    const [user] = await database
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ user: null, session: null });
    }

    return NextResponse.json({
      session: {
        id: session.id,
        userId: session.userId,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl ?? undefined,
        institution: user.institution ?? undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to verify session' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const database = await getDb();
    if (!database) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await request.json();
    const { userId } = body as { userId: string };

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const [user] = await database.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);
    const token = `sess-${Date.now()}-${crypto.randomUUID()}`;
    const id = `session-${Date.now()}`;

    const requestHeaders = request.headers;
    const ipAddress = requestHeaders.get('x-forwarded-for') ?? requestHeaders.get('x-real-ip') ?? undefined;
    const userAgent = requestHeaders.get('user-agent') ?? undefined;

    await database.insert(sessions).values({
      id,
      userId: user.id,
      token,
      expiresAt,
      createdAt: now,
      ipAddress,
      userAgent,
    });

    const cookieStore = await cookies();
    cookieStore.set('vettech_session', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: SESSION_TTL_MS / 1000,
      path: '/',
    });

    return NextResponse.json({
      session: { id, userId: user.id, token, expiresAt, createdAt: now },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl ?? undefined,
        institution: user.institution ?? undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}