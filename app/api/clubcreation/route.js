import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { writeFile } from 'fs/promises';
import path from 'path';

// Function to handle form data submission
export async function POST(req) {
    try {
        const formData = await req.formData();
        const clubName = formData.get('clubName');
        const description = formData.get('description');
        const rules = formData.get('rules');
        const file = formData.get('clubLogo');

        let filePath = null;

        // Handle file upload if a file is provided
        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uploadDir = path.join(process.cwd(), 'public/images/ClubsLogo');
            const fileName = `${Date.now()}-${file.name}`;
            filePath = `${fileName}`;

            // Save the file to the 'public/uploads' directory
            await writeFile(path.join(uploadDir, fileName), buffer);
        }

        // Insert club data into the database
        const query = `
            INSERT INTO club (name, logo, description, rules)
            VALUES (?, ?, ?, ?)
        `;

        await conn({
            query,
            values: [clubName, filePath, description, rules]
        });

        return NextResponse.json({ message: 'Club created successfully!' });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
