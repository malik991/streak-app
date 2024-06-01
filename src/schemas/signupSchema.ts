import { z } from "zod";

// just one username field will validate
export const userValidate = z
  .string()
  .min(2, "userName must contain 2 characters")
  .max(20, "userName must be less than 21 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can not contain special characters");

// now full page for sign up validation

export const signUpValidation = z.object({
  username: userValidate,
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  termsCheckbox: z
    .boolean()
    .refine(
      (value) => value === true,
      "You must agree to the terms and conditions"
    ),
});
