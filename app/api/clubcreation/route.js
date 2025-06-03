import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { getSession } from 'app/lib/session';

export async function POST(req) {
  try {
    // 👇 Call cookies() in the same server context
    const session = await getSession();

    console.log("SESSION:", session); // debug

    const studentId = session?.userId; // adapt to your structure

    if (!studentId) {
      return NextResponse.json({ error: 'Unauthorized: student not logged in' }, { status: 401 });
    }

    const formData = await req.formData();
    const clubName = formData.get('clubName');
    const description = formData.get('description');
    const file = formData.get('clubLogo');

    let filePath = null;

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), 'public/images/ClubsLogo');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = file.name.replace(/^\d+-/, '').replace(/\s/g, '_');
      filePath = `${fileName}`;

      await writeFile(path.join(uploadDir, fileName), buffer);
    }

    const query = `
      INSERT INTO club_requests (name, logo, description, student_id, status)
      VALUES (?, ?, ?, ?, 'pending')
    `;

    await conn({
      query,
      values: [clubName, filePath, description, studentId],
    });

    return NextResponse.json({ message: 'Club created successfully!' }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
