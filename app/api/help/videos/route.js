import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { conn } from 'app/connections/conn';
import { getSession } from 'app/lib/session';

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    // Check session
    const session = await getSession(req);
    const userId = session?.user?.id || session?.userId;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get form data
    const formData = await req.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const file = formData.get('file');

    if (!title || !description || !file) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Read the file as base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = file.type;
    const dataUri = `data:${mimeType};base64,${base64}`;

    // Upload to Cloudinary using base64 (upload_large for chunked upload)
    const cloudinaryResult = await cloudinary.uploader.upload(dataUri, {
      resource_type: 'video',
      folder: 'videos_tutorial',
      chunk_size: 6000000, // 6MB chunks
    });

    const videoUrl = cloudinaryResult.secure_url;

    // Save to DB
    await conn({
      query: 'INSERT INTO help_tutorial (title, description, file) VALUES (?, ?, ?)',
      values: [title, description, videoUrl],
    });

    return NextResponse.json({ message: 'Uploaded successfully', url: videoUrl });
  } catch (error) {
   
    return NextResponse.json({
      error: error?.message || 'Server error',
      stack: error?.stack || null,
    }, { status: 500 });
  }
}
