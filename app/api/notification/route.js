import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session';

async function getClubIdFromSession(req) {
  const session = await getSession(req);
  const userId = session?.userId || session?.user?.userId;
  if (!userId) throw new Error("Unauthorized - No userId in session");

  let result = await conn({
    query: `SELECT club_id FROM members WHERE student_id = ?`,
    values: [userId],
  });

  if (!result || result.length === 0 || !result[0].club_id) {
    // If not found in 'members', check in 'president' table
    result = await conn({
      query: `SELECT club_id FROM president WHERE student_id = ?`,
      values: [userId],
    });

    if (!result || result.length === 0 || !result[0].club_id) {
      throw new Error("User not found or no club assigned in either members or president");
    }
  }

  return result[0].club_id;
}

export async function GET(req) {
  try {
    const club_id = await getClubIdFromSession(req);

    const notifications = await conn({
      query: `
        SELECT title, message, created_at 
        FROM notification
        WHERE club_id = ? 
        ORDER BY created_at DESC
      `,
      values: [club_id],
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const club_id = await getClubIdFromSession(req);
    const { title, message, created_at } = await req.json();

    //const created_at = new Date().toISOString();  Use server time
    const type = 'announcement';

    const result = await conn({
      query: `
        INSERT INTO notification (club_id, title, message, type, created_at)
        VALUES (?, ?, ?, ?, ?)
      `,
      values: [club_id, title, message, type, created_at],
    });

    // OPTIONAL: Emit to socket.io server here if needed

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}