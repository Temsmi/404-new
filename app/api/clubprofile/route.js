import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';

export async function GET() {
    try {
        const query = `SELECT id, name, description, logo FROM club WHERE name = 'Unicorn'`;

        // Query using promise-based API
        const [clubs] = await conn({query});
        return NextResponse.json(clubs);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
