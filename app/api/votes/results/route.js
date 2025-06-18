import { NextResponse } from 'next/server';
import { getSession } from 'app/lib/session';
import { conn } from 'app/connections/conn';

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const clubs = await conn({
      query: `
        SELECT c.id, c.name, c.logo
        FROM club c
        JOIN members m ON c.id = m.club_id
        WHERE m.student_id = ?
      `,
      values: [session.userId],
    });

    const clubsWithFullLogo = clubs.map(club => ({
      ...club,
      logo: club.logo
        ? `/images/ClubsLogo/${club.logo}`
        : '/images/default-logo.png',
    }));

    const clubsWithCandidates = await Promise.all(clubsWithFullLogo.map(async club => {
      const candidates = await conn({
        query: `
          SELECT 
            c.id AS candidate_id,
            c.amount_of_votes,
            c.bio,
            s.name AS student_name,
            c.photo
          FROM candidate c
          JOIN student s ON c.student_id = s.id
          WHERE c.club_id = ?
          ORDER BY c.amount_of_votes DESC
        `,
        values: [club.id],
      });

      return {
        id: club.id,
        name: club.name,
        logo: club.logo,
        candidates: candidates.map(c => ({
          id: c.candidate_id,
          student_name: c.student_name,
          bio: c.bio,
          photo: c.photo,
          votes: Number(c.amount_of_votes),
        })),
      };
    }));

    return NextResponse.json(clubsWithCandidates);
  } catch (err) {
    console.error('Error in results API:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
