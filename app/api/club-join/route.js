import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    const userId = session?.userId ?? 0;

    const query = `
      SELECT 
       

        club.id, 
        club.name, 
        club.description, 
        club.logo, 
        COUNT(members.id) AS member_count,
        student.name AS president_name,
        EXISTS (
          SELECT 1 
          FROM members 
          WHERE members.club_id = club.id AND members.student_id = ?
        ) AS is_member
      FROM club
      LEFT JOIN members ON club.id = members.club_id
      LEFT JOIN president ON club.id = president.club_id
      LEFT JOIN student ON president.student_id = student.id
      GROUP BY club.id, student.name
    `;

    const clubs = await conn({ query, values: [userId] });
    return NextResponse.json(clubs);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { clubId } = await req.json();
    if (!clubId) return NextResponse.json({ error: 'Club ID is required' }, { status: 400 });

    const duplicateCheck = await conn({
      query: 'SELECT 1 FROM members WHERE student_id = ? AND club_id = ?',
      values: [session.userId, clubId],
    });

    if (duplicateCheck.length > 0) {
      return NextResponse.json({ error: 'You are already a member of this club' }, { status: 400 });
    }

    const checkRes = await conn({
      query: 'SELECT COUNT(*) AS count FROM members WHERE student_id = ?',
      values: [session.userId],
    });

    if (checkRes[0]?.count >= 3) {
      return NextResponse.json({ error: 'Maximum 3 club memberships allowed' }, { status: 400 });
    }

await conn({
  query: 'INSERT INTO members (student_id, club_id, date_joined) VALUES (?, ?, CURDATE())',
  values: [session.userId, clubId],
});

const updateRes = await conn({
  query: 'UPDATE student SET role = "member" WHERE id = ? AND role = "non-member"',
  values: [session.userId],
});

const forceLogout = updateRes.affectedRows > 0;

return NextResponse.json({ message: 'Joined club successfully', forceLogout });

  } catch (error) {
    console.error('Join error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
export async function DELETE(req) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.text();
    const { clubId } = JSON.parse(body);

    if (!clubId) return NextResponse.json({ error: 'Club ID is required' }, { status: 400 });

    await conn({
      query: 'DELETE FROM members WHERE student_id = ? AND club_id = ?',
      values: [session.userId, clubId],
    });

    const checkRemainingClubs = await conn({
      query: 'SELECT COUNT(*) AS count FROM members WHERE student_id = ?',
      values: [session.userId],
    });

  let forceLogout = false;

if (checkRemainingClubs[0]?.count === 0) {
  const updateRes = await conn({
    query: 'UPDATE student SET role = "non-member" WHERE id = ? AND role = "member"',
    values: [session.userId],
  });

  forceLogout = updateRes.affectedRows > 0;
}

return NextResponse.json({ message: 'Dropped club successfully', forceLogout });


  } catch (error) {
    console.error('Drop error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
