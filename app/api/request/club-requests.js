// pages/api/club-requests.js
import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn'; // Adjust the path as necessary

export async function POST(req) {
    try {
        const { id, action } = await req.json();

        let query;
        if (action === 'approve') {
            query = `UPDATE club_requests SET status = 'approved' WHERE id = ?`;
        } else if (action === 'reject') {
            query = `UPDATE club_requests SET status = 'rejected' WHERE id = ?`;
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        await conn({ query, values: [id] });

        return NextResponse.json({ message: `Club request ${action}d!` });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const query = `
            SELECT 
                request.id, 
                request.club_id, 
                club.name, 
                club.logo, 
                request.description 
            FROM club_requests AS request
            JOIN club ON request.club_id = club.id
            WHERE request.status = 'pending'
        `;

        const requests = await conn({ query });

        return NextResponse.json(requests);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}