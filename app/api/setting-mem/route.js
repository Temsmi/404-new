import { NextResponse } from 'next/server';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session'; 
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req) {
  try {
    const session = await getSession(req);
    const userId = session?.userId || session?.user?.userId || session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - No userId in session" }, { status: 401 });
    }

    const query =
      'SELECT name, surname, email, phone_num, dept, role, profile_picture FROM student WHERE id = ? AND role IN ("member", "non-member")';
    const [userInfo] = await conn({ query, values: [userId] });

    if (!userInfo) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userInfo);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getSession(req);
    const userId = session?.userId || session?.user?.userId || session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const email = formData.get('email');
    const password = formData.get('password');
    const phoneNum = formData.get('phone_num');
    const imageFile = formData.get('profile_picture');

    let profilePictureUrl = null;

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      profilePictureUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'profile_picture' },
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

    if (email) {
      await conn({
        query: `UPDATE student SET email = ? WHERE id = ?`,
        values: [email, userId],
      });
    }

    if (password) {
      await conn({
        query: `UPDATE student SET password = ? WHERE id = ?`,
        values: [password, userId],
      });
    }

    if (phoneNum) {
      await conn({
        query: `UPDATE student SET phone_num = ? WHERE id = ?`,
        values: [phoneNum, userId],
      });
    }

    if (profilePictureUrl) {
      await conn({
        query: `UPDATE student SET profile_picture = ? WHERE id = ?`,
        values: [profilePictureUrl, userId],
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

