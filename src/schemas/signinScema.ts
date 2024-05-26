import { z } from "zod";

export const signInValidation = z.object({
  identifier: z.string(), // either email or username
  password: z.string().min(6, { message: "min 6 characters allowed" }),
});
