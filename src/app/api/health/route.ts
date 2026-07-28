import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const database = await getDb();
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: database ? 'connected' : 'unavailable',
  });
}
