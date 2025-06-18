import 'dotenv/config';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session';


cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function GET(req) {
  try {
    const session = await getSession(req);

    let userId;
    if (session?.userId) {
      userId = session.userId;
    } else if (session?.user?.userId) {
      userId = session.user.userId;
    } else if (session?.user?.id) {
      userId = session.user.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - No userId in session" }, { status: 401 });
    }

    
    const userResult = await conn({
      query: 'SELECT name, surname FROM student WHERE id = ?',
      values: [userId],
    });

    const user = userResult[0] || {};

    
   const clubsResult = await conn({
  query: `
    SELECT c.id, c.name
    FROM club c
    INNER JOIN members m ON m.club_id = c.id
    WHERE m.student_id = ?
  `,
  values: [userId],
});

    return NextResponse.json({
      name: user.name,
      surname: user.surname,
      clubs: clubsResult,
    });
  } catch (error) {
    console.error("Error in GET /api/become-candidate:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const session = await getSession(req);

    let userId;
    if (session?.userId) {
      userId = session.userId;
    } else if (session?.user?.userId) {
      userId = session.user.userId;
    } else if (session?.user?.id) {
      userId = session.user.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - No userId in session" }, { status: 401 });
    }

    const formData = await req.formData();
    const clubId = formData.get('club_id');
    const bio = formData.get('bio');
    const photo = formData.get('photo');

    if (!clubId || !bio || !photo) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    
    const existingCandidateCheck = await conn({
      query: `SELECT * FROM candidate WHERE student_id = ?`,
      values: [userId],
    });

    if (existingCandidateCheck.length > 0) {
      return NextResponse.json({ error: 'You have already applied as a candidate for another club.' }, { status: 400 });
    }


    let photoUrl = null;
    if (photo && typeof photo.arrayBuffer === 'function') {
      const buffer = Buffer.from(await photo.arrayBuffer());

      photoUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'CandidatesPhotos' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(new Error('Photo upload failed'));
            } else {
              resolve(result.secure_url);
            }
          }
        );
        uploadStream.end(buffer);
      });
    }

    
    const insertQuery = `
      INSERT INTO candidate (student_id, club_id, bio, photo, amount_of_votes)
      VALUES (?, ?, ?, ?, 0)
    `;
    await conn({
      query: insertQuery,
      values: [userId, clubId, bio, photoUrl],
    });

    return NextResponse.json({ success: true, message: 'You are now a candidate!' });

  } catch (error) {
    console.error("Error in POST /api/become-candidate:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
