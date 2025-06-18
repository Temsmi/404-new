import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';

export async function GET() {
    try {
        const query = `
            SELECT 
                student.id AS student_id,
                student.name AS president_name,
                student.surname,
                student.std_no,
                student.email,
                student.phone_num,
                student.dept,
                president.club_id,
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

export async function PUT(req) {
    try {
        const { student_id, name, surname, email, phone_num, dept, club_id } = await req.json();
        
        if (!student_id) {
            return NextResponse.json({ error: "student_id is required" }, { status: 400 });
        }

        const updateQueries = [];
        const values = [];

        if (name) {
            updateQueries.push("name = ?");
            values.push(name);
        }
        if (surname) {
            updateQueries.push("surname = ?");
            values.push(surname);
        }
        if (email) {
            updateQueries.push("email = ?");
            values.push(email);
        }
        if (phone_num) {
            updateQueries.push("phone_num = ?");
            values.push(phone_num);
        }
        if (dept) {
            updateQueries.push("dept = ?");
            values.push(dept);
        }
        if (club_id) {
            updateQueries.push("club_id = ?");
            values.push(club_id);
        }

        if (updateQueries.length === 0) {
            return NextResponse.json({ error: "No fields to update" }, { status: 400 });
        }

        const updateStudentQuery = `
            UPDATE student
            SET ${updateQueries.join(", ")}
            WHERE id = ?;
        `;
        values.push(student_id);
        await conn({ query: updateStudentQuery, values });

        return NextResponse.json({ message: "Club President updated successfully" });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}