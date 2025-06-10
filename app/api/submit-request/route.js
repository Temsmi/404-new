import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session';

export async function POST(req) {
  try {
    const session = await getSession(req);
    const userId = session?.userId || session?.user?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { club_id, type, text, anonymous } = await req.json();

    if (!club_id || !type || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    //  Ensure student exists in the members table
    const memberResult = await conn({
      query: 'SELECT student_id FROM members WHERE student_id = ? LIMIT 1',
      values: [userId],
    });

    if (!memberResult.length) {
      return NextResponse.json({ error: 'Student not found in members table' }, { status: 404 });
    }

    const student_id = memberResult[0].student_id;

    // Insert the request (without reg_num)
    const insertQuery = `
      INSERT INTO request (student_id, type, text, club_id, anonymous, status)
      VALUES (?, ?, ?, ?, ?, 'Pending')
    `;

    await conn({
      query: insertQuery,
      values: [student_id, type, text, club_id, anonymous],
    });

    return NextResponse.json({ message: 'Feedback submitted successfully.' });
  } catch (error) {
    console.error('Submit request error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
