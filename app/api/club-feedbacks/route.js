import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';

import { getSession } from 'app/lib/session';

export async function GET(req) {
  try {
    const session = await getSession();

    if (!session || session.role !== 'president') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clubResult = await conn({
      query: `SELECT club_id FROM president WHERE student_id = ?`,
      values: [session.userId],
    });

    if (!clubResult.length) {
      return NextResponse.json({ data: [] });
    }

    const clubId = clubResult[0].club_id;

    const requestResult = await conn({
  query: `
    SELECT 
      r.id,
      r.student_id,
      CONCAT(s.name, ' ', s.surname) AS student_name,
      r.reg_num,
      r.type,
      r.text,
      r.status,
      r.anonymous,
      r.club_id
    FROM request r
    LEFT JOIN student s ON r.student_id = s.id
    WHERE r.club_id = ?
    ORDER BY r.id DESC
  `,
  values: [clubId],
});


    const requests = Array.isArray(requestResult) ? requestResult : [requestResult];

    
    const data = requests.map(req => {
      if (req.anonymous === 1 || req.anonymous === true || req.anonymous === '1') {
        return { ...req, student_id: null,
      student_name: null, }; 
      }
      
      return req;
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json({ error: 'Failed to fetch feedbacks' }, { status: 500 });
  }
}
