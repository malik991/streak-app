import nodemailer from "nodemailer";
import { emailOptions } from "@/types/emailOptions";
import { v4 as uuidv4 } from "uuid";
import pool from "@/lib/DbConnection";
import fs from "fs";
import ejs from "ejs";
import { PoolClient } from "pg";

export const sendEmail = async (
  { toEmailAddress, emailType, userId }: emailOptions,
  client: PoolClient | null = null
) => {
  let localClient = client;

  try {
    const releaseClient = !client; // Flag to determine if we need to release the client

    if (!localClient) {
      localClient = await pool.connect();
    }

    const hashedToken = uuidv4();
    const template = fs.readFileSync(
      "src/components/layout/emailTemplate.ejs",
      "utf8"
    );

    // Render the EJS template with the required data
    const htmlTemplate = ejs.render(template, {
      domain: process.env.DOMAIN,
      hashedToken,
      emailType,
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
      const tokenExpiry = new Date(timestamp).toISOString(); // Converts timestamp to ISO format

      await localClient.query("BEGIN");
      await localClient.query(
        `UPDATE users SET "forgotPasswordToken" = $1, "forgotPasswordExpiry" = $2 WHERE id = $3`,
        [hashedToken, tokenExpiry, userId]
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
        name: "Streak App Email Verification 👻",
        address: fromEmail,
      },
      to: toEmailAddress,
      subject:
        emailType === "VERIFY"
          ? "VERIFY YOUR EMAIL ADDRESS FOR STREAK APP"
          : "RESET YOUR PASSWORD",
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
