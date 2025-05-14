import { NextResponse } from 'next/server';
import { conn } from 'app/connections/conn';
import { getSession } from 'app/lib/session';

export async function GET(req) {
  try {
    const session = await getSession(); // Retrieve the session

    console.log('Session:', session); // Check the session object

    if (!session?.userId) { // Check for userId instead of stdno
      console.warn('Unauthorized access: No session or userId');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Query clubs based on userId
    const clubs = await conn({
      query: `
        SELECT club.id, club.name
        FROM club
        JOIN members ON club.id = members.club_id
        JOIN student ON members.student_id = student.id
        WHERE student.id = ?  
      `,
      values: [session.userId], // Use session.userId
    });

    return NextResponse.json(clubs);
  } catch (err) {
    console.error('Error fetching clubs:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
