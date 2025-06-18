import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file || typeof file === "string" || file.size === 0) {
      return NextResponse.json({ error: "Invalid or empty file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileUrl = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'files', 
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            reject(new Error("File upload failed"));
          } else {
            resolve(result.secure_url);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Something went wrong during upload" }, { status: 500 });
  }
}