import 'dotenv/config';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { conn } from '../../../connections/conn'; // Adjust the path accordingly
//import { getSession } from 'app/lib/session'; // Adjust the import path for session

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.API_SECRET
});

export async function PUT(req, { params }) {
    try {
        const { eventId } = params; // Retrieve eventId from URL parameters
        const formData = await req.formData(); // Get form data

        // Extract form data
        const eventName = formData.get('eventName');
        const description = formData.get('description');
        const eventTime = formData.get('eventTime');
        const dateSelected = formData.get('dateSelected');
        const feedbackRaw = formData.get('isPostFeedback');
        const isPostFeedback = feedbackRaw === 'true' ? 1 : 0;
        const zoomLinkRaw = formData.get('zoomLink');
        const zoomLink = zoomLinkRaw === 'no' ? null : zoomLinkRaw;
        const imageFile = formData.get('eventImage'); // Get uploaded image
        
        let imageUrl = null;

        // Handle image upload to Cloudinary if a new image is provided
        if (imageFile) {
            const buffer = await imageFile.arrayBuffer();
            const imageBuffer = Buffer.from(buffer);

            // Upload image to Cloudinary
            imageUrl = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'events_images' }, // Set Cloudinary folder for image storage
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary Upload Error:', error);
                            reject(new Error('Image upload failed'));
                        } else {
                            resolve(result.secure_url); // Get the image URL after upload
                        }
                    }
                );
                uploadStream.end(imageBuffer); // End the upload stream with image buffer
            });
        }

        // Fetch current event data from the database to keep the old image if no new one is uploaded
        const eventQuery = `SELECT image FROM event1 WHERE id = ?`;
        const eventResult = await conn({
            query: eventQuery,
            values: [eventId],
        });

        if (eventResult.length === 0) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        // If no new image is uploaded, keep the old image URL
        if (!imageUrl) {
            imageUrl = eventResult[0].image; // Retain the old image URL
        }

        // Update event details in the database
        const updateQuery = `
            UPDATE event1
            SET 
                date_name = ?, 
                description = ?, 
                event_time = ?, 
                date_selected = ?, 
                is_postfeedback = ?, 
                zoom_link = ?, 
                image = ?,
                is_announced = ?

            WHERE id = ?
        `;

        await conn({
            query: updateQuery,
            values: [
                eventName,
                description,
                eventTime,
                dateSelected,
                isPostFeedback,
                zoomLink,
                imageUrl,
                eventId,
                isAnnounced, // ✅ این خط جدید

            ],
        });

        return NextResponse.json({ message: 'Event updated successfully' });
    } catch (error) {
        console.error('Error updating event:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
