import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { conn } from '../../connections/conn';
import { getSession } from 'app/lib/session'; 

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

   
    const [studentData] = await conn({
      query: `
        SELECT id, name, surname, email, phone_num, dept, role, profile_picture
        FROM student
        WHERE id = ?
      `,
      values: [userId],
    });

    if (!studentData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

   
    let bio = null;
    if (studentData.role === "president") {
      const [presidentData] = await conn({
        query: `SELECT bio FROM president WHERE student_id = ?`,
        values: [userId],
      });

      bio = presidentData?.bio || null;
    }

    return NextResponse.json({
      ...studentData,
      bio, 
    });
  } catch (error) {
    console.error("Database error:", error);
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

    const contentType = req.headers.get("content-type") || "";

    let email, password, bio, phoneNum;
    let profilePictureUrl = null;

    if (contentType.includes("application/json")) {
      const data = await req.json();
      email = data.email || null;
      password = data.password || null;
      phoneNum = data.phone_num || null;
      bio = data.bio || null;
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      email = formData.get("email");
      password = formData.get("password");
      phoneNum = formData.get("phone_num");
      bio = formData.get("bio");
      const imageFile = formData.get("profile_picture");

      if (imageFile && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        profilePictureUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'profile_picture' },
            (error, result) => {
              if (error) reject(new Error("Image upload failed"));
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(buffer);
        });
      }
    } else {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
    }

    if (email !== null) {
      await conn({ query: `UPDATE student SET email = ? WHERE id = ?`, values: [email, userId] });
    }

    if (password !== null) {
      await conn({ query: `UPDATE student SET password = ? WHERE id = ?`, values: [password, userId] });
    }

    if (phoneNum !== null) {
      await conn({ query: `UPDATE student SET phone_num = ? WHERE id = ?`, values: [phoneNum, userId] });
    }

    if (profilePictureUrl) {
      await conn({ query: `UPDATE student SET profile_picture = ? WHERE id = ?`, values: [profilePictureUrl, userId] });
    }

    if (bio !== null) {
      await conn({ query: `UPDATE president SET bio = ? WHERE student_id = ?`, values: [bio, userId] });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
