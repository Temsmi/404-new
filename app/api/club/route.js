import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';

export async function GET() {
    try {
        const query = `
            SELECT 
                club.id, 
                club.name, 
                club.logo, 
                COUNT(members.id) AS member_count,
                student.name AS president_name 
            FROM club
            LEFT JOIN members ON club.id = members.club_id
            LEFT JOIN president ON club.id = president.club_id
            LEFT JOIN student ON president.student_id = student.id
            GROUP BY club.id, student.name
        `;

        const clubs = await conn({ query });

        return NextResponse.json(clubs);
    } catch (error) {
        console.error(" Database error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
