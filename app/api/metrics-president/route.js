import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session';

export async function GET(req) {
    try {
        const session = await getSession(req);
        let userId = session?.userId || session?.user?.userId;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized - No userId in session" }, { status: 401 });
        }

        const queryClub = `SELECT club_id FROM president WHERE student_id = ?`;
        const resultClub = await conn({ query: queryClub, values: [userId] });

        const club_id = Array.isArray(resultClub) ? resultClub[0]?.club_id : resultClub?.club_id;

        if (!club_id) {
            return NextResponse.json({ error: "President club_id not found" }, { status: 404 });
        }

        const queryMembers = `SELECT COUNT(*) AS total FROM members WHERE club_id = ?`;
        const resultMembers = await conn({ query: queryMembers, values: [club_id] });

        const totalMembers = Array.isArray(resultMembers) ? resultMembers[0]?.total : resultMembers?.total || 0;

        const queryRequestsByTypeAnon = `
            SELECT type, anonymous, COUNT(*) AS total
            FROM request
            WHERE club_id = ?
            GROUP BY type, anonymous
        `;

        const resultRequestsByTypeAnon = await conn({ query: queryRequestsByTypeAnon, values: [club_id] });

        const requestsByTypeAnon = Array.isArray(resultRequestsByTypeAnon) ? resultRequestsByTypeAnon : [];


const queryRecentAnnouncements = `
    SELECT id, date, text
    FROM announcement
    WHERE club_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
    ORDER BY date DESC
    LIMIT 10
`;

const resultRecentAnnouncements = await conn({ query: queryRecentAnnouncements, values: [club_id] });
const recentAnnouncements = Array.isArray(resultRecentAnnouncements) ? resultRecentAnnouncements : [];


const queryMembers1 = `
    SELECT 
        s.id AS student_id,
        s.name AS student_name,
        s.std_no AS student_number,
        s.dept AS department
    FROM members m
    JOIN student s ON m.student_id = s.id
    WHERE m.club_id = ?
`;


const resultMembersList = await conn({ query: queryMembers1, values: [club_id] });
const members = Array.isArray(resultMembersList) ? resultMembersList : [];

        return NextResponse.json({
            totalMembers,
            requestsByTypeAnon,
            recentAnnouncements,
            members
        });

    } catch (error) {
        console.error('Error in /api/metrics-president:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
