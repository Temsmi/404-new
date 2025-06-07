import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session'; // Adjust path if needed

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

    const query = `
      SELECT 
        s.name, s.surname, s.email, s.phone_num, s.dept, s.role, s.profile_picture,
        p.bio
      FROM student s
      LEFT JOIN president p ON s.id = p.student_id
      WHERE s.id = ? AND s.role = "president"
    `;

    const [presidentClub] = await conn({ query, values: [userId] });

    if (!presidentClub) {
      return NextResponse.json({ error: "No president club found" }, { status: 404 });
    }

    return NextResponse.json(presidentClub);
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
    const bio = formData.get('bio');
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

    // Update email if provided
    if (email !== null) {
      await conn({
        query: `UPDATE student SET email = ? WHERE id = ?`,
        values: [email, userId],
      });
    }

    // Update password if provided
    if (password !== null) {
      await conn({
        query: `UPDATE student SET password = ? WHERE id = ?`,
        values: [password, userId],
      });
    }

    // Update profile picture if uploaded
    if (profilePictureUrl) {
      await conn({
        query: `UPDATE student SET profile_picture = ? WHERE id = ?`,
        values: [profilePictureUrl, userId],
      });
    }

    // Update bio if provided
    if (bio !== null) {
      await conn({
        query: `UPDATE president SET bio = ? WHERE student_id = ?`,
        values: [bio, userId],
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
