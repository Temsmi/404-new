import { NextResponse } from 'next/server';
import { conn } from 'app/connections/conn';
import { getSession } from 'app/lib/session';

export async function POST(req) {
  try {
    const session = await getSession();
    const stdno = session?.stdno;

    if (!stdno) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { candidate_id, club_id } = body;

    // Get student_id
    const studentRows = await conn({
      query: 'SELECT id FROM student WHERE std_no = ?',
      values: [stdno],
    });

    if (studentRows.length === 0) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    const student_id = studentRows[0].id;

    // Check if already voted
    const voteCheck = await conn({
      query: `
        SELECT v.id FROM votes v
        JOIN members m ON v.member_id = m.id
        WHERE m.student_id = ? AND v.club_id = ?
      `,
      values: [student_id, club_id],
    });

    if (voteCheck.length > 0) {
      return NextResponse.json({ message: 'You already voted in this club' }, { status: 400 });
    }

    // Get member_id
    const memberRow = await conn({
      query: 'SELECT id FROM members WHERE student_id = ? AND club_id = ?',
      values: [student_id, club_id],
    });

    if (memberRow.length === 0) {
      return NextResponse.json({ message: 'Not a member of this club' }, { status: 403 });
    }

    const member_id = memberRow[0].id;

    // Insert vote
    await conn({
      query: 'INSERT INTO votes (member_id, candidate_id, club_id, date) VALUES (?, ?, ?, NOW())',
      values: [member_id, candidate_id, club_id],
    });

    // Update vote count
    await conn({
      query: 'UPDATE candidates SET amount_of_votes = amount_of_votes + 1 WHERE id = ?',
      values: [candidate_id],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
