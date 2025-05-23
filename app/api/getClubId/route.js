// /app/api/getClubId/route.js
import { getSession } from 'app/lib/session';
import { conn } from '../../connections/conn';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const session = await getSession(req);
    const userId = session?.userId || session?.user?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let result = await conn({
    query: `SELECT club_id FROM members WHERE student_id = ?`,
    values: [userId],
  });

  if (!result || result.length === 0 || !result[0].club_id) {
    // If not found in 'members', check in 'president' table
    result = await conn({
      query: `SELECT club_id FROM president WHERE student_id = ?`,
      values: [userId],
    });

    if (!result || result.length === 0 || !result[0].club_id) {
      throw new Error("User not found or no club assigned in either members or president");
    }
  }

    return NextResponse.json({ club_id: result[0].club_id });
  } catch (error) {
    console.error('Error fetching club_id:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
