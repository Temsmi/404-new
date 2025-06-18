import { conn } from 'app/connections/conn';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json({ message: 'Email and new password are required' }, { status: 400 });
    }

    console.log("Trying to update password for:", email);
    console.log("SQL VALUES:", [newPassword, email]);

    const result = await conn({
      query: 'UPDATE student SET password = ? WHERE email = ?',
      values: [newPassword, email],
    });

    console.log("Update result:", result);

    if (!result || result.affectedRows === 0) {
      return NextResponse.json({ message: 'No account found with that email or password unchanged' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
