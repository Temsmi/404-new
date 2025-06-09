import { NextResponse } from 'next/server';
import { conn } from '../../../connections/conn';
import { getSession } from 'app/lib/session';

export async function POST(req) {
  try {
    const session = await getSession(req);
    const userId = session?.userId || session?.user?.userId;
    if (!userId) throw new Error("Unauthorized");

    await conn({
      query: `UPDATE notification SET is_read = 1 WHERE user_id = ?`,
      values: [userId],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getSession(req);
    const userId = session?.userId || session?.user?.userId;
    if (!userId) throw new Error("Unauthorized");

 const rows = await conn({
      query: `
        SELECT type, message
        FROM notification
        WHERE user_id = ? AND is_read = 0
      `,
      values: [userId],
    });

    let totalUnread = 0;

    for (const row of rows) {
      if (row.type === 'chat') {
        const match = row.message.match(/\d+/);
        const count = match ? parseInt(match[0], 10) : 1;
        totalUnread += count;
      } else {
        // Count other types (like announcements) as one each
        totalUnread += 1;
      }
    }

    return NextResponse.json({ unreadCount: totalUnread });
  } catch (err) {
    console.error("Error fetching unread count:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
