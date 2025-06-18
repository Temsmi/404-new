import { NextResponse } from 'next/server';
import { conn } from 'app/connections/conn';

export async function POST(req) {
  try {
    const { action } = await req.json();

    const result = await conn({
      query: `SELECT start, stop, publish FROM election_status WHERE id = 1`,
    });

    if (!result || result.length === 0) {
      return NextResponse.json({ message: 'Election status not found' }, { status: 404 });
    }

    let { start, stop, publish } = result[0];

    if (action === 'start') {
      start = 1;
      stop = 0;
      publish = 0;
    } else if (action === 'stop') {
      start = 0;
      stop = 1;
      publish = 0;
    } else if (action === 'publish') {
      publish = 1; 
    } else {
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }

    await conn({
      query: `
        UPDATE election_status 
        SET start = ?, stop = ?, publish = ?
        WHERE id = 1
      `,
      values: [start, stop, publish],
    });

    return NextResponse.json({ message: `Election status updated to ${action}` });
  } catch (error) {
    console.error('Election status update error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}


export async function GET(req) {
  try {
    const result = await conn({
      query: `SELECT start, stop, publish FROM election_status LIMIT 1`
    });

    if (!result || result.length === 0) {
      return NextResponse.json({ message: 'Election status not found' }, { status: 404 });
    }

    const { start, stop, publish } = result[0];

    let status = 'unknown';

    if (publish) status = 'published';
    else if (start) status = 'running';
    else if (stop) status = 'stopped';

   return NextResponse.json({
  start: Boolean(start),
  stop: Boolean(stop),
  publish: Boolean(publish),
  status
});
  } catch (err) {
    console.error('Error fetching election status:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
