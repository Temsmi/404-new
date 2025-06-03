import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';

export async function GET() {
  try {
    // Query clubs already in club table
    const clubQuery = `
      SELECT 
        club.id, 
        club.name, 
        club.description, 
        club.logo, 
        COUNT(members.id) AS member_count,
        student.name AS president_name
      FROM club
      LEFT JOIN members ON club.id = members.club_id
      LEFT JOIN president ON club.id = president.club_id
      LEFT JOIN student ON president.student_id = student.id
      GROUP BY club.id, student.name
    `;

    // Query approved club requests NOT in club table yet
    // assuming club_requests table has id, name, logo, description, student_id, status
    const clubRequestsQuery = `
      SELECT
        id + 1000000 AS id, -- offset to avoid id clash with club table
        name,
        description,
        logo,
        0 AS member_count,
        NULL AS president_name
      FROM club_requests
      WHERE status = 'approved' 
      AND id NOT IN (SELECT id FROM club) -- avoid duplicates if already inserted
    `;

    // Combine both results with UNION ALL
    const fullQuery = `
      (${clubQuery})
      UNION ALL
      (${clubRequestsQuery})
    `;

    const clubs = await conn({ query: fullQuery });

    return NextResponse.json(clubs);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
