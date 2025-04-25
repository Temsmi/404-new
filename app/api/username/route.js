export const dynamic = "force-dynamic";

import { getSession } from 'app/lib/session';
import { conn } from 'app/connections/conn';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    // First try student table
    let result = await conn({
      query: 'SELECT name, surname, role FROM student WHERE id = ?',
      values: [session.userId],
    });

    if (!result || result.length === 0) {
      // Try admin table
      result = await conn({
        query: 'SELECT name, surname, role FROM admin WHERE id = ?',
        values: [session.userId],
      });
    }

    if (!result || result.length === 0) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const user = result[0];
    return NextResponse.json({ success: true, user });

  } catch (err) {
    console.error('Error in /api/username:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}