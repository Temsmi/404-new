//for members that they are in the club 
// /app/api/member-clubs/route.js
import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';

export async function GET(req) {
  try {
    const studentId = req.cookies.get('student_id')?.value;

    if (!studentId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const query = `
      SELECT club.id, club.name
      FROM members
      JOIN club ON members.club_id = club.id
      WHERE members.student_id = ?
    `;

    const result = await conn({ query, values: [studentId] });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching member clubs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
