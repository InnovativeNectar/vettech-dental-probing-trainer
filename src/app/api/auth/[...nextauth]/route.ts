import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const VALID_EMAILS = new Set([
  'student@vettech.edu',
  'instructor@pinnaclevet.edu',
  'admin@vetacademy.edu',
]);

function getUser(email: string) {
  return {
    id: 'user-001',
    email,
    name: email.split('@')[0],
    role: email.includes('admin') ? 'admin' : email.includes('instructor') ? 'instructor' : 'student',
    avatarUrl: null,
    institution: 'Pinnacle Vet College',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function GET(request: NextRequest) {
  const session = request.cookies.get('vettech_session');
  if (!session?.value) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  try {
    const parsed = JSON.parse(session.value);
    return NextResponse.json({ user: parsed.user, token: parsed.token });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
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

    const user = getUser(email);
    const token = `session-${Date.now()}`;
    const sessionData = { user, token };

    const response = NextResponse.json(sessionData);
    response.cookies.set('vettech_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}