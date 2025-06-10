// pages/api/metrics.js
import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';

export async function GET() {
  try {
    
    const membersResult = await conn({
      query: `SELECT COUNT(*) AS total_members FROM members`
    });

    const total_members = Number(membersResult[0]?.total_members) || 0;

   
    const activeInactiveResult = await conn({
      query: `
        SELECT 
          SUM(is_active = 1) AS active,
          SUM(is_active = 0) AS inactive
        FROM club
      `
    });

    const active_vs_inactive = {
      active: Number(activeInactiveResult[0]?.active) || 0,
      inactive: Number(activeInactiveResult[0]?.inactive) || 0
    };

   
    const requestTypesResult = await conn({
      query: `
        SELECT type, COUNT(*) AS count
        FROM request
        GROUP BY type
      `
    });

    const request_types = {};
    requestTypesResult.forEach(row => {
      request_types[row.type] = Number(row.count);
    });

   const membersPerClubResult = await conn({
  query: `
    SELECT club.name AS club_name, COUNT(members.id) AS member_count
    FROM club
    LEFT JOIN members ON club.id = members.club_id
    GROUP BY club.id, club.name
    ORDER BY member_count DESC
  `
});

const members_per_club = membersPerClubResult.map(row => ({
  club_name: row.club_name,
  member_count: Number(row.member_count)
}));



// Events per Club
const eventsPerClubResult = await conn({
  query: `
    SELECT 
      club.name AS club_name,
      COUNT(event1.id) AS event_count
    FROM club
    LEFT JOIN event1 ON club.id = event1.club_id
    GROUP BY club.id, club.name
    ORDER BY event_count DESC
  `
});

const events_per_club = eventsPerClubResult.map(row => ({
  club_name: row.club_name,
  event_count: Number(row.event_count)
}));

    const response = {
      total_members,
      active_vs_inactive,
      request_types,
    members_per_club,
  events_per_club
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
