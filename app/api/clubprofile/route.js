import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session'; // Adjust the import path for session

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

        // Fetch president information using userId
        const query = `
            SELECT 
                p.id AS president_id, 
                p.student_id, 
                p.club_id, 
                p.date_selected, 
                c.name AS club_name, 
                c.logo AS club_logo, 
                c.description AS club_description
            FROM president p 
            JOIN club c ON p.club_id = c.id 
            WHERE p.student_id = ?`;

        const [presidentClub] = await conn({ query, values: [userId] });

        if (!presidentClub) {
            return NextResponse.json({ error: "No president club found" }, { status: 404 });
        }

        return NextResponse.json(presidentClub);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Update president and club data
export async function PUT(req) {
    try {
        const { president_id, student_id, club_id, date_selected, club_name, club_logo, club_description } = await req.json();

        if (!president_id || !student_id || !club_id) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Update president info
        const presidentQuery = `UPDATE president SET student_id = ?, club_id = ?, date_selected = ? WHERE id = ?`;
        await conn({ query: presidentQuery, values: [student_id, club_id, date_selected, president_id] });

        // Update club info
        const clubQuery = `UPDATE club SET name = ?, logo = ?, description = ? WHERE id = ?`;
        await conn({ query: clubQuery, values: [club_name, club_logo, club_description, club_id] });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Database update error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
export async function PUT(req) {
    try {
      const {
        president_id,
        student_id,
        club_id,
        date_selected,
        club_name,
        club_logo,
        club_description,
        email,
        password,
      } = await req.json();
  
      // اگر ایمیل جدید فرستاده شده
      if (email && student_id) {
        const emailQuery = `UPDATE student SET email = ? WHERE id = ?`;
        await conn({ query: emailQuery, values: [email, student_id] });
      }
  
      // اگر پسورد جدید فرستاده شده
      if (password && student_id) {
        const passwordQuery = `UPDATE student SET password = ? WHERE id = ?`;
        await conn({ query: passwordQuery, values: [password, student_id] });
      }
  
      // اگر اطلاعات رئیس فرستاده شده
      if (president_id && student_id && club_id && date_selected) {
        const presidentQuery = `
          UPDATE president 
          SET student_id = ?, club_id = ?, date_selected = ? 
          WHERE id = ?
        `;
        await conn({ query: presidentQuery, values: [student_id, club_id, date_selected, president_id] });
      }
  
      // اگر اطلاعات باشگاه فرستاده شده
      if (club_id && (club_name || club_logo || club_description)) {
        const clubQuery = `
          UPDATE club 
          SET name = ?, logo = ?, description = ? 
          WHERE id = ?
        `;
        await conn({ query: clubQuery, values: [club_name, club_logo, club_description, club_id] });
      }
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Database update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }