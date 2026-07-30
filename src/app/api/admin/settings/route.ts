import { NextResponse } from 'next/server';

const DEFAULT_SETTINGS = {
  xapiLrs: {
    endpoint: '',
    auth: '',
    enabled: false,
  },
};

export async function GET(_request: Request) {
  return NextResponse.json(DEFAULT_SETTINGS);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ ...DEFAULT_SETTINGS, ...body });
  } catch {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}