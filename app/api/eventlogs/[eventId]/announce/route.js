import { NextResponse } from 'next/server';
import { conn } from '../../../../connections/conn'; // Adjust path as needed

export async function PUT(req, context) {
        console.log("🌐 Params:", context.params); // 👈 برای دیباگ

    const { eventId } = context.params;

    console.log("📌 Announce ID:", eventId);

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

        console.log("✅ Update result:", result);
        return NextResponse.json({ success: true, newStatus });
    } catch (error) {
        console.error("❌ Error announcing event:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
