import { NextResponse } from 'next/server';
import { conn } from 'app/connections/conn';

export async function POST(req) {
  try {
    const { question } = await req.json();

    if (!question || question.trim() === '') {
      return NextResponse.json({ error: 'Question is required.' }, { status: 400 });
    }

    await conn({
      query: 'INSERT INTO faq (question, answer) VALUES (?, ?)',
      values: [question, '']  // Empty answer for now
    });

    return NextResponse.json({ message: 'Question submitted successfully.' });
  } catch (error) {
    console.error('FAQ Submission Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
