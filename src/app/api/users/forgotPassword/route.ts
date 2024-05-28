import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/DbConnection";
import { emailOptions } from "@/types/emailOptions";
import { sendEmail } from "@/components/mailer";
import bcryptJs from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json(
      {
        success: false,
        message: "email not provided",
      },
      { status: 400 }
    );
  }

  const client = await pool.connect();
  try {
    const result = await client.query("select * from users where email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "THIS EMAIL IS NOT REGISTERED IN OUR DB",
        },
        { status: 404 }
      );
    }
    const emailParams: emailOptions = {
      toEmailAddress: email,
      emailType: "RESET",
      userId: result?.rows[0].id,
    };
    await sendEmail(emailParams);
    return NextResponse.json(
      {
        success: true,
        message: "PLEASE CHECK YOUR EMAIL",
        data: email,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("error in get email api for forgot pwd: ", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "internal server error",
        data: email,
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function PUT(req: NextRequest) {
  const { verifyToken, newPassword } = await req.json();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  console.log(userId, " ", verifyToken, " ", newPassword);

  if (!verifyToken || !newPassword) {
    return NextResponse.json(
      {
        success: false,
        message: "TOKEN OR PASSWORD IS NOT VALID",
      },
      { status: 400 }
    );
  }
  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        message: "USER ID IS NOT CORRECT OR NOT REGISTERED IN OUR DATABASE",
      },
      { status: 400 }
    );
  }
  const password_hash = await bcryptJs.hash(newPassword, 10);
  const client = await pool.connect();
  try {
    const result = await client.query(
      "select * from users where id = $1 AND forgotpasswordtoken = $2 AND forgotpasswordexpiry > CURRENT_TIMESTAMP ",
      [userId, verifyToken]
    );
    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid provided data or time expire regenerate code again",
        },
        { status: 400 }
      );
    }
    const updatePasswordQuery = `
    update users SET password_hash = $1,
    forgotpasswordtoken = NULL,
    forgotpasswordexpiry = NULL
    WHERE id = $2
    `;
    await client.query("BEGIN");
    await client.query(updatePasswordQuery, [password_hash, userId]);
    await client.query("COMMIT");

    return NextResponse.json(
      {
        success: true,
        message: "Password updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    await pool.query("ROLLBACK");
    console.log(
      "error while using PUT method of verifyToken for forgot password: ",
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "internal server error",
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
