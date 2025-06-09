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
    const club_id = await getClubIdFromSession(req); // Expecting an array

    if (!Array.isArray(club_id) || club_id.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const placeholders = club_id.map(() => "?").join(",");

    const result = await conn({
      query: `SELECT id, name, category, club_id FROM channels WHERE club_id IN (${placeholders})`,
      values: club_id,
    });

    const channels = result.map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      club_id: row.club_id,
    }));

    return NextResponse.json(channels);
  } catch (error) {
    console.error("GET /channels error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}