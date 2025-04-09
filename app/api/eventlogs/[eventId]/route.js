import { NextResponse } from 'next/server';
import { conn } from '../../../connections/conn';

export async function PUT(req, { params }) {
    const { eventId } = params;
    const { eventName, description, eventTime, dateSelected, isPostFeedback, zoomLink, eventImage } = await req.json();

    try {
        const updateQuery = `
            UPDATE event1
            SET date_name = ?, description = ?, event_time = ?, date_selected = ?, is_postfeedback = ?, zoom_link = ?, image = ?
            WHERE id = ?
        `;

        await conn({
            query: updateQuery,
            values: [eventName, description, eventTime, dateSelected, isPostFeedback, zoomLink, eventImage, eventId],
        });

        return NextResponse.json({ message: 'Event updated successfully' });
    } catch (error) {
        console.error('Error updating event:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}