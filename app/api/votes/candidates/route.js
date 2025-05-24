import { NextResponse } from 'next/server';
import { conn } from 'app/connections/conn';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clubId = searchParams.get('clubId');

    if (!clubId) {
      return NextResponse.json({ message: 'Missing clubId' }, { status: 400 });
    }

    const candidates = await conn({
      query: `
        SELECT c.id, c.bio, c.photo, c.amount_of_votes, s.name AS student_name
        FROM candidate c
        JOIN student s ON c.student_id = s.id
        WHERE c.club_id = ?
      `,
      values: [clubId],
    });

    return NextResponse.json(candidates);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
