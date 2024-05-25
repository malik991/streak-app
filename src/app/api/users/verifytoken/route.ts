import pool from "@/lib/DbConnection";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token) {
    return NextResponse.json(
      { success: false, message: "token is not valid" },
      { status: 500 }
    );
  }
  const client = await pool.connect();
  try {
    const checkUserFromToken = await client.query(
      `SELECT * FROM USERS WHERE "verifytoken" = $1 AND "verifytokenexpiry" > CURRENT_TIMESTAMP`,
      [token]
    );
    if (checkUserFromToken.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email verification token or time expire, please try again",
        },
        { status: 400 }
      );
    }
    const userId = checkUserFromToken.rows[0].id;
    const updateUserQuery = `
  UPDATE USERS
  SET "isVerified" = true,
      "verifytoken" = NULL,
      "verifytokenexpiry" = NULL
  WHERE id = $1
`;
    await client.query("BEGIN");
    await client.query(updateUserQuery, [userId]);
    await client.query("COMMIT");

    return NextResponse.json(
      { success: true, message: "user verified" },
      { status: 200 }
    );
  } catch (error: any) {
    await pool.query("ROLLBACK");
    console.error("error in verify token API: ", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "internal server Error",
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
