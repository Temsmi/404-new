import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';

export async function GET() {
    try {
        const query = `
            SELECT 
                members.id, 
                members.date_joined,
                student.name AS std_name, 
                student.surname AS std_sname,
                student.std_no AS std_no,
                student.dept AS std_dept
            FROM members
            LEFT JOIN student ON members.student_id = student.id
            LEFT JOIN club ON members.club_id = club.id
            GROUP BY members.date_joined, student.name
        `;

        const members = await conn({ query });

        return NextResponse.json(members);
    } catch (error) {
        console.error(" Database error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
