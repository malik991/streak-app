import { z } from "zod";

export const signInValidation = z.object({
  identifier: z.string().min(1, { message: "username/email is empty" }), // either email or username
  password: z
    .string()
    .min(6, { message: "min 6 characters" })
    .max(25, { message: "no more than 25 chracters" }),
});
