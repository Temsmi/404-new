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
  
      const result = await conn({
        query: 'INSERT INTO members (student_id, club_id, date_joined) VALUES (?, ?, CURDATE())',
        values: [session.userId, clubId],
      });
  
      return NextResponse.json({ message: 'Joined club successfully' });
    } catch (error) {
      console.error('Join error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  
  export async function DELETE(req) {
    try {
      const session = await getSession();
      if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
      const { clubId } = await req.json();
      if (!clubId) return NextResponse.json({ error: 'Club ID is required' }, { status: 400 });
  
      const result = await conn({
        query: 'DELETE FROM members WHERE student_id = ? AND club_id = ?',
        values: [session.userId, clubId],
      });
  
      return NextResponse.json({ message: 'Dropped club successfully' });
    } catch (error) {
      console.error('Drop error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }