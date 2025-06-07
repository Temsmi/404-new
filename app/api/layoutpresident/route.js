import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session';

// GET: Fetch the name of the club (and its status) for the president in session
export async function GET(req) {
  try {
    const session = await getSession(req);
    console.log("Session:", session);

    let userId;
    if (session?.userId) {
      userId = session.userId;
    } else if (session?.user?.userId) {
      userId = session.user.userId;
    } else {
      console.error("No userId found in session.");
      return NextResponse.json({ error: "Unauthorized - No userId in session" }, { status: 401 });
    }

    const query = `
      SELECT c.name AS club_name, c.is_active
      FROM president p
      JOIN club c ON p.club_id = c.id
      WHERE p.student_id = ?
    `;

    const result = await conn({ query, values: [userId] });
    const clubData = Array.isArray(result) ? result[0] : result;

    if (!clubData) {
      return NextResponse.json({ error: "Club not found for this president" }, { status: 404 });
    }

    return NextResponse.json({
      clubName: clubData.club_name,
      is_active: clubData.is_active
    });
  } catch (error) {
    console.error("Error fetching club name:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
