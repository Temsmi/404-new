import { NextResponse } from 'next/server';
import { conn } from 'app/connections/conn';

export async function GET() {
  try {
    const tutorials = await conn({ query: 'SELECT title, description, file FROM help_tutorial' }) || [];
    const faqs = await conn({ query: 'SELECT id, question, answer FROM faq' }) || [];

    const formattedTutorials = tutorials
      .filter(tut => tut && typeof tut === 'object')
      .map((tut) => ({
        title: tut.title || '',
        description: tut.description || '',
        file: tut.file || '',
      }));

    const formattedFaqs = faqs
      .filter(faq => faq && typeof faq === 'object')
      .map((faq) => ({
        id: faq.id,
        question: faq.question || '',
        answer: faq.answer || '',
      }));

    return NextResponse.json({ tutorials: formattedTutorials, faqs: formattedFaqs });
  } catch (error) {
    console.error('Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
