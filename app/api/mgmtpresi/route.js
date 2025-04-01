import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';

// Fetch Club Presidents
export async function GET() {
    try {
        const query = `
         SELECT 
    student.id AS student_id,
    student.name AS president_name,
    student.email,
    student.phone_num,
    student.dept,
    club.id AS club_id,
    club.name AS club_name
FROM president
JOIN student ON president.student_id = student.id
JOIN club ON president.club_id = club.id;

        `;

        const presidents = await conn({ query });
        return NextResponse.json(presidents);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Update Club President
export async function PUT(req) {
    try {
        const { id, name, surname, email, phone_num, dept, club } = await req.json();
        
        if (!id || !name || !surname || !email || !phone_num || !dept || !club) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Find the club ID based on the club name
        const clubQuery = `SELECT id FROM club WHERE name = ?`;
        const clubData = await conn({ query: clubQuery, values: [club] });

        if (clubData.length === 0) {
            return NextResponse.json({ error: "Club not found" }, { status: 404 });
        }

        const clubId = clubData[0].id;

        // Update the student's details
        const updateStudentQuery = `
            UPDATE student 
            SET name = ?, surname = ?, email = ?, phone_num = ?, dept = ?
            WHERE id = ?
        `;
        await conn({ query: updateStudentQuery, values: [name, surname, email, phone_num, dept, id] });

        // Update the club president association
        const updateClubQuery = `
            UPDATE club 
            SET president_id = ? 
            WHERE id = ?
        `;
        await conn({ query: updateClubQuery, values: [id, clubId] });

        return NextResponse.json({ message: "Club President updated successfully" });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
