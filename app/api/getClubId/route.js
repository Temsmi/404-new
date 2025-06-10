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

    // 1️⃣ Check if Admin
    const adminResult = await conn({
      query: `SELECT id FROM admin WHERE id = ?`,
      values: [userId],
    });

    if (adminResult?.length > 0) {
      return NextResponse.json({
        club_id: [], // Admin can access all clubs (frontend should handle this)
        role: 'admin',
      });
    }

    // 2️⃣ Check if President
    const presidentResult = await conn({
      query: `SELECT club_id FROM president WHERE student_id = ?`,
      values: [userId],
    });

    if (presidentResult?.length > 0 && presidentResult[0].club_id) {
      return NextResponse.json({
        club_id: [presidentResult[0].club_id],
        role: 'president',
      });
    }

    // 3️⃣ Check if Member
    const memberResult = await conn({
      query: `SELECT club_id FROM members WHERE student_id = ?`,
      values: [userId],
    });

    const clubIds = memberResult?.map(row => row.club_id).filter(Boolean) || [];

    if (clubIds.length > 0) {
      return NextResponse.json({
        club_id: clubIds,
        role: 'member',
      });
    }

    // No role found
    return NextResponse.json({
      club_id: [],
      role: null,
    });
    
  } catch (error) {
    console.error('Error fetching club_id and role:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}