import 'dotenv/config';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session'; // Adjust the import path for session

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(req) {
  try {
    // Step 1: Get session data
    const session = await getSession(req);
    console.log('Fetched user data:', session);

    // Step 2: Extract userId from session object
    let userId;

    // Check the different possible session formats
    if (session?.userId) {
      userId = session.userId; // Direct access if userId is available
    } else if (session?.user?.userId) {
      userId = session.user.userId; // Access userId from nested user object
    } else if (session?.user?.id) {
      userId = session.user.id; // Fallback if the userId is under a different key
    }

    // If userId is not found, return unauthorized error
    if (!userId) {
      console.error("No userId found in session.");
      return NextResponse.json({ error: "Unauthorized - No userId in session" }, { status: 401 });
    }

    // Step 3: Fetch the club_id for the president (user)
    const clubQuery = `SELECT club_id FROM president WHERE student_id = ?`;
    const clubResult = await conn({
      query: clubQuery,
      values: [userId],
    });

    // Check if the user is a president and is associated with a club
    if (!clubResult.length) {
      return NextResponse.json({ error: "Club not found for this user" }, { status: 404 });
    }

    const clubId = clubResult[0].club_id;

    // Step 4: Get event data from the request
    const formData = await req.formData();
    const eventName = formData.get('eventName');
    const description = formData.get('description');
    const eventTime = formData.get('eventTime');
    const dateSelected = formData.get('dateSelected');
    const isPostFeedback = formData.get('isPostFeedback') === 'true' ? 1 : 0;
    const zoomLink = formData.get('zoomLink') || null;
    const feedback = formData.get('feedback') || null;
    const imageFile = formData.get('eventImage');

    // Step 5: Upload image to Cloudinary (if provided)
    let imageUrl = null;

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload image to Cloudinary
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

    // Step 6: Insert event into the database
    const query = `
      INSERT INTO event1 (club_id, date_name, description, event_time, date_selected, is_postfeedback, zoom_link, image, feedback)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await conn({
      query,
      values: [clubId, eventName, description, eventTime, dateSelected, isPostFeedback, zoomLink, imageUrl, feedback]
    });

    // Step 7: Return successful response
    return NextResponse.json({ message: 'Event created successfully!' });
  } catch (error) {
    // Log the error for debugging
    console.error("Database error:", error);

    // Return error response
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
