import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';

export async function GET() {
    try {
        const query = `
            SELECT 
                e.id, 
                e.date_name AS title, 
                e.description, 
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
        
        // Execute the query and get the results
        const [events] = await conn({ query });
        
        // Return the events data as JSON
        return NextResponse.json(events);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Example PUT API to update approval status and feedback
export async function PUT(req, res) {
    const { id, status, feedback } = req.body; // Get the values from the request body
  
    try {
      // Database query to update the request's approval status and feedback
      const query = `
        UPDATE event1 
        SET approval = ?, feedback = ?
        WHERE id = ?
      `;
  
      // Update approval status (true = approved, false = denied) and feedback
      await conn.query(query, [status, feedback || null, id]);
  
      // Return success response
      res.status(200).json({ message: 'Request updated successfully' });
    } catch (error) {
      console.error('Error updating request:', error);
      res.status(500).json({ error: error.message });
    }
  }
  