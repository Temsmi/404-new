import 'dotenv/config';
import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session';

export async function GET(req, { params }) {
    // If params exist, it's for a specific event
    if (params && params.eventId) {
        const { eventId } = params;
        try {
            // Fetch the event data by eventId
            const eventQuery = `
                SELECT id, date_name, description, date_selected, approval, feedback, is_postfeedback, zoom_link, image
                FROM event1 
                WHERE id = ?`;

            const eventResult = await conn({
                query: eventQuery,
                values: [eventId],
            });

            if (!eventResult.length) {
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
          
        if (!clubResult.length) {
          return NextResponse.json({ error: "Club not found for this user" }, { status: 404 });
      }

      const clubId = clubResult[0].club_id;

      // Step 2: Fetch events for this club
      const eventsQuery = `
          SELECT id, date_name,description,event_time, date_selected, approval ,is_postfeedback, zoom_link, image
          FROM event1 
          WHERE club_id = ?`;

      const eventsResult = await conn({
          query: eventsQuery,
          values: [clubId],
      });

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
          feedback: event.is_postfeedback,
          link:event.zoom_link,
          image:event.image,
      }));

      return NextResponse.json(formattedEvents);
  } catch (error) {
      console.error("API error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
  }
}