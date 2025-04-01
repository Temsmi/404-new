import { SignupFormSchema } from 'app/lib/definitions';
import { createSession } from 'app/lib/session';
import { conn } from 'app/connections/conn';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.json();
    const validatedFields = SignupFormSchema.safeParse(formData);

    if (!validatedFields.success) {
      return NextResponse.json(
        { errors: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, sname, stdno, dept, email, phoneno, password } = validatedFields.data;

    // Insert user into the database
    const result = await conn({
      query: 'INSERT INTO student (name, surname, std_no, email, phone_num, password, dept) VALUES (?, ?, ?, ?, ?, ?, ?)',
      values: [name, sname, stdno, email, phoneno, password, dept],
    });

    if (!result || result.affectedRows === 0) {
      return NextResponse.json({ message: 'An error occurred while creating your account.' }, { status: 500 });
    }

    console.log("Inserted User:", result); // Debugging

    // Fetch role of the new user
    const userRows = await conn({
      query: "SELECT role FROM student WHERE id = ?",
      values: [result.insertId],
    });
    
    console.log("Fetched user data:", userRows);
    
    if (!userRows || userRows.length === 0) {
      console.error("Error fetching user role: No user found with ID", result.insertId);
      return NextResponse.json({ message: "Error fetching user role" }, { status: 500 });
    }
    
    const user = userRows[0]; 
    console.log("User role found:", user.role);
    

    // Create session for the new user
    await createSession(stdno, user.role); // Using stdno instead of result.insertId

    // ✅ Send response for frontend to handle redirect
    return NextResponse.json({
      message: 'Signup successful!',
      redirectTo: '/authentication/sign-in',
    });

  } catch (error) {
    console.error("Error in signup process:", error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}