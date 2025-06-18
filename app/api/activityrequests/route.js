import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';

export async function GET() {
    try {
        const query = `
            SELECT 
                e.id, 
                e.club_id,
                e.date_name AS title, 
                e.description, 
                e.event_time AS time,
                e.date_selected AS date, 
                e.is_postfeedback AS hasFeedback, 
                e.zoom_link AS zoomLink, 
                e.image, 
                e.approval AS status, 
                e.feedback AS reason,
                c.name AS clubName  -- Join the club table to get the name of the club
            FROM event1 e
            LEFT JOIN club c ON e.club_id = c.id  -- Join event1 with club using club_id
            WHERE e.approval IN (0, 1)  -- Filter for pending (0) or approved/denied (1)
        `;
        
        
        const events = await conn({ query });
        
        return NextResponse.json(events);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function PUT(req) {
  try {
      const body = await req.json();
      console.log("Request Body:", body); //
      const { id, status, feedback } = body;
      console.log(`Updating activity request with ID: ${id}`);
      if (!body || !body.id) {
        return NextResponse.json({ error: "Missing 'id' in request" }, { status: 400 });
    }
      const query = `
        UPDATE event1 
        SET approval = ?, feedback = ?
        WHERE id = ?
      `;
  
      
       await conn({ query, values: [status, feedback || null, id] });
    

      const updatedQuery = `SELECT * FROM event1 WHERE id = ?`;
      const updatedRequest = await conn({ query: updatedQuery, values: [id] });
      console.log("Updated request:", updatedRequest[0]); 

      return NextResponse.json(updatedRequest[0], { status: 200 });

  } catch (error) {
      console.error('Error updating request:', error);
      res.status(500).json({ error: error.message });
    }
  }
  