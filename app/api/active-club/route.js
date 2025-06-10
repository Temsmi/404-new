import { getSession } from 'app/lib/session';
import { conn } from 'app/connections/conn';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    const query = `
      SELECT c.id, c.name, c.is_active
      FROM club c
      JOIN president p ON c.id = p.club_id
      WHERE p.student_id = ?
    `;

    const result = await conn({
      query,
      values: [session.userId],
    });

    if (!result || result.length === 0) {
      return NextResponse.json({ success: true, clubs: [] });
    }

    return NextResponse.json({ success: true, clubs: result });

  } catch (error) {
    console.error("Error in /api/active-club:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
