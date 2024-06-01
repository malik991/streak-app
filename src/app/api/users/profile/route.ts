import pool from "@/lib/DbConnection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const id = searchParams.get("id");

  if (!email && !id) {
    return NextResponse.json(
      { success: false, message: "Email or ID is required" },
      { status: 400 }
    );
  }

  const client = await pool.connect();
  try {
    let result: any;
    if (email) {
      result = await client.query(`select id from users where email = $1`, [
        email,
      ]);
    } else if (id) {
      result = await client.query(`select * from profiles where user_id = $1`, [
        id,
      ]);
    }
    //console.log("resutl -------: ", result);

    if (!result || result?.rows.length === 0) {
      if (id) {
        return NextResponse.json(
          { success: true, message: "please complete your profile" },
          { status: 201 }
        );
      }
      return NextResponse.json(
        { success: false, message: "No user found via email or ID" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("error in profile api: ", error);
    return NextResponse.json(
      { success: false, message: error?.message || "internal server error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function POST(req: NextRequest) {
  const { fullName, bio } = await req.json();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");
  //console.log(fullName, " ", bio, " ", userId);
  if (!userId || !fullName) {
    return NextResponse.json(
      { success: false, message: "full name or userid not provided" },
      { status: 404 }
    );
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const checkUserExist = await client.query(
      `
    select * from profiles where user_id = $1
    `,
      [userId]
    );
    let filterQuery;
    let result;
    if (checkUserExist.rows.length > 0) {
      filterQuery = `update profiles set full_name = $1, bio = $2 where user_id = $3 RETURNING full_name, bio`;
      result = await client.query(filterQuery, [fullName, bio, userId]);
    } else {
      filterQuery = `insert into profiles (user_id, full_name, bio) VALUES ($1, $2, $3) RETURNING full_name, bio`;
      result = await client.query(filterQuery, [userId, fullName, bio]);
    }
    if (!result || result?.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { success: false, message: "please try again and fill this form" },
        { status: 404 }
      );
    }
    await client.query("COMMIT");
    return NextResponse.json(
      { success: true, message: "Profile updated successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.log("error in profile update api: ", error);
    return NextResponse.json(
      { success: false, message: error?.message || "internal server error " },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
