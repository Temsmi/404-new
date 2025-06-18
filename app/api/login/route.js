import { SignupFormSchema } from 'app/lib/definitions';
import { createSession } from 'app/lib/session';
import { conn } from 'app/connections/conn';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const validatedFields = SignupFormSchema.pick({ email: true, password: true }).safeParse({ email, password });

    if (!validatedFields.success) {
      return NextResponse.json({ errors: validatedFields.error.flatten().fieldErrors }, { status: 400 });
    }

    let result = await conn({
      query: 'SELECT * FROM student WHERE email = ? AND password = ?',
      values: [email, password],
    });

    if (!result || result.length === 0) {
      result = await conn({
        query: 'SELECT * FROM admin WHERE email = ? AND password = ?',
        values: [email, password],
      });
    }
    if (!result || result.length === 0) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const user = result[0]; 

    await createSession(user.id, user.role);

    return NextResponse.json({ success: true, role: user.role });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
