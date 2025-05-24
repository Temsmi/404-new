import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session'; // Adjust if needed

export async function GET(req) {
  try {
    const session = await getSession(req);

    const userId =
      session?.userId || session?.user?.userId || session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const query = `
      SELECT 
        a.id, 
        a.date, 
        a.text AS content,
        c.name AS club_name
      FROM announcement a
      JOIN members m ON a.club_id = m.club_id
      JOIN club c ON a.club_id = c.id
      WHERE m.student_id = ?
      ORDER BY a.date DESC;
    `;

    const announcements = await conn({ query, values: [userId] });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    // Step 1: Get session data
    const session = await getSession(req);
    console.log('Session:', session);

    let userId;

    if (session?.userId) {
      userId = session.userId;
    } else if (session?.user?.userId) {
      userId = session.user.userId;
    } else if (session?.user?.id) {
      userId = session.user.id;
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized - No user ID found' }, { status: 401 });
    }

    // Step 2: Fetch the club_id for the logged-in user
    const clubQuery = `SELECT club_id FROM president WHERE student_id = ?`;
    const clubResult = await conn({
      query: clubQuery,
      values: [userId],
    });

    if (!clubResult.length) {
      return NextResponse.json({ error: 'Club not found for this user' }, { status: 404 });
    }

    const clubId = clubResult[0].club_id;

    // Step 3: Parse JSON body
    const body = await req.json();
    const { text, date } = body;

    if (!text || !date) {
      return NextResponse.json({ error: 'Text and date are required' }, { status: 400 });
    }

    // Step 4: Insert into announcement table
    const insertQuery = `
      INSERT INTO announcement (club_id, date, text)
      VALUES (?, ?, ?)
    `;

    await conn({
      query: insertQuery,
      values: [clubId, date, text],
    });

    return NextResponse.json({ message: 'Announcement submitted successfully' });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}