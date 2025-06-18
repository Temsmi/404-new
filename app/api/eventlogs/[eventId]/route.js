import 'dotenv/config';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { conn } from '../../../connections/conn'; 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.API_SECRET
});

export async function PUT(req, { params }) {
    try {
        const { eventId } = params; 
        const formData = await req.formData(); 
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

        
        if (imageFile) {
            const buffer = await imageFile.arrayBuffer();
            const imageBuffer = Buffer.from(buffer);

           
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
                uploadStream.end(imageBuffer); 
            });
        }

        
        const eventQuery = `SELECT image FROM event1 WHERE id = ?`;
        const eventResult = await conn({
            query: eventQuery,
            values: [eventId],
        });

        if (eventResult.length === 0) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

       
        if (!imageUrl) {
            imageUrl = eventResult[0].image; 
        }

        
const updateQuery = `
    UPDATE event1
    SET 
        date_name = ?, 
        description = ?, 
        event_time = ?, 
        date_selected = ?, 
        is_postfeedback = ?, 
        zoom_link = ?, 
        image = ?
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
    ],
});


        return NextResponse.json({ message: 'Event updated successfully' });
    } catch (error) {
        console.error('Error updating event:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
