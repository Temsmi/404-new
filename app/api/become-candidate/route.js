import 'dotenv/config';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session'; // Adjust the import path for session

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET Request: Fetch user information and clubs
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

    console.log('User ID:', userId);  // Debugging line

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - No userId in session" }, { status: 401 });
    }

    // Fetch user details
    const userQuery = `SELECT name, surname FROM student WHERE id = ?`;
    const userResult = await conn({ query: userQuery, values: [userId] });

    if (!userResult.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { name, surname } = userResult[0];

    // Fetch the clubs the user is a member of
    const clubQuery = `SELECT c.id AS id, c.name AS name FROM members m JOIN club c ON m.club_id = c.id WHERE m.student_id = ?`;
    const clubs = await conn({ query: clubQuery, values: [userId] });

    return NextResponse.json({ name, surname, clubs });
  } catch (error) {
    console.error("Error in GET /api/become-candidate:", error);
    return NextResponse.json({ error: error.message || 'Failed to fetch user data' }, { status: 500 });
  }
}

// POST Request: Handle becoming a candidate
export async function POST(req) {
  try {
    const session = await getSession(req);
    console.log('Fetched user data:', session);

    let userId;
    if (session?.userId) {
      userId = session.userId;
    } else if (session?.user?.userId) {
      userId = session.user.userId;
    } else if (session?.user?.id) {
      userId = session.user.id;
    }

    console.log('User ID:', userId);  // Debugging line

    if (!userId) {
      console.error("No userId found in session.");
      return NextResponse.json({ error: "Unauthorized - No userId in session" }, { status: 401 });
    }

    // Check if the user is already a candidate for the selected club
    const { clubId } = await req.formData();
    
    console.log('Form Data:', { clubId });  // Debugging line

    const candidateCheckQuery = `
      SELECT * FROM candidate WHERE student_id = ? AND club_id = ?
    `;
    const candidateCheckResult = await conn({
      query: candidateCheckQuery,
      values: [userId, clubId],
    });

    console.log('Candidate Check Result:', candidateCheckResult);  // Debugging line

    if (candidateCheckResult.length > 0) {
      return NextResponse.json({ error: 'You are already a candidate for this club.' }, { status: 400 });
    }

    // Fetch the clubs the user is a member of
    const clubResult = await conn({
      query: `SELECT c.id AS club_id, c.name AS club_name FROM members m JOIN club c ON m.club_id = c.id WHERE m.student_id = ?`,
      values: [userId],
    });

    if (!clubResult.length) {
      return NextResponse.json({ error: "No clubs found for this user" }, { status: 404 });
    }

    // Get form data
    const formData = await req.formData();
    const bio = formData.get('bio');
    const photo = formData.get('photo');

    if (!bio || !photo) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Cloudinary Upload
    let photoUrl = null;
    if (photo && typeof photo.arrayBuffer === 'function') {
      const buffer = Buffer.from(await photo.arrayBuffer());

      photoUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'CandidatesPhotos' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary Upload Error:', error);
              reject(new Error('Photo upload failed'));
            } else {
              resolve(result.secure_url);
            }
          }
        );
        uploadStream.end(buffer);
      });
    }

    // Insert candidate into the database
    const insertQuery = `
      INSERT INTO candidate (student_id, club_id, bio, photo, amount_of_votes)
      VALUES (?, ?, ?, ?, 0)
    `;

    const insertResult = await conn({
      query: insertQuery,
      values: [userId, clubId, bio, photoUrl],
    });

    console.log("Insert Result:", insertResult);  // Debugging line

    return NextResponse.json({ success: true, message: 'You are now a candidate!' });
  } catch (error) {
    console.error("Error in POST /api/become-candidate:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
