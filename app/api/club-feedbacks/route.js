import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn'; 
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    let query = 'SELECT * FROM request';
    const values = [];

    if (type) {
      query += ' WHERE type = ?';
      values.push(type);
    }

    const result = await conn({ query, values });
    const data = Array.isArray(result) ? result : result ? [result] : [];

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json({ error: 'Failed to fetch feedbacks' }, { status: 500 });
  }
}

