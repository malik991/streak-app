import nodemailer from "nodemailer";
import { emailOptions } from "@/types/emailOptions";
import { v4 as uuidv4 } from "uuid";
//import pool from "@/lib/DbConnection";
import { db } from "@vercel/postgres";
import fs from "fs";
import ejs from "ejs";
//import { PoolClient } from "pg";
import { VercelPoolClient } from "@vercel/postgres";
import path from "path";

export const sendEmail = async (
  { toEmailAddress, emailType, userId }: emailOptions,
  client: VercelPoolClient | null = null
) => {
  let localClient = client;
  let hashedToken;
  try {
    const releaseClient = !client; // Flag to determine if we need to release the client

    if (!localClient) {
      localClient = await db.connect();
    }

    if (emailType === "VERIFY") {
      hashedToken = uuidv4();
    } else if (emailType === "RESET") {
      // generate 6 digit code
      hashedToken = Math.floor(100000 + Math.random() * 900000).toString();
    }
    let templateForEmailVerification = "";
    if (emailType === "VERIFY") {
      const verifyPath = path.resolve(
        process.cwd(),
        "src/components/layout/emailTemplate.ejs"
      );
      templateForEmailVerification = fs.readFileSync(verifyPath, "utf8");
    } else if (emailType === "RESET") {
      const forgotPath = path.resolve(
        process.cwd(),
        "src/components/layout/forgotPassEmail.ejs"
      );
      templateForEmailVerification = fs.readFileSync(forgotPath, "utf8");
    }

    // Render the EJS template with the required data
    const htmlTemplate = ejs.render(templateForEmailVerification, {
      domain: process.env.DOMAIN,
      hashedToken,
      emailType,
      userId,
    });

    const fromEmail = process.env.SEND_FROM_EMAIL;
    if (emailType === "VERIFY") {
      const timestamp = Date.now() + 3600000; // Adds 1 hour to the current timestamp
      const tokenExpiry: any = new Date(timestamp); // Converts timestamp to ISO format

      await localClient.query("BEGIN");
      const respo = await localClient.query(
        `UPDATE users SET "verifytoken" = $1, "verifytokenexpiry" = $2 WHERE id = $3`,
        [hashedToken, tokenExpiry, userId]
      );
      if (!client && localClient) {
        await localClient.query("COMMIT");
      }
    } else if (emailType === "RESET") {
      const timestamp = Date.now() + 3600000; // Adds 1 hour to the current timestamp
      const tokenForgotPasswordExpiry: any = new Date(timestamp); // Converts timestamp to ISO format

      await localClient.query("BEGIN");
      await localClient.query(
        `UPDATE users SET "forgotpasswordtoken" = $1, "forgotpasswordexpiry" = $2 WHERE id = $3`,
        [hashedToken, tokenForgotPasswordExpiry, userId]
      );
      if (!client && localClient) {
        await localClient.query("COMMIT");
      }
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.NODEMAILER_HOST,
      port: parseInt(process.env.NODEMAILER_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.NODEMAILER_AUTH_USER,
        pass: process.env.NODEMAILER_AUTH_PWD,
      },
    });

    const mailOptions = {
      from: <any>{
        name: "Streak App 👻",
        address: fromEmail,
      },
      to: toEmailAddress,
      subject:
        emailType === "VERIFY"
          ? "VERIFY YOUR EMAIL ADDRESS FOR STREAK APP"
          : "RESET YOUR PASSWORD FOR STREAK App",
      html: htmlTemplate,
    };

    const emailResponse = await transporter.sendMail(mailOptions);

    if (releaseClient) {
      localClient.release();
    }

    return emailResponse;
  } catch (error: any) {
    if (client) {
      await localClient?.query("ROLLBACK");
    }

    if (!client && localClient) {
      localClient?.release();
    }

    console.log("Error sending email: ", error);
    throw new Error(error);
  }
};
