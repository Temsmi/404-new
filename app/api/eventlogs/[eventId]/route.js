export async function GET(request, { params }) {
    const { eventId } = params;
  
    // Replace with DB fetch
    const event = { id: eventId, name: 'Sample Event', description: 'Description here', date: '2025-04-05' };
  
    return new Response(JSON.stringify({ event }), { status: 200 });
  }
  
  export async function PUT(request, { params }) {
    const { eventId } = params;
    const body = await request.json();
  
    // Replace with DB update logic
    console.log(`Updating event ${eventId}`, body);
  
    return new Response(JSON.stringify({ message: 'Event updated' }), { status: 200 });
  }
  