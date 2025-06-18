import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    await conn({
      query: 'UPDATE request SET status = ? WHERE id = ?',
      values: [status, id],
    });

    return NextResponse.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating feedback status:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}