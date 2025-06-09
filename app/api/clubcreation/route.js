import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function POST(req) {
  try {
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

            const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
            filePath = `${fileName}`;

      await writeFile(path.join(uploadDir, fileName), buffer);
    }

    const insertClub = await conn({
      query: `
        INSERT INTO club (name, logo, description)
        VALUES (?, ?, ?)
      `,
      values: [clubName, filePath, description]
    });

    const newClubId = insertClub.insertId;

    const defaultChannels = [
      { name: "rules", category: "welcome" },
      { name: "faq", category: "welcome" },
      { name: "announcements", category: "general" },
      { name: "general-chat", category: "general" },
      { name: "club-media", category: "general" }
    ];

    const channelValues = defaultChannels.map(({ name, category }) => [name, category, newClubId]);

    await conn({
      query: `INSERT INTO channels (name, category, club_id) VALUES ?`,
      values: [channelValues]
    });

    return NextResponse.json({ message: 'Club and default channels created successfully!' }, { status: 200 });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}