import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session';
import fs from 'fs';
import path from 'path';

// کنترل ورودی‌های مختلف (GET, PUT, POST)
export async function GET(req) {
    try {
        const session = await getSession(req);

        let userId = session?.userId || session?.user?.userId;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized - No userId in session" }, { status: 401 });
        }

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

        const result = await conn({ query, values: [userId] });
        const presidentClub = Array.isArray(result) ? result[0] : result;

        if (!presidentClub) {
            return NextResponse.json({ error: "No president club found" }, { status: 404 });
        }

        return NextResponse.json(presidentClub);
    } catch (error) {
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

        if (email && student_id) {
            await conn({ query: `UPDATE student SET email = ? WHERE id = ?`, values: [email, student_id] });
        }

        if (password && student_id) {
            await conn({ query: `UPDATE student SET password = ? WHERE id = ?`, values: [password, student_id] });
        }

        if (president_id && student_id && club_id && date_selected) {
            await conn({
                query: `UPDATE president SET student_id = ?, club_id = ?, date_selected = ? WHERE id = ?`,
                values: [student_id, club_id, date_selected, president_id],
            });
        }

        if (club_id && (club_name || club_logo || club_description)) {
            await conn({
                query: `UPDATE club SET name = ?, logo = ?, description = ? WHERE id = ?`,
                values: [club_name, club_logo, club_description, club_id],
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = file.name.replace(/^\d+-/, '').replace(/\s/g, '_');
        const uploadPath = path.join(process.cwd(), 'public/images/ClubsLogo');

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        const filePath = path.join(uploadPath, fileName);
        fs.writeFileSync(filePath, buffer);

        return NextResponse.json({ filePath: fileName });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
