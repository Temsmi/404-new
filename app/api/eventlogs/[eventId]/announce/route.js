import { NextResponse } from 'next/server';
import { conn } from '../../../../connections/conn'; 

export async function PUT(req, context) {

    const { eventId } = context.params;

    try {
        const [current] = await conn({
            query: 'SELECT is_announced FROM event1 WHERE id = ?',
            values: [eventId],
        });

        const newStatus = current.is_announced ? 0 : 1;

        const result = await conn({
            query: `
                UPDATE event1
                SET is_announced = ?
                WHERE id = ?
            `,
            values: [newStatus, eventId],
        });

        return NextResponse.json({ success: true, newStatus });
    } catch (error) {
        console.error("❌ Error announcing event:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
