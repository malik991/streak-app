import pool from "@/lib/DbConnection";
import { NextRequest, NextResponse } from "next/server";
import {
  UploadImage,
  DeleteCloudinaryImage,
} from "@/lib/uploadImageCloudinary";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const userId = data.get("id");
  const image = data.get("pdFile") as unknown as File;
  if (!userId || !image) {
    return NextResponse.json(
      { success: false, message: "image and userId is mendatory" },
      { status: 404 }
    );
  }

  const client = await pool.connect();
  try {
    const responseData: any = await UploadImage(image, "streak-app");
    if (!responseData) {
      return NextResponse.json(
        { success: false, data: {}, message: "cloudinary upload failed" },
        { status: 400 }
      );
    }

    let filterQuery;
    let result;
    await client.query("BEGIN");

    const checkUserProfileExist = await client.query(
      `
    select * from profiles where user_id = $1
    `,
      [userId]
    );

    if (checkUserProfileExist?.rows.length > 0) {
      filterQuery = `update profiles set profile_picture_url = $2 where user_id = $1 RETURNING user_id, profile_picture_url`;
      result = await client.query(filterQuery, [
        userId,
        responseData?.secure_url,
      ]);
    } else {
      filterQuery = `Insert into profiles (user_id, profile_picture_url) VALUES ($1, $2) RETURNING user_id, profile_picture_url`;
      result = await client.query(filterQuery, [
        userId,
        responseData?.secure_url,
      ]);
    }

    if (result?.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { success: false, message: "please upload your avatar again" },
        { status: 400 }
      );
    }
    await client.query("COMMIT");

    return NextResponse.json(
      {
        success: true,
        message: "Avatr uploaded successfully",
        data: result?.rows[0],
      },
      { status: 200 }
    );
  } catch (error: any) {
    await client.query("ROLLBACK");
    return NextResponse.json(
      { success: false, message: error.message || "internal server error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
