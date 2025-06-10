
import { NextResponse } from 'next/server';
import { conn } from 'app/connections/conn';

export async function PUT(req, { params }) {
  const faqId = parseInt(params.id, 10); 

  if (isNaN(faqId)) {
    console.log("Invalid FAQ ID:", params.id);
    return NextResponse.json({ error: 'Invalid FAQ ID' }, { status: 400 });
  }

  const { answer } = await req.json();
  console.log("FAQ ID:", faqId);
  console.log("Answer:", answer);

  if (!answer || answer.trim() === '') {
    return NextResponse.json({ error: 'Answer is required' }, { status: 400 });
  }

  try {
    const result = await conn({
      query: 'UPDATE faq SET answer = ? WHERE id = ?',
      values: [answer, faqId],
    });

    console.log("Query result:", result);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Answer published successfully.' });
  } catch (err) {
    console.error('Error updating FAQ:', err);
    return NextResponse.json({ error: 'Failed to update answer' }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  const faqId = params.id;

  try {
    await conn({
      query: 'DELETE FROM faq WHERE id = ?',
      values: [faqId],
    });

    return NextResponse.json({ message: 'Question deleted successfully.' });
  } catch (err) {
    console.error('Error deleting FAQ:', err);
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
  }
}
