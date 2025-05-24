// file: /app/api/votes/voted-clubs/route.js (or .ts if TS)
import { NextResponse } from 'next/server';
import { conn } from 'app/connections/conn';
import { getSession } from 'app/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const student_id = session.userId;

    // Get member IDs for this student
    const members = await conn({
      query: 'SELECT id FROM members WHERE student_id = ?',
      values: [student_id],
    });

    if (members.length === 0) {
      return NextResponse.json({ votedClubs: [] });
    }

    const memberIds = members.map(m => m.id);

    // Use placeholders for SQL IN clause
    const placeholders = memberIds.map(() => '?').join(',');

    // Get distinct club_ids from votes table where member_id in memberIds
    const votes = await conn({
      query: `SELECT DISTINCT club_id FROM votes WHERE member_id IN (${placeholders})`,
      values: memberIds,
    });

    const votedClubs = votes.map(v => v.club_id);

    return NextResponse.json({ votedClubs });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
