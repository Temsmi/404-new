// pages/api/club.js
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
        console.error("Database error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { id, name, description, logo } = await req.json();

        // Update the club in the database
        const query = `
            UPDATE club
            SET name = ?, description = ?, logo = ?
            WHERE id = ?
        `;

        const values = [name, description, logo, id];
        await conn({ query, values });

        // Return the updated club data
        return NextResponse.json({ id, name, description, logo });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}