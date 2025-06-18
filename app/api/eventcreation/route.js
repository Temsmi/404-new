import 'dotenv/config';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session'; 

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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

    if (!userId) {
      console.error("No userId found in session.");
      return NextResponse.json({ error: "Unauthorized - No userId in session" }, { status: 401 });
    }

    const clubQuery = `SELECT club_id FROM president WHERE student_id = ?`;
    const clubResult = await conn({
      query: clubQuery,
      values: [userId],
    });

    if (!clubResult.length) {
      return NextResponse.json({ error: "Club not found for this user" }, { status: 404 });
    }

    const clubId = clubResult[0].club_id;

    const formData = await req.formData();
    const eventName = formData.get('eventName');
    const description = formData.get('description');
    const eventTime = formData.get('eventTime');
    const dateSelected = formData.get('dateSelected');
    const isPostFeedback = formData.get('isPostFeedback') === 'true' ? 1 : 0;
    const zoomLink = formData.get('zoomLink') || null;
    const feedback = formData.get('feedback') || null;
    const imageFile = formData.get('eventImage');

    let imageUrl = null;

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'events_images' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary Upload Error:', error);
              reject(new Error('Image upload failed'));
            } else {
              resolve(result.secure_url);
            }
          }
        );
        uploadStream.end(buffer);
      });
    }

    const query = `
      INSERT INTO event1 (club_id, date_name, description, event_time, date_selected, is_postfeedback, zoom_link, image, feedback)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await conn({
      query,
      values: [clubId, eventName, description, eventTime, dateSelected, isPostFeedback, zoomLink, imageUrl, feedback]
    });

    return NextResponse.json({ message: 'Event created successfully!' });
  } catch (error) {
    console.error("Database error:", error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
