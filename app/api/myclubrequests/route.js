import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session';

export async function GET(req) {
  try {
    const session = await getSession(); 
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized: No student ID in session' },
        { status: 401 }
      );
    }

    const rows = await conn({
      query: `
        SELECT id, name, description, status, created_at 
        FROM club_requests 
        WHERE student_id = ? 
        ORDER BY created_at DESC
      `,
      values: [userId],
    });

    if (rows.error) {
      throw new Error(rows.error);
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching club requests:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
