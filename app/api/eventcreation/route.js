import 'dotenv/config';  // Ensure this is at the top
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { conn } from '../../connections/conn';

// Debugging logs to check if .env values are loaded correctly
console.log("Cloud Name:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET);  // Should NOT be undefined

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET  // Ensure this is defined
});

// API route function
export async function POST(req) {
    try {
        const formData = await req.formData();
        const eventName = formData.get('eventName');
        const description = formData.get('description');
        const dateSelected = formData.get('dateSelected');
        const isPostFeedback = formData.get('isPostFeedback') === 'true' ? 1 : 0;
        const zoomLink = formData.get('zoomLink') || null;
        const imageFile = formData.get('eventImage');
        const clubId = 15;

        let imageUrl = null;

        // Upload image to Cloudinary
        if (imageFile) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Wrap Cloudinary upload in a Promise
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

        // SQL query to insert the event data
        const query = `
            INSERT INTO event1 (club_id, date_name, description, date_selected, is_postfeedback, zoom_link, image)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        // Execute the database query
        await conn({
            query,
            values: [clubId, eventName, description, dateSelected, isPostFeedback, zoomLink, imageUrl]
        });

        // Return a successful response
        return NextResponse.json({ message: 'Event created successfully!' });
    } catch (error) {
        console.error("Database error:", error);
        // Return an error response if something goes wrong
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
