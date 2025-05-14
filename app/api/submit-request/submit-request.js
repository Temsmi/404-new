import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';

export async function POST(req) {
  try {
    const { student_id, reg_num, type, text, club_id, anonymous } = await req.json();

    const query = `
      INSERT INTO request (student_id, type, text, club_id, anonymous, status)
      VALUES (?, ?, ?, ?, ?, 'Pending')
    `;
    const values = [student_id, reg_num, type, text, club_id, anonymous];
    await conn({ query, values });

    return NextResponse.json({ message: 'Request submitted successfully' });
  } catch (error) {
    console.error('Error saving request:', error);
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
  }
}
