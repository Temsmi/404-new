import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session'; 
export async function GET(req) {
    try {
        const session = await getSession(req);
        console.log("Session:", session);

        let userId;
        if (session?.userId) {
            userId = session.userId;
        } else if (session?.user?.userId) {
            userId = session.user.userId;
        } else {
            console.error("No userId found in session.");
            return NextResponse.json({ error: "Unauthorized - No userId in session" }, { status: 401 });
        }

        console.log("User ID from session:", userId);
  
        const query =
        'SELECT name, email, role FROM admin WHERE id = ? AND role = "admin"';
  
        const [adminClub] = await conn({ query, values: [userId] });

        if (!adminClub) {
            return NextResponse.json({ error: "No admin club found" }, { status: 404 });
        }

        return NextResponse.json(adminClub);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
      const session = await getSession(req);
      const userId = session?.userId || session?.user?.userId;
  
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const { email, password } = await req.json();
  
      if (!email && !password) {
        return NextResponse.json({ error: "No fields to update" }, { status: 400 });
      }
  
      if (email) {
        await conn({
          query: `UPDATE admin SET email = ? WHERE id = ?`,
          values: [email, userId],
        });
      }
  
      if (password) {
        
        await conn({
          query: `UPDATE admin SET password = ? WHERE id = ?`,
          values: [password, userId],
        });
      }
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
