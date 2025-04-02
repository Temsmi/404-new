import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';

// Fetch president and related club info
export async function GET() {
    try {
        const query = `
            SELECT 
                p.id AS president_id, 
                p.student_id, 
                p.club_id, 
                p.date_selected, 
                c.name AS club_name, 
                c.logo AS club_logo, 
                c.description AS club_description
            FROM president p 
            JOIN club c ON p.club_id = c.id 
            WHERE p.id = '5'`; // Change ID dynamically if needed
        
        const [presidentClub] = await conn({ query });
        return NextResponse.json(presidentClub);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Update president and club data
export async function PUT(req) {
    try {
        const { student_id, club_id, date_selected, club_name, club_logo, club_description } = await req.json();

        // Update president info
        const presidentQuery = `UPDATE president SET student_id = ?, club_id = ?, date_selected = ? WHERE id = '5'`;
        await conn({ query: presidentQuery, values: [student_id, club_id, date_selected] });

        // Update club info
        const clubQuery = `UPDATE club SET name = ?, logo = ?, description = ? WHERE id = ?`;
        await conn({ query: clubQuery, values: [club_name, club_logo, club_description, club_id] });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Database update error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
