import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session';

async function getSessionUser(req) {
  const session = await getSession(req);
  const userId = session?.userId || session?.user?.userId;
  if (!userId) throw new Error("Unauthorized - No userId in session");
  return userId;
}

export async function GET(req) {
  try {
    const user_id = await getSessionUser(req);
    const searchParams = req.nextUrl.searchParams;
    const channel = searchParams.get("channel");
    const club_id = parseInt(searchParams.get("club_id"));

 if (!channel || isNaN(club_id)) {
      return NextResponse.json({ error: "Missing or invalid channel or club_id" }, { status: 400 });
    }

    const result = await conn({
      query:  `
        SELECT 
          c.user_id,
          c.message AS text,
          c.audio,
          c.image,
          c.type,
          c.time AS timestamp,
          s.name AS username,
          s.profile_picture AS avatar
        FROM chats c
        LEFT JOIN student s ON c.user_id = s.id
        WHERE c.club_id = ? AND c.channel = ?
        ORDER BY c.time ASC
      `,
      values: [club_id, channel],
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const sessionUserId = await getSessionUser(req);
    const { text, audio, image, message_type, channel, user_id, club_id, timestamp} = await req.json();
if (!message_type || !channel || !timestamp || !club_id || !user_id) {
  return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
}

if (message_type === "text" && !text) {
  return NextResponse.json({ error: "Text is required for text messages" }, { status: 400 });
}

if (message_type === "audio" && !audio) {
  return NextResponse.json({ error: "Audio is required for audio messages" }, { status: 400 });
}


    if (Number(user_id) !== sessionUserId) {
      return NextResponse.json({ error: "User mismatch" }, { status: 403 });
    }

    const clubId = Array.isArray(club_id) ? club_id[0] : club_id;
    const date = new Date(timestamp);
    
    const result = await conn({
      query: `
        INSERT INTO chats (club_id, user_id, message, audio, image, type, channel, time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [clubId, user_id, text || null, audio || null,image || null, message_type, channel, date],
    });

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}