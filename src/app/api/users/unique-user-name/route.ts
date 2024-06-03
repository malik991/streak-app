import { db } from "@vercel/postgres";
//import pool from "@/lib/DbConnection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const queryParam = {
    username: searchParams.get("username"),
  };

  if (!queryParam.username) {
    return NextResponse.json({
      success: false,
      message: "user name is mendatory",
    });
  }
  const client = await db.connect();
  try {
    const result = await client.query(
      `select * from users where username = $1 AND isverified = true`,
      [queryParam.username]
    );
    if (result.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: "user already taken." },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: true,
          message: "username is available",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("error in uniquw user name API: ", error);
    return NextResponse.json(
      { success: false, message: "Error checking username unique" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
