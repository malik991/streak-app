import { z } from "zod";

export const forgotPasswordValidation = z.object({
  verifyToken: z
    .string()
    .length(6, { message: "Must be exactly 6 characters long" }),
  newPassword: z
    .string()
    .min(6, { message: "min 6 characters allowed" })
    .max(25, { message: "no more than 25 chracters" }),
});
