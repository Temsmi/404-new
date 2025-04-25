export const dynamic = "force-dynamic";

import 'dotenv/config';
import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session';

export async function GET(req, { params }) {
    // If params exist, it's for a specific event
    if (params && params.eventId) {
        const { eventId } = params;
        try {
            const eventQuery = `
                SELECT id, date_name, description, date_selected, approval, feedback feedback AS feedbackReason, is_postfeedback, zoom_link, image
                FROM event1 
                WHERE id = ?`;

            const eventResult = await conn({
                query: eventQuery,
                values: [eventId],
            });

            if (!eventResult || eventResult.length === 0) {
                return NextResponse.json({ error: "Event not found" }, { status: 404 });
            }

            return NextResponse.json({
                event: eventResult[0],
            });
        } catch (error) {
            console.error("Error fetching event:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    // If no params, fetch events for the club (user-based)
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

        // Step 1: Fetch the club_id for the president
        const clubQuery = `SELECT club_id FROM president WHERE student_id = ?`;
        const clubResult = await conn({
            query: clubQuery,
            values: [userId],
        });

        const club = Array.isArray(clubResult) ? clubResult[0] : clubResult;
        console.log("clubResult from DB:", club);

        if (!club || !club.club_id) {
            console.warn("No club found for user:", userId);
            return NextResponse.json({ error: `Club not found for user ${userId}` }, { status: 404 });
        }

        const clubId = club.club_id;

        // Step 2: Fetch events for this club
        const eventsQuery = `
            SELECT id, date_name, description, event_time, date_selected, approval, is_postfeedback,feedback AS feedbackReason, zoom_link, image
            FROM event1 
            WHERE club_id = ?`;

        const eventsResult = await conn({
            query: eventsQuery,
            values: [clubId],
        });

        if (!Array.isArray(eventsResult)) {
            console.error("eventsResult is not an array:", eventsResult);
            return NextResponse.json({ error: "Unexpected data format from DB" }, { status: 500 });
        }

        // Step 3: Format data for frontend
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
            approvalRaw: event.approval, // include raw approval value to compare against -1
            feedback: event.is_postfeedback,
            feedbackReason: event.feedbackReason,
            link: event.zoom_link,
            image: event.image,
        }));
        

        return NextResponse.json(formattedEvents);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
