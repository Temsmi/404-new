import { getSession } from 'app/lib/session'; 
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      console.warn('');

    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}