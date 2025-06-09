import { conn } from '../../connections/conn';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rows = await conn({ query: 'SELECT * FROM club_requests WHERE status = "pending"' });
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching club requests:', error);
    return NextResponse.json({ error: 'Failed to fetch club requests' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { id, action } = await req.json();

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const status = action === 'approve' ? 'approved' : 'rejected';

    // Update the status in the club_requests table
    await conn({
      query: 'UPDATE club_requests SET status = ? WHERE id = ?',
      values: [status, id],
    });

    if (action === 'approve') {
      
      const rows = await conn({
        query: 'SELECT * FROM club_requests WHERE id = ?',
        values: [id],
      });

      const request = rows?.[0];

      if (!request) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 });
      }

      
      const result = await conn({
        query: `
          INSERT INTO club (name, logo, description, student_id)
          VALUES (?, ?, ?, ?)
        `,
        values: [request.name, request.logo, request.description, request.student_id],
      });

      const clubId = result.insertId;

      
      await conn({
        query: 'UPDATE student SET role = "president" WHERE id = ?',
        values: [request.student_id],
      });

      
await conn({
  query: `
    INSERT INTO president (student_id, club_id, date_selected)
    VALUES (?, ?, NOW())
  `,
  values: [request.student_id, clubId],
});

    }

    return NextResponse.json({ message: `Club request ${status}` }, { status: 200 });
  } catch (error) {
    console.error('Error processing club request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
