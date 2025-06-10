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
        student.name AS president_name 
      FROM club
      LEFT JOIN members ON club.id = members.club_id
      LEFT JOIN president ON club.id = president.club_id
      LEFT JOIN student ON president.student_id = student.id
      GROUP BY club.id, club.name, club.description, club.logo, club.is_active, student.name
    `;

    const clubRequestsQuery = `
      SELECT
        id + 1000000 AS id,  -- large offset to avoid ID collision
        name,
        description,
        logo,
        NULL AS is_active,
        0 AS member_count,
        NULL AS president_name
      FROM club_requests
      WHERE status = 'approved' 
      AND id NOT IN (SELECT id FROM club)
    `;

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

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, name, description, logo, is_active } = body;

    let fields = [];
    let values = [];

    if (typeof name !== 'undefined') {
      fields.push("name = ?");
      values.push(name);
    }
    if (typeof description !== 'undefined') {
      fields.push("description = ?");
      values.push(description);
    }
    if (typeof logo !== 'undefined') {
      fields.push("logo = ?");
      values.push(logo);
    }
    if (typeof is_active !== 'undefined') {
      fields.push("is_active = ?");
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
    console.error("Database error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
