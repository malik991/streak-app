import pool from "@/lib/DbConnection";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/components/mailer";
import { emailOptions } from "@/types/emailOptions";

export async function POST(req: Request) {
  const { email, username, password } = await req.json();
  if (!username || !email || !password) {
    return Response.json(
      { success: false, error: "all fields are mendatory" },
      { status: 400 }
    );
  }
  const client = await pool.connect();
  try {
    const emailExist = await client.query(
      `select * from users where email = $1 and "isVerified" = true`,
      [email]
    );
    if (emailExist.rows.length > 0) {
      return Response.json(
        { success: false, error: "user already registered." },
        { status: 400 }
      );
    }
    const salt = await bcryptjs.genSalt(10);
    const password_hash = await bcryptjs.hash(password, salt);
    await client.query("BEGIN");
    const newUser = await client.query(
      `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, userName, email`,
      [username, email, password_hash]
    );
    //await client.query("COMMIT"); // Commit transaction

    if (newUser.rows.length === 1) {
      const insertedUser = newUser.rows[0];
      const emailParams: emailOptions = {
        toEmailAddress: insertedUser?.email,
        emailType: "VERIFY",
        userId: insertedUser?.id,
      };
      await sendEmail(emailParams, client);
      await client.query("COMMIT");
      return Response.json({
        success: true,
        message: "User registered successfully, please verify Email",
        data: {
          id: insertedUser.id,
          username: insertedUser.username,
          email: insertedUser.email,
        },
      });
    } else {
      await client.query("ROLLBACK");
      Response.json({ succes: false, message: "signup failed" });
    }
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.log("Error in signup api: ", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
