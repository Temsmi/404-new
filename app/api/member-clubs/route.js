
import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session';

export async function GET(req) {
  try {
    const session = await getSession(req);

    const studentId =
      session?.userId || session?.user?.userId;

    if (!studentId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const query = `
      SELECT c.id AS id, c.name AS name
      FROM members m
      JOIN club c ON m.club_id = c.id
      WHERE m.student_id = ?
    `;

    const result = await conn({
      query,
      values: [studentId],
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
