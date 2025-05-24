import { NextResponse } from 'next/server';
import { conn } from 'app/connections/conn';
import { getSession } from 'app/lib/session';

export async function GET(req) {
  try {
    const session = await getSession(req);

    if (!session?.userId) {
      console.warn('Unauthorized access: No session or userId');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Query clubs based on userId
    const clubs = await conn({
      query: `
        SELECT club.id, club.name, club.logo
        FROM club
        JOIN members ON club.id = members.club_id
        JOIN student ON members.student_id = student.id
        WHERE student.id = ?
      `,
      values: [session.userId],
    });

    // Add full path for logos or null if missing
    const clubsWithFullLogo = clubs.map(club => ({
      ...club,
      logo: club.logo
        ? `/images/ClubsLogo/${club.logo}`
        : '/images/default-logo.png', // Fallback logo path
    }));

    return NextResponse.json(clubsWithFullLogo);
  } catch (err) {
    console.error('Error fetching clubs:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
