import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';

export async function GET() {
    try {
        const query = `SELECT id, name, description, logo FROM club WHERE name = 'Unicorn1'`;
        const [clubs] = await conn({ query });
        return NextResponse.json(clubs);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { name, description, logo } = await req.json();
        const query = `UPDATE club SET name = ?, description = ?, logo = ? WHERE name = 'Unicorn'`;
        await conn({ query, values: [name, description, logo] });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Database update error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
