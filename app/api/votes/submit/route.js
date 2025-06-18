import { NextResponse } from 'next/server';
import { conn } from 'app/connections/conn';
import { getSession } from 'app/lib/session';

export async function POST(req) {
  try {
    const session = await getSession();
   

    if (!session?.userId) { 
      console.warn('Unauthorized access: No session or userId');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
   
    const { candidate_id, club_id } = await req.json();

    const [member] = await conn({
      query: 'SELECT id FROM members WHERE student_id = ? AND club_id = ?',
      values: [session.userId, club_id],
    });

    if (!member) {
      return NextResponse.json({ message: 'You are not a member of this club' }, { status: 403 });
    }

    const member_id = member.id;

    const [existingVote] = await conn({
      query: 'SELECT id FROM votes WHERE member_id = ? AND club_id = ?',
      values: [member_id, club_id],
    });

    if (existingVote) {
      return NextResponse.json({ message: 'You have already voted in this club' }, { status: 400 });
    }

    await conn({
      query: `
        INSERT INTO votes (member_id, candidate_id, club_id, date)
        VALUES (?, ?, ?, NOW())
      `,
      values: [member_id, candidate_id, club_id],
    });

    await conn({
      query: `
        UPDATE candidate SET amount_of_votes = amount_of_votes + 1
        WHERE id = ?
      `,
      values: [candidate_id],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
