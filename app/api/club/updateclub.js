// pages/api/club/updateclub.js
import { NextResponse } from 'next/server';
import { conn } from '../../../connections/conn'; // Adjust the path as necessary

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