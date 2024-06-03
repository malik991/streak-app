import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
//import pool from "@/lib/DbConnection";
import { db } from "@vercel/postgres";
import bcryptjs from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "malik@gmial.com ",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        const client = await db.connect();
        try {
          const getUser = await client.query(
            "SELECT * FROM users WHERE email = $1 or username = $1 LIMIT 1",
            [credentials?.identifier]
          );
          //console.log("credential: ", credentials.email);

          if (getUser.rows.length === 0) {
            throw new Error("no user found");
          }
          const user = getUser.rows[0];

          // Check if the email is verified
          if (!user.isverified) {
            throw new Error("Email not verified");
          }

          // for password we have to use like this credentials.password
          const isPasswordCorrect = await bcryptjs.compare(
            credentials.password,
            user.password_hash
          );
          if (!isPasswordCorrect) {
            throw new Error("password is incorrect");
          } else {
            return { id: user.id, email: user.email, name: user.username };
          }
        } catch (error: any) {
          throw new Error(error);
        } finally {
          client.release();
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 day
    //maxAge: 1 * 24 * 60 * 60, // 1 hour
  },
  secret: process.env.NEXTAUTH_SECRET,
};
