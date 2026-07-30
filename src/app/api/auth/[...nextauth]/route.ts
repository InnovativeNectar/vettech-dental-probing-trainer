import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { users, sessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

const VALID_EMAILS = new Set([
  'student@vettech.edu',
  'instructor@pinnaclevet.edu',
  'admin@vetacademy.edu',
]);

const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function getUser(email: string) {
  return {
    id: 'user-001',
    email,
    name: email.split('@')[0],
    role: email.includes('admin') ? 'admin' : email.includes('instructor') ? 'instructor' : 'student',
    avatarUrl: null as string | null,
    institution: 'Pinnacle Vet College',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('vettech_session')?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const database = await getDb();
    if (!database) {
      return NextResponse.json({ user: null, error: 'Database not configured' });
    }

    const [session] = await database
      .select()
      .from(sessions)
      .where(eq(sessions.token, token))
      .limit(1);

    if (!session || session.expiresAt < new Date()) {
      cookieStore.delete('vettech_session');
      return NextResponse.json({ user: null });
    }

    const [user] = await database.select().from(users).where(eq(users.id, session.userId));
    return NextResponse.json({ user: user ? { ...user, id: user.id } : null });
  } catch {
    return NextResponse.json({ user: null });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (!VALID_EMAILS.has(email)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    let user = { ...getUser(email), id: 'user-001' };

    const database = await getDb();
    if (database) {
      const [existing] = await database.select().from(users).where(eq(users.email, email));
      if (existing) {
        user = { ...existing, id: existing.id } as typeof user;
      } else {
        const now = new Date();
        const id = `user-${Date.now()}`;
        await database.insert(users).values({
          id,
          email,
          name: user.name,
          role: user.role as "student" | "instructor" | "admin",
          avatarUrl: null as string | null,
          institution: 'Pinnacle Vet College',
          createdAt: now,
          updatedAt: now,
        });
        user = { ...user, id };
      }
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);
    const token = `sess-${Date.now()}-${crypto.randomUUID()}`;
    const sessionId = `session-${Date.now()}`;

    if (database) {
      await database.insert(sessions).values({
        id: sessionId,
        userId: user.id,
        token,
        expiresAt,
        createdAt: now,
        ipAddress: request.headers.get('x-forwarded-for') ?? undefined,
        userAgent: request.headers.get('user-agent') ?? undefined,
      });
    }

    const cookieStore = await cookies();
    cookieStore.set('vettech_session', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: SESSION_TTL_MS / 1000,
      path: '/',
    });

    return NextResponse.json({ user, token });
  } catch {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}