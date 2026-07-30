import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider') || 'credentials';
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  return NextResponse.redirect(new URL(`/api/auth/${provider}?callbackUrl=${encodeURIComponent(callbackUrl)}`, request.url));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (email === 'student@vettech.edu' || email === 'instructor@pinnaclevet.edu' || email === 'admin@vetacademy.edu') {
      return NextResponse.json({
        user: {
          id: 'user-001',
          email,
          name: email.split('@')[0],
          role: email.includes('admin') ? 'admin' : email.includes('instructor') ? 'instructor' : 'student',
          avatarUrl: null,
          institution: 'Pinnacle Vet College',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        token: `session-${Date.now()}`,
      });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}