// /pages/api/president-requests.js
import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const presidentId = searchParams.get('president_id');

    // Fetching all requests for the president's clubs
    const query = `
      SELECT 
        r.id, r.type, r.text, r.anonymous, r.status,
        c.name AS club_name,
        s.std_no, s.name AS student_name, s.surname AS student_surname
      FROM request r
      JOIN club c ON r.club_id = c.id
      LEFT JOIN student s ON r.student_id = s.id
      JOIN president p ON c.id = p.club_id
      WHERE p.student_id = ?
      ORDER BY r.id DESC
    `;

    const requests = await conn({ query, values: [presidentId] });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching president requests:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
