// pages/api/club-requests.js
import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn'; // Adjust the path as necessary


export async function POST(req) {
  try {
    const body = await req.json();
    const { student_id, reg_num, type, text, club_id, anonymous } = body;

    if (!text || !club_id || !type) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const query = `
      INSERT INTO request (student_id, reg_num, type, text, club_id, anonymous, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `;

    const result = await conn({
      query,
      values: [student_id, reg_num || null, type, text, club_id, anonymous ? 1 : 0],
    });

    return NextResponse.json({ message: 'Request submitted successfully', id: result.insertId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function GET() {
    try {
        const query = `
            SELECT 
                request.id, 
                request.club_id, 
                club.name, 
                club.logo, 
                request.description 
            FROM club_requests AS request
            JOIN club ON request.club_id = club.id
            WHERE request.status = 'pending'
        `;

        const requests = await conn({ query });

        return NextResponse.json(requests);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}