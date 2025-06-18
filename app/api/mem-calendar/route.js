import { conn } from '../../connections/conn'; 
import { getSession } from 'app/lib/session';

export async function GET(req) {
  try {
    
    const session = await getSession(req);

    let userId;
    if (session.userId) {
      userId = session.userId;
    } else if (session.user && session.user.userId) {
      userId = session.user.userId;
    } else {
      return new Response(JSON.stringify({ error: "Unauthorized - No userId in session" }), { status: 401 });
    }
    const query = 'SELECT club_id FROM members WHERE student_id = ?';
    const results = await conn({ query, values: [userId] }); 

    if (!results || results.length === 0) {
      return new Response(JSON.stringify({ error: "Club not found for this user" }), { status: 404 });
    }

    const clubId = results[0].club_id;
    return new Response(JSON.stringify({ clubId }), { status: 200 });
  } catch (error) {
    console.error("Error fetching club:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}