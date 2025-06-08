import { NextResponse } from 'next/server';
import { conn } from 'app/connections/conn';

export async function POST(req) {
  try {
    const data = await req.json();
    const { question, answer } = data;

    if (!question || !answer) {
      return NextResponse.json({ error: 'Missing question or answer' }, { status: 400 });
    }

    await conn({
      query: `INSERT INTO faq (question, answer) VALUES (?, ?)`,
      values: [question, answer]
    });

    return NextResponse.json({ message: 'FAQ added successfully' });
  } catch (error) {
    console.error('FAQ Insert Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
