import { getSession } from 'app/lib/session';
import { conn } from '../../connections/conn';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const session = await getSession(req);
    const userId = session?.userId || session?.user?.userId;

      if (!userId) {
    return NextResponse.json({ clubIds: [] });
  }

    // Check president first
    const presidentResult = await conn({
      query: `SELECT club_id FROM president WHERE student_id = ?`,
      values: [userId],
    });

    if (presidentResult?.length > 0 && presidentResult[0].club_id) {
      return NextResponse.json({ club_id: [presidentResult[0].club_id] }); // ✅ wrapped in object
    }

    // Then check member (can belong to multiple)
    const memberResult = await conn({
      query: `SELECT club_id FROM members WHERE student_id = ?`,
      values: [userId],
    });

    if (!memberResult || memberResult.length === 0) {
      throw new Error("User not found in members or president tables");
    }

    const clubIds = memberResult.map(row => row.club_id).filter(Boolean);

    if (clubIds.length === 0) {
      throw new Error("No club_id found for this member");
    }

    return NextResponse.json({ club_id: clubIds }); // ✅ standardized key
  } catch (error) {
    console.error('Error fetching club_id:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}