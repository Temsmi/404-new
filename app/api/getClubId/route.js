import { getSession } from 'app/lib/session';
import { conn } from '../../connections/conn';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const session = await getSession(req);
    const userId = session?.userId || session?.user?.userId;

    if (!userId) {
      return NextResponse.json({ club_id: [], role: null });
    }

    const adminResult = await conn({
      query: `SELECT id FROM admin WHERE id = ?`,
      values: [userId],
    });

    if (adminResult?.length > 0) {
      return NextResponse.json({
        club_id: [], 
        role: 'admin',
      });
    }

    const presidentResult = await conn({
      query: `SELECT club_id FROM president WHERE student_id = ?`,
      values: [userId],
    });

    if (presidentResult?.length > 0 && presidentResult[0].club_id) {
      return NextResponse.json({ club_id: [presidentResult[0].club_id], role: 'president' });
    }

    const memberResult = await conn({
      query: `SELECT club_id FROM members WHERE student_id = ?`,
      values: [userId],
    });

    if (!memberResult || memberResult.length === 0) {
      return NextResponse.json({ club_id: [], role: null });
    }

    return NextResponse.json({
      club_id: memberResult.map(r => r.club_id),
      role: 'member',
    });

  } catch (error) {
    console.error('Error fetching club_id:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
