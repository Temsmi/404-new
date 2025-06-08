import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { conn } from 'app/connections/conn';
import { getSession } from 'app/lib/session';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(req) {
  try {
    const session = await getSession(req);
    const userId = session?.user?.id || session?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const file = formData.get('file');

    if (!title || !description || !file) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const cloudinaryResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'videos_tutorial'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const videoUrl = cloudinaryResult.secure_url;

    await conn({
      query: `INSERT INTO help_tutorial (title, description, file) VALUES (?, ?, ?)`,
      values: [title, description, videoUrl]
    });

    return NextResponse.json({ message: 'Video uploaded successfully', videoUrl });
  } catch (error) {
    console.error('Video Upload Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
