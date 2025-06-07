import { NextResponse } from 'next/server';
import { conn } from 'app/connections/conn';
import { getSession } from 'app/lib/session';

export async function DELETE(req) {
  try {
    const session = await getSession();
    console.log("Session:", session);

    if (!session || !session.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.userId;

    // Get the user's role
    const userRows = await conn({
      query: 'SELECT role FROM student WHERE id = ?',
      values: [userId],
    });

    if (!userRows || userRows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const role = userRows[0].role;

    // Delete from specific table
    if (role === 'member') {
      await conn({
        query: 'DELETE FROM members WHERE student_id = ?',
        values: [userId],
      });
    } else if (role === 'president') {
      await conn({
        query: 'DELETE FROM president WHERE student_id = ?',
        values: [userId],
      });
    }

    // Always delete from students
    await conn({
      query: 'DELETE FROM student WHERE id = ?',
      values: [userId],
    });

    return NextResponse.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE API:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
