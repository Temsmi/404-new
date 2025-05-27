// app/api/username/route.js
import { getSession } from 'app/lib/session';
import { conn } from 'app/connections/conn';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    // Fetch student data along with clubs (no JSON aggregation)
    let result = await conn({
      query: `
        SELECT s.id AS student_id, s.name, s.surname, s.role,
               c.id AS club_id, c.name AS club_name
        FROM student s
        LEFT JOIN members m ON s.id = m.student_id
        LEFT JOIN club c ON m.club_id = c.id
        WHERE s.id = ?
      `,
      values: [session.userId],
    });

    if (!result || result.length === 0) {
      // Try admin table
      const adminResult = await conn({
        query: 'SELECT name, surname, role FROM admin WHERE id = ?',
        values: [session.userId],
      });

      if (!adminResult || adminResult.length === 0) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, user: adminResult[0] });
    }

    // Build user object and clubs list
    const { name, surname, role } = result[0];
    const clubs = result
      .filter(row => row.club_id !== null)
      .map(row => ({ id: row.club_id, name: row.club_name }));

    const user = {
      name,
      surname,
      role,
      clubs,
    };

    return NextResponse.json({ success: true, user });

  } catch (err) {
    console.error('Error in /api/username:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
