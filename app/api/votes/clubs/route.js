import { NextResponse } from 'next/server';
import { conn } from 'app/connections/conn';
import { getSession } from 'app/lib/session'; // Assumes getSession() retrieves stdno

export async function GET(req) {
  try {
    const session = await getSession(); // You need to implement this function
    const stdno = session?.stdno;

    if (!stdno) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const clubs = await conn({
      query: `
        SELECT clubs.id, clubs.name
        FROM clubs
        JOIN members ON clubs.id = members.club_id
        JOIN student ON members.student_id = student.id
        WHERE student.std_no = ?
      `,
      values: [stdno],
    });

    return NextResponse.json(clubs);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
