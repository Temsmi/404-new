import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session'; 

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
        members.club_id,
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

export async function DELETE(req) {
  try {
    const session = await getSession(req);
    const userId = session?.userId || session?.user?.userId;

    if (!userId) {
      console.error("No userId in session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { clubId } = body;

    if (!clubId) {
      console.error("No clubId provided");
      return NextResponse.json({ error: "Missing clubId" }, { status: 400 });
    }

    console.log("Attempting DELETE for student_id =", userId, "club_id =", clubId);

    const deleteQuery = `
      DELETE FROM members 
      WHERE student_id = ? AND club_id = ?
    `;

    const result = await conn({ query: deleteQuery, values: [userId, clubId] });

    console.log("DELETE result:", result);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "No rows deleted - check student_id and club_id" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/memberships error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

