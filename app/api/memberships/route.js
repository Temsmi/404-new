import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session'; // Make sure this path is correct!

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

    console.log("User ID from session:", userId);

    const query = `
      SELECT 
        members.id,
        members.date_joined,
        club.name AS name,
        club.description AS description,
        club.logo AS logo
      FROM members
      LEFT JOIN club ON members.club_id = club.id
      WHERE members.student_id = ?
      ORDER BY members.date_joined DESC
    `;

    const members = await conn({ query, values: [userId] }); // ✅ Use userId here

    return NextResponse.json(members);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
