import { z } from "zod";

export const profileValidation = z.object({
  fullName: z
    .string()
    .min(1, { message: "full name is empty" })
    .max(50, { message: "no more than 50 charcters" }),
  bio: z.string().max(200, "no more than two hundered charcters"),
  //imageUrl: z.string(),
});
