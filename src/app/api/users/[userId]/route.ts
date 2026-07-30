import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const database = await getDb();
    if (!database) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const { userId } = await params;
    const body = await request.json();
    const { name, role, institution } = body as {
      name?: string;
      role?: string;
      institution?: string;
    };

    const [existing] = await database.select().from(users).where(eq(users.id, userId));
    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const validRoles = ['student', 'instructor', 'admin'];
    const updated = {
      name: name ?? existing.name,
      role: (role && validRoles.includes(role) ? role : existing.role) as "student" | "instructor" | "admin",
      institution: institution ?? existing.institution,
      updatedAt: new Date(),
    };

    await database.update(users).set(updated).where(eq(users.id, userId));
    return NextResponse.json({ ...existing, ...updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const database = await getDb();
    if (!database) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const { userId } = await params;
    const [existing] = await database.select().from(users).where(eq(users.id, userId));
    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    await database.delete(users).where(eq(users.id, userId));
    return NextResponse.json({ success: true, deleted: userId });
  } catch {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
