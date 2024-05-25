import pool from "@/lib/DbConnection";
import { sendEmail } from "@/components/mailer";
import { emailOptions } from "@/types/emailOptions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email is required" },
      { status: 400 }
    );
  }
  const client = await pool.connect();
  try {
    const user = await client.query(
      `SELECT id, "isVerified" FROM users WHERE email = $1`,
      [email]
    );
    if (user.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    if (user.rows[0]?.isVerified) {
      return NextResponse.json(
        { success: false, message: "Email already verified" },
        { status: 400 }
      );
    }

    const emailParams: emailOptions = {
      toEmailAddress: email,
      emailType: "VERIFY",
      userId: user.rows[0]?.id,
    };

    await sendEmail(emailParams);
    return NextResponse.json({
      success: true,
      message: "Token Resend, please verify Email",
      data: {},
    });
  } catch (error: any) {
    console.error("error in resend token API: ", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
