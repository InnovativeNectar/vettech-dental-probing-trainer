import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(_request: Request) {
  try {
    const database = await getDb();
    if (!database) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const all = await database.select().from(users);
    return NextResponse.json(all);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const database = await getDb();
    if (!database) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const body = await request.json();
    const { email, name, role, institution } = body as {
      email: string;
      name: string;
      role?: string;
      institution?: string;
    };

    if (!email || !name) {
      return NextResponse.json(
        { error: 'email and name are required' },
        { status: 400 }
      );
    }

    const validRoles = ['student', 'instructor', 'admin'];
    const safeRole = (validRoles.includes(role ?? '') ? role : 'student') as 'student' | 'instructor' | 'admin';

    const now = new Date();
    const id = `user-${Date.now()}`;

    await database.insert(users).values({
      id,
      email,
      name,
      role: safeRole,
      avatarUrl: null,
      institution: institution ?? null,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      { id, email, name, role: safeRole, institution, createdAt: now, updatedAt: now },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}