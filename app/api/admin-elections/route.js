import { NextResponse } from 'next/server';
import { conn } from 'app/connections/conn';
import { getSession } from 'app/lib/session';

export async function GET(req) {
  try {
    const session = await getSession();

    if (!session?.userId) {
      console.warn('Unauthorized access: No session or userId');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const clubs = await conn({
  query: `
    SELECT id, name, logo FROM club;

  `,
  values: [],
});

const clubsWithCandidates = await Promise.all(
  clubs.map(async (club) => {
    const candidates = await conn({
      query: `
        SELECT 
          c.id AS candidate_id,
          s.name AS student_name,
          c.amount_of_votes AS votes
        FROM candidate c
        JOIN student s ON c.student_id = s.id
        WHERE c.club_id = ?
        ORDER BY votes DESC
      `,
      values: [club.id],
    });

   return {
  id: club.id,
  name: club.name,
  logo: club.logo,
  candidates: candidates.map((c) => ({
    name: c.student_name,
    votes: Number(c.votes),
  })),
};

  })
);

    return NextResponse.json(clubsWithCandidates);
  } catch (err) {
    console.error('Error fetching clubs and candidates:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
