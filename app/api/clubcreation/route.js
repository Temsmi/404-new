import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

// Function to handle form data submission
export async function POST(req) {
    try {
        const formData = await req.formData();
        const clubName = formData.get('clubName');
        const description = formData.get('description');
        const file = formData.get('clubLogo');

        let filePath = null;

        // Check if file exists
        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uploadDir = path.join(process.cwd(), 'public/images/ClubsLogo');

            // Ensure directory exists
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
            filePath = `/images/ClubsLogo/${fileName}`;

            await writeFile(path.join(uploadDir, fileName), buffer);
        }

        // Insert into the database
        const query = `
            INSERT INTO club (name, logo, description)
            VALUES (?, ?, ?)
        `;

        await conn({
            query,
            values: [clubName, filePath, description]
        });

        return NextResponse.json({ message: 'Club created successfully!' }, { status: 200 });

    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
