import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session';

async function getClubIdFromSession(req) {
  const session = await getSession(req);
  const userId = session?.userId || session?.user?.userId;

  if (!userId) {
    throw new Error("Unauthorized - No userId in session");
  }

  const presidentResult = await conn({
    query: `SELECT club_id FROM president WHERE student_id = ?`,
    values: [userId],
  });

  if (presidentResult?.length > 0 && presidentResult[0].club_id) {
    return [presidentResult[0].club_id];
  }

  const memberResult = await conn({
    query: `SELECT club_id FROM members WHERE student_id = ?`,
    values: [userId],
  });

  if (!memberResult || memberResult.length === 0) {
    throw new Error("User not found in members or president tables");
  }

  const clubIds = memberResult
    .map(row => row.club_id)
    .filter(Boolean);

  if (clubIds.length === 0) {
    throw new Error("No club_id found for this member");
  }

  return clubIds;
}

export async function GET(req) {
  try {
    const session = await getSession(req);
    const userId = session?.userId || session?.user?.userId;
    const clubIds = await getClubIdFromSession(req);

    if (!clubIds || clubIds.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const placeholders = clubIds.map(() => '?').join(', ');

    // SQL query
    const notifications = await conn({
      query: `
        SELECT 
          id,
          title,
          message,
          type,
          created_at,
          user_id,
          channel_id,
          message_id
        FROM notification
        WHERE club_id IN (${placeholders})
          AND (user_id = ? OR user_id IS NULL)
        ORDER BY created_at DESC
      `,
      values: [...clubIds, userId]
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received body:", body);
      const {
        type,
        club_id,      
        user_id,
        message_id,
        channel_id,
        text,
        title,
        timestamp,
        channel_name,
      } = body;
if (!club_id) {
  return NextResponse.json({ error: 'Missing club_id' }, { status: 400 });
}

const validClubIds = (await getClubIdFromSession(req)).map(Number);
if (!validClubIds.includes(Number(club_id))) {
  return NextResponse.json({ error: 'Unauthorized to write to this club' }, { status: 403 });
}

 const normalizedClubId = Array.isArray(club_id) ? club_id[0] : club_id;

if (type === 'chat') {
  if (!user_id || !channel_id || !message_id || !text || !timestamp || !channel_name) {
      console.log("❌ Missing basic required fields", { user_id, channel_id, message_id, text, timestamp,channel_name,title });
    return NextResponse.json({ error: 'Missing required chat fields' }, { status: 400 });
  }

  const existing = await conn({
    query: `
      SELECT id, message
      FROM notification
      WHERE user_id = ? AND club_id = ? AND channel_id = ? AND is_read = 0
    `,
    values: [user_id, normalizedClubId, channel_id],
  });

  if (existing.length > 0) {
    const prev = existing[0];
    const match = prev.message.match(/\d+/);
    const newCount = match ? parseInt(match[0]) + 1 : 2;

    const updatedMessage = `You have ${newCount} messages in ${channel_name}`;
    await conn({
      query: `
        UPDATE notification
        SET message = ?, created_at = ?
        WHERE id = ?
      `,
      values: [updatedMessage, new Date(timestamp), prev.id],
    });
  } else {
    const initialMessage = `You have a new message in ${channel_name}`;

    await conn({
      query: `
        INSERT INTO notification (club_id, title, message, type, created_at, user_id, channel_id, message_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [normalizedClubId, title, initialMessage, type, timestamp, user_id, channel_id, message_id],
    });
  }

  return NextResponse.json({ success: true });
}


    if (type === 'announcement') {
      if (!title ||!text|| !timestamp || !type) {
        return NextResponse.json({ error: 'Missing required announcement fields' }, { status: 400 });
      }

      const result = await conn({
        query: `
          INSERT INTO notification (club_id, title, message, type, created_at)
          VALUES (?, ?, ?, ?, ?)
        `,
        values: [normalizedClubId, title, text, type, timestamp],
      });

      return NextResponse.json({ success: true, id: result.insertId });
    }
    return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}