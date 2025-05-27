import 'dotenv/config';
import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session';

export async function GET(req, { params }) {
    // For specific event by ID
    if (params && params.eventId) {
        const { eventId } = params;
        try {
            const eventQuery = `
                SELECT id, date_name, description, event_time, date_selected, approval, is_postfeedback, feedback AS feedbackReason, zoom_link, image, is_announced
                FROM event1 
                WHERE id = ? AND is_announced = 1
            `;

            const eventResult = await conn({
                query: eventQuery,
                values: [eventId],
            });

            if (!eventResult || eventResult.length === 0) {
                return NextResponse.json({ error: "Event not found" }, { status: 404 });
            }

            return NextResponse.json({ event: eventResult[0] });
        } catch (error) {
            console.error("Error fetching event:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    // For user-based club events
    try {
        const session = await getSession(req);
        console.log("Session:", session);

        let userId;
        if (session.userId) {
            userId = session.userId;
        } else if (session.user && session.user.userId) {
            userId = session.user.userId;
        } else {
            console.error("No userId found in session.");
            return NextResponse.json({ error: "Unauthorized - No userId in session" }, { status: 401 });
        }

        // Get all club_ids where user is president or member
        const clubsQuery = `
            SELECT club_id FROM president WHERE student_id = ?
            UNION
            SELECT club_id FROM members WHERE student_id = ?
        `;
        const clubsResult = await conn({
            query: clubsQuery,
            values: [userId, userId],
        });

        if (!clubsResult || clubsResult.length === 0) {
            console.warn("No clubs found for user:", userId);
            return NextResponse.json({ error: `No clubs found for user ${userId}` }, { status: 404 });
        }

        const clubIds = clubsResult.map(club => club.club_id);
        console.log("User is in clubs:", clubIds);

        // Get events for all these clubs
        const placeholders = clubIds.map(() => '?').join(',');
        const eventsQuery = `
            SELECT id, date_name, description, event_time, date_selected, approval, is_postfeedback, feedback AS feedbackReason, zoom_link, image, is_announced, club_id
            FROM event1 
            WHERE club_id IN (${placeholders})
        `;
        const eventsResult = await conn({
            query: eventsQuery,
            values: clubIds,
        });

        if (!Array.isArray(eventsResult)) {
            console.error("eventsResult is not an array:", eventsResult);
            return NextResponse.json({ error: "Unexpected data format from DB" }, { status: 500 });
        }

        // Format events for frontend
        const formattedEvents = eventsResult.map(event => ({
            id: event.id,
            name: event.date_name,
            description: event.description,
            time: event.event_time,
            date: event.date_selected,
            status: event.approval === 1
                ? "Approved"
                : event.approval === 0
                ? "Pending"
                : "Denied",
            approvalRaw: event.approval,
            feedback: event.is_postfeedback,
            feedbackReason: event.feedbackReason,
            link: event.zoom_link,
            image: event.image,
            is_announced: event.is_announced,
            club_id: event.club_id, // useful if showing which club each event belongs to
        }));

        return NextResponse.json(formattedEvents);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
