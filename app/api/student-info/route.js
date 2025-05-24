import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';

export async function GET(req) {
  try {
    const studentId = req.cookies.get('student_id')?.value;

    if (!studentId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const query = `SELECT id, name, surname, std_no, email, role, dept FROM student WHERE id = ?`;
    const result = await conn({ query, values: [studentId] });

    if (result.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching student info:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
