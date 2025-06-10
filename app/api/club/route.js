import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';

export async function GET() {
  try {
    const clubQuery = `
      SELECT 
        club.id, 
        club.name, 
        club.description, 
        club.logo, 
        club.is_active,
        COUNT(members.id) AS member_count,
        student.name AS president_name,
        student.surname AS president_surname
      FROM club
      LEFT JOIN members ON club.id = members.club_id
      LEFT JOIN president ON club.id = president.club_id
      LEFT JOIN student ON president.student_id = student.id
      GROUP BY club.id, club.name, club.description, club.logo, club.is_active, student.name, student.surname
    `;

    const clubRequestsQuery = `
      SELECT
        id + 1000000 AS id,
        name,
        description,
        logo,
        NULL AS is_active,
        0 AS member_count,
        NULL AS president_name,
        NULL AS president_surname
      FROM club_requests
      WHERE status = 'approved'
      AND id NOT IN (SELECT id FROM club)
    `;

    const clubs = await conn({ query: clubQuery });
    const clubRequests = await conn({ query: clubRequestsQuery });

    const allClubs = [...clubs, ...clubRequests];

    return NextResponse.json({
      total_clubs: allClubs.length,
      clubs: allClubs,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, name, description, logo, is_active } = body;

    const fields = [];
    const values = [];

    if (typeof name !== 'undefined') {
      fields.push('name = ?');
      values.push(name);
    }
    if (typeof description !== 'undefined') {
      fields.push('description = ?');
      values.push(description);
    }
    if (typeof logo !== 'undefined') {
      fields.push('logo = ?');
      values.push(logo);
    }
    if (typeof is_active !== 'undefined') {
      fields.push('is_active = ?');
      values.push(is_active);
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    values.push(id);
    const query = `UPDATE club SET ${fields.join(', ')} WHERE id = ?`;

    await conn({ query, values });

    return NextResponse.json({ id, ...body });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
