import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn'; 

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const clubId = searchParams.get('club_id');

  if (!clubId) {
    return NextResponse.json({ error: 'Missing club_id' }, { status: 400 });
  }

  try {
    const query = `SELECT * FROM club WHERE id = ?`;
    const values = [clubId];

    const result = await conn({ query, values });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    if (result.length === 0) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}